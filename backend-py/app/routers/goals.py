"""
AntiGravity Backend — Goals Router
CRUD + contributions per design doc Table 6 (Section 4.8)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from datetime import date
from decimal import Decimal

from app.database import get_db
from app.models import User, SavingsGoal, GoalContribution
from app.dependencies import get_current_user
from app.utils.redis_client import cache_set, cache_get, cache_delete, CacheKeys, TTL

router = APIRouter()


class GoalCreate(BaseModel):
    title: str
    target_amount: float
    target_date: Optional[date] = None
    category: Optional[str] = None
    colour: str = "#1A3C34"


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = None
    target_date: Optional[date] = None
    category: Optional[str] = None
    colour: Optional[str] = None


class ContributionCreate(BaseModel):
    amount: float
    note: Optional[str] = None


def _to_out(g: SavingsGoal, include_contributions: bool = False) -> dict:
    d = {
        "id":            str(g.id),
        "user_id":       str(g.user_id),
        "title":         g.title,
        "target_amount": float(g.target_amount),
        "saved_amount":  float(g.saved_amount),
        "progress_pct":  round(float(g.saved_amount) / float(g.target_amount) * 100, 1) if g.target_amount else 0,
        "target_date":   g.target_date.isoformat() if g.target_date else None,
        "category":      g.category,
        "colour":        g.colour,
        "is_completed":  g.is_completed,
        "created_at":    g.created_at.isoformat() if g.created_at else None,
    }
    if include_contributions:
        d["contributions"] = [
            {
                "id":             str(c.id),
                "amount":         float(c.amount),
                "note":           c.note,
                "contributed_at": c.contributed_at.isoformat() if c.contributed_at else None,
            }
            for c in g.contributions
        ]
    return d


MILESTONE_PCTS = [25, 50, 75, 100]


@router.get("/")
def list_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goals = db.query(SavingsGoal).filter(SavingsGoal.user_id == current_user.id).all()
    return {"data": [_to_out(g) for g in goals], "total": len(goals)}


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = SavingsGoal(
        user_id=current_user.id,
        title=payload.title,
        target_amount=Decimal(str(payload.target_amount)),
        target_date=payload.target_date,
        category=payload.category,
        colour=payload.colour,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {"data": _to_out(goal)}


@router.get("/{goal_id}")
def get_goal(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get goal detail with full contribution history."""
    cached = cache_get(CacheKeys.goal(goal_id))
    if cached:
        return {"data": cached}

    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == current_user.id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")

    result = _to_out(goal, include_contributions=True)
    cache_set(CacheKeys.goal(goal_id), result, TTL.GOAL)
    return {"data": result}


@router.post("/{goal_id}/contribute", status_code=status.HTTP_201_CREATED)
def add_contribution(
    goal_id: str,
    payload: ContributionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a contribution. Invalidates goal cache. Triggers milestone check."""
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == current_user.id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")

    contrib = GoalContribution(
        goal_id=goal.id,
        amount=Decimal(str(payload.amount)),
        note=payload.note,
    )
    db.add(contrib)

    prev_pct = float(goal.saved_amount) / float(goal.target_amount) * 100 if goal.target_amount else 0
    goal.saved_amount = Decimal(str(float(goal.saved_amount) + payload.amount))
    new_pct = float(goal.saved_amount) / float(goal.target_amount) * 100 if goal.target_amount else 0

    if new_pct >= 100:
        goal.is_completed = True
        milestone_hit = 100
    else:
        milestone_hit = next((m for m in MILESTONE_PCTS if prev_pct < m <= new_pct), None)

    db.commit()
    db.refresh(goal)
    cache_delete(CacheKeys.goal(goal_id))

    return {
        "data": _to_out(goal),
        "milestone_hit": milestone_hit,
        "message": f"Milestone {milestone_hit}% reached! 🎉" if milestone_hit else "Contribution added.",
    }


@router.put("/{goal_id}")
def update_goal(
    goal_id: str,
    payload: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == current_user.id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "target_amount" and value is not None:
            value = Decimal(str(value))
        setattr(goal, field, value)

    db.commit()
    db.refresh(goal)
    cache_delete(CacheKeys.goal(goal_id))
    return {"data": _to_out(goal)}


@router.delete("/{goal_id}", status_code=status.HTTP_200_OK)
def delete_goal(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == current_user.id
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")
    db.delete(goal)
    db.commit()
    cache_delete(CacheKeys.goal(goal_id))
    return {"success": True}
