"""
AntiGravity Backend — SQLAlchemy ORM Models
Exact schema per system design document Section 3.2
"""
import uuid
from datetime import datetime, date
from sqlalchemy import (
    Column, String, Boolean, Numeric, Date, Text,
    ForeignKey, DateTime, UniqueConstraint, CheckConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


# ─── Users ────────────────────────────────────────────────────────────────────

class User(Base):
    """
    DDL: Section 3.2.1 — users table
    """
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    phone         = Column(String(15), unique=True, nullable=True)
    full_name     = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    avatar_url    = Column(Text, nullable=True)
    currency      = Column(String(3), default="INR")
    timezone      = Column(String(50), default="Asia/Kolkata")
    is_verified   = Column(Boolean, default=False)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    subscriptions   = relationship("Subscription",   back_populates="user", cascade="all, delete-orphan")
    savings_goals   = relationship("SavingsGoal",    back_populates="user", cascade="all, delete-orphan")
    owned_groups    = relationship("Group",          back_populates="owner", foreign_keys="Group.created_by")
    group_memberships = relationship("GroupMember",  back_populates="user", cascade="all, delete-orphan")
    paid_expenses   = relationship("Expense",        back_populates="paid_by_user")
    expense_splits  = relationship("ExpenseSplit",   back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User id={self.id} email={self.email}>"


# ─── Subscriptions ────────────────────────────────────────────────────────────

class Subscription(Base):
    """
    DDL: Section 3.2.2 — subscriptions table
    """
    __tablename__ = "subscriptions"
    __table_args__ = (
        CheckConstraint(
            "billing_cycle IN ('daily','weekly','monthly','quarterly','yearly')",
            name="chk_billing_cycle"
        ),
        Index("idx_subs_user",    "user_id"),
        Index("idx_subs_billing", "next_billing_at"),
    )

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name            = Column(String(100), nullable=False)
    provider        = Column(String(100), nullable=True)
    amount          = Column(Numeric(10, 2), nullable=False)
    currency        = Column(String(3), default="INR")
    billing_cycle   = Column(String(20), nullable=False)
    next_billing_at = Column(Date, nullable=False)
    category        = Column(String(50), nullable=True)
    notes           = Column(Text, nullable=True)
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="subscriptions")

    def __repr__(self):
        return f"<Subscription name={self.name} amount={self.amount}>"


# ─── Groups ───────────────────────────────────────────────────────────────────

class Group(Base):
    """
    DDL: Section 3.2.3 — groups table
    """
    __tablename__ = "groups"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(100), nullable=False)
    created_by  = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    description = Column(Text, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    owner   = relationship("User", back_populates="owned_groups", foreign_keys=[created_by])
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="group", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Group name={self.name}>"


class GroupMember(Base):
    """
    DDL: Section 3.2.3 — group_members table
    """
    __tablename__ = "group_members"
    __table_args__ = (
        UniqueConstraint("group_id", "user_id", name="uq_group_member"),
        CheckConstraint("role IN ('admin','member')", name="chk_member_role"),
    )

    id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id  = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)
    user_id   = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role      = Column(String(20), default="member")
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    group = relationship("Group",  back_populates="members")
    user  = relationship("User",   back_populates="group_memberships")

    def __repr__(self):
        return f"<GroupMember group_id={self.group_id} user_id={self.user_id}>"


# ─── Expenses & Splits ────────────────────────────────────────────────────────

class Expense(Base):
    """
    DDL: Section 3.2.4 — expenses table
    """
    __tablename__ = "expenses"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id    = Column(UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)
    paid_by     = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title       = Column(String(150), nullable=False)
    amount      = Column(Numeric(10, 2), nullable=False)
    currency    = Column(String(3), default="INR")
    category    = Column(String(50), nullable=True)
    expense_at  = Column(Date, nullable=False, server_default=func.current_date())
    notes       = Column(Text, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    group        = relationship("Group",        back_populates="expenses")
    paid_by_user = relationship("User",         back_populates="paid_expenses", foreign_keys=[paid_by])
    splits       = relationship("ExpenseSplit", back_populates="expense",       cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Expense title={self.title} amount={self.amount}>"


class ExpenseSplit(Base):
    """
    DDL: Section 3.2.4 — expense_splits table
    """
    __tablename__ = "expense_splits"
    __table_args__ = (
        Index("idx_splits_user", "user_id", "is_settled"),
    )

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    expense_id   = Column(UUID(as_uuid=True), ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    share_amount = Column(Numeric(10, 2), nullable=False)
    is_settled   = Column(Boolean, default=False)
    settled_at   = Column(DateTime(timezone=True), nullable=True)

    expense = relationship("Expense", back_populates="splits")
    user    = relationship("User",    back_populates="expense_splits")

    def __repr__(self):
        return f"<ExpenseSplit user_id={self.user_id} amount={self.share_amount} settled={self.is_settled}>"


# ─── Savings Goals ────────────────────────────────────────────────────────────

class SavingsGoal(Base):
    """
    DDL: Section 3.2.5 — savings_goals table
    """
    __tablename__ = "savings_goals"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id        = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title          = Column(String(100), nullable=False)
    target_amount  = Column(Numeric(10, 2), nullable=False)
    saved_amount   = Column(Numeric(10, 2), default=0)
    target_date    = Column(Date, nullable=True)
    category       = Column(String(50), nullable=True)
    colour         = Column(String(7), default="#1A3C34")
    is_completed   = Column(Boolean, default=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    user          = relationship("User",               back_populates="savings_goals")
    contributions = relationship("GoalContribution",   back_populates="goal", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<SavingsGoal title={self.title} saved={self.saved_amount}/{self.target_amount}>"


class GoalContribution(Base):
    """
    DDL: Section 3.2.5 — goal_contributions table
    """
    __tablename__ = "goal_contributions"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id        = Column(UUID(as_uuid=True), ForeignKey("savings_goals.id", ondelete="CASCADE"), nullable=False)
    amount         = Column(Numeric(10, 2), nullable=False)
    note           = Column(Text, nullable=True)
    contributed_at = Column(DateTime(timezone=True), server_default=func.now())

    goal = relationship("SavingsGoal", back_populates="contributions")

    def __repr__(self):
        return f"<GoalContribution amount={self.amount}>"
