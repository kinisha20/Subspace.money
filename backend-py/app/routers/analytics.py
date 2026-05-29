"""
AntiGravity Backend — Analytics Router
SQL window functions for monthly trends per design doc Section 7.3 (Listing 13)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from datetime import date

from app.database import get_db
from app.models import User
from app.dependencies import get_current_user
from app.utils.redis_client import cache_set, cache_get, CacheKeys, TTL

router = APIRouter()


# ─── GET /analytics/spending-trend ───────────────────────────────────────────

@router.get("/spending-trend")
def spending_trend(
    months: int = 12,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Monthly spend by category with month-over-month delta.
    SQL window functions per design doc Listing 13 (Section 7.3).
    """
    month_key = date.today().strftime("%Y-%m")
    cache_key = CacheKeys.analytics(str(current_user.id), month_key)
    cached = cache_get(cache_key)
    if cached:
        return cached

    # Exact SQL from design doc Listing 13
    sql = text("""
        SELECT
            DATE_TRUNC('month', expense_at) AS month,
            category,
            SUM(amount) AS total_spend,
            SUM(amount) - LAG(SUM(amount)) OVER (
                PARTITION BY category
                ORDER BY DATE_TRUNC('month', expense_at)
            ) AS month_delta
        FROM expenses
        WHERE user_id = :user_id
          AND expense_at >= NOW() - INTERVAL ':months months'
        GROUP BY 1, 2
        ORDER BY 1 DESC, 3 DESC;
    """)

    try:
        rows = db.execute(sql, {"user_id": str(current_user.id), "months": months}).fetchall()
        result = [
            {
                "month": str(row.month)[:7],
                "category": row.category,
                "total_spend": float(row.total_spend),
                "month_delta": float(row.month_delta) if row.month_delta is not None else None,
            }
            for row in rows
        ]
    except Exception:
        # Fallback if no expense data yet
        result = []

    data = {"data": result, "months": months}
    cache_set(cache_key, data, TTL.ANALYTICS)
    return data


# ─── GET /analytics/summary ───────────────────────────────────────────────────

@router.get("/summary")
def analytics_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Overall financial summary — subscriptions, goals progress, spending."""
    user_id = str(current_user.id)

    # Subscription costs
    from app.models import Subscription, SavingsGoal
    multipliers = {"daily": 30, "weekly": 4.33, "monthly": 1, "quarterly": 1/3, "yearly": 1/12}
    subs = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).all()
    monthly_sub_cost = sum(float(s.amount) * multipliers.get(s.billing_cycle, 1) for s in subs)

    # Savings goals
    goals = db.query(SavingsGoal).filter(
        SavingsGoal.user_id == current_user.id,
        SavingsGoal.is_completed == False
    ).all()
    total_saved  = sum(float(g.saved_amount)  for g in goals)
    total_target = sum(float(g.target_amount) for g in goals)

    return {
        "subscriptions": {
            "monthly_cost": round(monthly_sub_cost, 2),
            "annual_cost":  round(monthly_sub_cost * 12, 2),
            "active_count": len(subs),
        },
        "savings": {
            "total_saved":  round(total_saved, 2),
            "total_target": round(total_target, 2),
            "progress_pct": round(total_saved / total_target * 100, 1) if total_target else 0,
            "active_goals": len(goals),
        },
    }


# ─── GET /analytics/subscriptions/breakdown ──────────────────────────────────

@router.get("/subscriptions/breakdown")
def subscription_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Subscription cost breakdown by category for pie chart."""
    from app.models import Subscription
    multipliers = {"daily": 30, "weekly": 4.33, "monthly": 1, "quarterly": 1/3, "yearly": 1/12}
    subs = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).all()

    by_category: dict = {}
    for sub in subs:
        monthly = float(sub.amount) * multipliers.get(sub.billing_cycle, 1)
        cat = sub.category or "Other"
        by_category[cat] = by_category.get(cat, 0) + monthly

    total = sum(by_category.values())
    return {
        "data": [
            {"category": k, "monthly": round(v, 2), "pct": round(v/total*100, 1) if total else 0}
            for k, v in sorted(by_category.items(), key=lambda x: -x[1])
        ]
    }
