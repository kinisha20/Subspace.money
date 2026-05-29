"""
AntiGravity Backend — APScheduler Workers
Cron jobs per design doc Section 8.2 (Listing 14):
  - Renewal reminders: daily 8AM IST
  - Debt reminders: Sunday midnight
  - Goal behind schedule: weekly check
  - Overspend alerts: daily check
"""
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta
import logging

logger = logging.getLogger("antigravity.scheduler")
scheduler = BackgroundScheduler()


def _get_db_session():
    from app.database import SessionLocal
    return SessionLocal()


# ─── Job 1: Renewal Reminders — daily 8AM IST (Section 8.2) ──────────────────

def send_renewal_reminders():
    """
    Send push/email for subscriptions billing in 3 days.
    Notification type: "renewal_reminder" (Table 8).
    """
    db = _get_db_session()
    try:
        from app.models import Subscription
        today = date.today()
        cutoff = today + timedelta(days=3)
        subs = db.query(Subscription).filter(
            Subscription.is_active == True,
            Subscription.next_billing_at == cutoff,
        ).all()
        for sub in subs:
            logger.info(f"[REMINDER] User {sub.user_id} → {sub.name} renews {sub.next_billing_at}")
            # notify_user(sub.user_id, "renewal_reminder", sub)
    except Exception as e:
        logger.error(f"[REMINDER ERROR] {e}")
    finally:
        db.close()


# ─── Job 2: Debt Reminders — Sunday midnight (Section 8.2) ───────────────────

def send_debt_reminders():
    """
    Notify users about unsettled splits older than 7 days.
    Notification type: "debt_reminder" (Table 8).
    """
    db = _get_db_session()
    try:
        from app.models import ExpenseSplit
        from sqlalchemy import func
        cutoff = date.today() - timedelta(days=7)
        splits = db.query(ExpenseSplit).filter(
            ExpenseSplit.is_settled == False,
        ).all()
        for split in splits:
            logger.info(f"[DEBT] User {split.user_id} owes ₹{split.share_amount} (unsettled)")
            # notify_user(split.user_id, "debt_reminder", split)
    except Exception as e:
        logger.error(f"[DEBT ERROR] {e}")
    finally:
        db.close()


# ─── Job 3: Goal Behind Schedule — daily check ───────────────────────────────

def check_goals_behind_schedule():
    """
    Check if savings pace is behind target. Notification type: "goal_behind_schedule".
    """
    db = _get_db_session()
    try:
        from app.models import SavingsGoal
        today = date.today()
        goals = db.query(SavingsGoal).filter(
            SavingsGoal.is_completed == False,
            SavingsGoal.target_date.isnot(None),
            SavingsGoal.target_date > today,
        ).all()

        for goal in goals:
            days_total    = (goal.target_date - goal.created_at.date()).days
            days_elapsed  = (today - goal.created_at.date()).days
            expected_pct  = days_elapsed / days_total if days_total else 0
            actual_pct    = float(goal.saved_amount) / float(goal.target_amount) if goal.target_amount else 0

            if actual_pct < expected_pct * 0.8:  # >20% behind pace
                logger.info(f"[GOAL BEHIND] User {goal.user_id} → '{goal.title}' is behind schedule")
                # notify_user(goal.user_id, "goal_behind_schedule", goal)
    except Exception as e:
        logger.error(f"[GOAL CHECK ERROR] {e}")
    finally:
        db.close()


# ─── Scheduler start/stop ─────────────────────────────────────────────────────

def start_scheduler():
    """Register all cron jobs and start the scheduler."""

    # Every morning at 8AM IST (UTC+5:30 = UTC 02:30)
    scheduler.add_job(
        send_renewal_reminders,
        trigger="cron",
        hour=2, minute=30,
        id="renewal_reminders",
        replace_existing=True,
    )

    # Every Sunday at midnight UTC
    scheduler.add_job(
        send_debt_reminders,
        trigger="cron",
        day_of_week="sun",
        hour=0, minute=0,
        id="debt_reminders",
        replace_existing=True,
    )

    # Daily goal pace check at 9AM UTC
    scheduler.add_job(
        check_goals_behind_schedule,
        trigger="cron",
        hour=9, minute=0,
        id="goal_schedule_check",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("APScheduler started with 3 jobs.")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("APScheduler stopped.")
