"""
AntiGravity Backend — Subscriptions Router
All endpoints per design doc Table 4 (Section 4.4)
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel, field_validator
from datetime import date, timedelta
from decimal import Decimal

from app.database import get_db
from app.models import User, Subscription
from app.dependencies import get_current_user
from app.utils.redis_client import cache_set, cache_get, cache_delete, CacheKeys, TTL

router = APIRouter()

VALID_BILLING_CYCLES = {"daily", "weekly", "monthly", "quarterly", "yearly"}


# ─── Schemas ──────────────────────────────────────────────────────────────────

class SubscriptionCreate(BaseModel):
    name: str
    provider: Optional[str] = None
    amount: float
    currency: str = "INR"
    billing_cycle: str
    next_billing_at: date
    category: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("amount must be a positive number")
        return v

    @field_validator("billing_cycle")
    @classmethod
    def valid_cycle(cls, v):
        if v not in VALID_BILLING_CYCLES:
            raise ValueError(f"billing_cycle must be one of {VALID_BILLING_CYCLES}")
        return v


class SubscriptionUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    amount: Optional[float] = None
    billing_cycle: Optional[str] = None
    next_billing_at: Optional[date] = None
    category: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class SubscriptionOut(BaseModel):
    id: str
    user_id: str
    name: str
    provider: Optional[str]
    amount: float
    currency: str
    billing_cycle: str
    next_billing_at: date
    category: Optional[str]
    notes: Optional[str]
    is_active: bool
    created_at: str

    class Config:
        from_attributes = True


def _to_out(sub: Subscription) -> dict:
    return {
        "id": str(sub.id),
        "user_id": str(sub.user_id),
        "name": sub.name,
        "provider": sub.provider,
        "amount": float(sub.amount),
        "currency": sub.currency,
        "billing_cycle": sub.billing_cycle,
        "next_billing_at": sub.next_billing_at.isoformat(),
        "category": sub.category,
        "notes": sub.notes,
        "is_active": sub.is_active,
        "created_at": sub.created_at.isoformat() if sub.created_at else None,
    }


# ─── GET /subscriptions ───────────────────────────────────────────────────────

@router.get("/")
def list_subscriptions(
    is_active: Optional[bool] = Query(None),
    category: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all subscriptions for the authenticated user. Cached 5 min."""
    cache_key = CacheKeys.subscriptions(str(current_user.id))

    if not category and is_active is None:
        cached = cache_get(cache_key)
        if cached:
            return {"data": cached, "cached": True}

    query = db.query(Subscription).filter(Subscription.user_id == current_user.id)
    if is_active is not None:
        query = query.filter(Subscription.is_active == is_active)
    if category:
        query = query.filter(Subscription.category == category)
    subs = query.order_by(Subscription.next_billing_at.asc()).all()
    result = [_to_out(s) for s in subs]

    if not category and is_active is None:
        cache_set(cache_key, result, TTL.SUBSCRIPTIONS)

    return {"data": result, "total": len(result)}


# ─── POST /subscriptions ──────────────────────────────────────────────────────

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_subscription(
    payload: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new subscription. Invalidates cache."""
    sub = Subscription(
        user_id=current_user.id,
        name=payload.name,
        provider=payload.provider,
        amount=Decimal(str(payload.amount)),
        currency=payload.currency,
        billing_cycle=payload.billing_cycle,
        next_billing_at=payload.next_billing_at,
        category=payload.category,
        notes=payload.notes,
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    cache_delete(CacheKeys.subscriptions(str(current_user.id)))
    return {"data": _to_out(sub)}


# ─── GET /subscriptions/{id} ──────────────────────────────────────────────────

@router.get("/{sub_id}")
def get_subscription(
    sub_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sub = db.query(Subscription).filter(
        Subscription.id == sub_id,
        Subscription.user_id == current_user.id
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found.")
    return {"data": _to_out(sub)}


# ─── PUT /subscriptions/{id} ──────────────────────────────────────────────────

@router.put("/{sub_id}")
def update_subscription(
    sub_id: str,
    payload: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sub = db.query(Subscription).filter(
        Subscription.id == sub_id,
        Subscription.user_id == current_user.id
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found.")

    update_data = payload.model_dump(exclude_unset=True)
    if "amount" in update_data:
        update_data["amount"] = Decimal(str(update_data["amount"]))
    for field, value in update_data.items():
        setattr(sub, field, value)

    db.commit()
    db.refresh(sub)
    cache_delete(CacheKeys.subscriptions(str(current_user.id)))
    return {"data": _to_out(sub)}


# ─── DELETE /subscriptions/{id} (soft delete) ────────────────────────────────

@router.delete("/{sub_id}", status_code=status.HTTP_200_OK)
def delete_subscription(
    sub_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Soft delete — sets is_active=False per design doc."""
    sub = db.query(Subscription).filter(
        Subscription.id == sub_id,
        Subscription.user_id == current_user.id
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found.")
    sub.is_active = False
    db.commit()
    cache_delete(CacheKeys.subscriptions(str(current_user.id)))
    return {"success": True, "message": f"Subscription '{sub.name}' deactivated."}


# ─── GET /subscriptions/summary ──────────────────────────────────────────────

@router.get("/summary/costs")
def subscription_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Monthly and annual cost totals by category (Table 4)."""
    multipliers = {"daily": 30, "weekly": 4.33, "monthly": 1, "quarterly": 1/3, "yearly": 1/12}
    subs = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True
    ).all()

    total_monthly = 0.0
    by_category: dict = {}
    for sub in subs:
        monthly = float(sub.amount) * multipliers.get(sub.billing_cycle, 1)
        total_monthly += monthly
        cat = sub.category or "Uncategorised"
        by_category[cat] = by_category.get(cat, 0) + monthly

    return {
        "total_monthly": round(total_monthly, 2),
        "total_annual":  round(total_monthly * 12, 2),
        "by_category":   {k: round(v, 2) for k, v in by_category.items()},
        "count":         len(subs),
    }


# ─── GET /subscriptions/upcoming ─────────────────────────────────────────────

@router.get("/upcoming/renewals")
def upcoming_renewals(
    days: int = Query(7, ge=1, le=90),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List subscriptions renewing in next N days (default 7)."""
    today = date.today()
    cutoff = today + timedelta(days=days)
    subs = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.is_active == True,
        Subscription.next_billing_at >= today,
        Subscription.next_billing_at <= cutoff,
    ).order_by(Subscription.next_billing_at.asc()).all()
    return {"data": [_to_out(s) for s in subs], "total": len(subs)}
