"""
AntiGravity Backend — Groups & Expenses Router
Endpoints per design doc Tables 5 (Section 4.7)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import date
from decimal import Decimal

from app.database import get_db
from app.models import User, Group, GroupMember, Expense, ExpenseSplit
from app.dependencies import get_current_user
from app.utils.redis_client import cache_delete, CacheKeys

router = APIRouter()
expenses_router = APIRouter()


# ─── Schemas ──────────────────────────────────────────────────────────────────

class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None


class MemberInvite(BaseModel):
    email: EmailStr


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    currency: str = "INR"
    category: Optional[str] = None
    expense_at: Optional[date] = None
    notes: Optional[str] = None
    split_type: str = "equal"               # "equal" | "custom"
    custom_splits: Optional[dict] = None    # {user_id: amount}


class SettleSplit(BaseModel):
    split_id: str


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _group_out(g: Group) -> dict:
    return {
        "id":          str(g.id),
        "name":        g.name,
        "description": g.description,
        "created_by":  str(g.created_by),
        "member_count": len(g.members),
        "created_at":  g.created_at.isoformat() if g.created_at else None,
    }


def _expense_out(e: Expense) -> dict:
    return {
        "id":         str(e.id),
        "group_id":   str(e.group_id),
        "paid_by":    str(e.paid_by),
        "title":      e.title,
        "amount":     float(e.amount),
        "currency":   e.currency,
        "category":   e.category,
        "expense_at": e.expense_at.isoformat() if e.expense_at else None,
        "splits": [
            {
                "id":           str(s.id),
                "user_id":      str(s.user_id),
                "share_amount": float(s.share_amount),
                "is_settled":   s.is_settled,
            }
            for s in e.splits
        ],
    }


# ─── GET /groups ──────────────────────────────────────────────────────────────

@router.get("/")
def list_groups(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List groups the user belongs to."""
    memberships = db.query(GroupMember).filter(GroupMember.user_id == current_user.id).all()
    group_ids = [m.group_id for m in memberships]
    groups = db.query(Group).filter(Group.id.in_(group_ids)).all()
    return {"data": [_group_out(g) for g in groups]}


# ─── POST /groups ─────────────────────────────────────────────────────────────

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_group(
    payload: GroupCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    group = Group(
        name=payload.name,
        description=payload.description,
        created_by=current_user.id,
    )
    db.add(group)
    db.flush()  # Get group.id before committing

    # Creator is automatically an admin member
    member = GroupMember(group_id=group.id, user_id=current_user.id, role="admin")
    db.add(member)
    db.commit()
    db.refresh(group)
    return {"data": _group_out(group)}


# ─── POST /groups/{id}/members — invite by email ──────────────────────────────

@router.post("/{group_id}/members", status_code=status.HTTP_201_CREATED)
def invite_member(
    group_id: str,
    payload: MemberInvite,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Verify admin
    my_membership = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == current_user.id,
        GroupMember.role == "admin",
    ).first()
    if not my_membership:
        raise HTTPException(status_code=403, detail="Only group admins can invite members.")

    # Find user by email
    invited_user = db.query(User).filter(User.email == payload.email).first()
    if not invited_user:
        raise HTTPException(status_code=404, detail="No user found with that email.")

    existing = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == invited_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="User is already a member of this group.")

    member = GroupMember(group_id=group_id, user_id=invited_user.id, role="member")
    db.add(member)
    db.commit()
    return {"success": True, "message": f"{invited_user.full_name} added to group."}


# ─── GET /groups/{id}/expenses ────────────────────────────────────────────────

@router.get("/{group_id}/expenses")
def list_expenses(
    group_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _verify_member(group_id, current_user.id, db)
    expenses = db.query(Expense).filter(Expense.group_id == group_id).order_by(Expense.expense_at.desc()).all()
    return {"data": [_expense_out(e) for e in expenses]}


# ─── POST /groups/{id}/expenses ───────────────────────────────────────────────

@router.post("/{group_id}/expenses", status_code=status.HTTP_201_CREATED)
def log_expense(
    group_id: str,
    payload: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _verify_member(group_id, current_user.id, db)

    expense = Expense(
        group_id=group_id,
        paid_by=current_user.id,
        title=payload.title,
        amount=Decimal(str(payload.amount)),
        currency=payload.currency,
        category=payload.category,
        expense_at=payload.expense_at or date.today(),
        notes=payload.notes,
    )
    db.add(expense)
    db.flush()

    # Calculate splits
    members = db.query(GroupMember).filter(GroupMember.group_id == group_id).all()
    member_ids = [str(m.user_id) for m in members]

    if payload.split_type == "equal":
        share = Decimal(str(payload.amount)) / len(member_ids)
        for uid in member_ids:
            db.add(ExpenseSplit(expense_id=expense.id, user_id=uid, share_amount=share))
    elif payload.split_type == "custom" and payload.custom_splits:
        for uid, amount in payload.custom_splits.items():
            db.add(ExpenseSplit(expense_id=expense.id, user_id=uid, share_amount=Decimal(str(amount))))

    db.commit()
    db.refresh(expense)
    cache_delete(CacheKeys.group_balance(group_id))
    return {"data": _expense_out(expense)}


# ─── GET /groups/{id}/balances ────────────────────────────────────────────────

@router.get("/{group_id}/balances")
def get_balances(
    group_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Who owes what to whom in this group."""
    from app.utils.redis_client import cache_get, cache_set, TTL
    cached = cache_get(CacheKeys.group_balance(group_id))
    if cached:
        return cached

    _verify_member(group_id, current_user.id, db)
    expenses = db.query(Expense).filter(Expense.group_id == group_id).all()

    balances: dict = {}
    for exp in expenses:
        payer = str(exp.paid_by)
        balances[payer] = balances.get(payer, 0) + float(exp.amount)
        for split in exp.splits:
            uid = str(split.user_id)
            if not split.is_settled:
                balances[uid] = balances.get(uid, 0) - float(split.share_amount)

    result = {"balances": {k: round(v, 2) for k, v in balances.items()}}
    cache_set(CacheKeys.group_balance(group_id), result, TTL.GROUP_BALANCE)
    return result


# ─── POST /expenses/{id}/settle ───────────────────────────────────────────────

@expenses_router.post("/{expense_id}/settle")
def settle_split(
    expense_id: str,
    split_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark an expense split as settled."""
    from datetime import datetime, timezone
    split = db.query(ExpenseSplit).filter(
        ExpenseSplit.id == split_id,
        ExpenseSplit.expense_id == expense_id,
        ExpenseSplit.user_id == current_user.id,
    ).first()
    if not split:
        raise HTTPException(status_code=404, detail="Split not found.")
    split.is_settled = True
    split.settled_at = datetime.now(timezone.utc)
    db.commit()

    # Invalidate group balance cache
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if expense:
        cache_delete(CacheKeys.group_balance(str(expense.group_id)))

    return {"success": True, "message": "Split marked as settled."}


# ─── Helper ───────────────────────────────────────────────────────────────────

def _verify_member(group_id: str, user_id, db: Session):
    m = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id
    ).first()
    if not m:
        raise HTTPException(status_code=403, detail="You are not a member of this group.")
