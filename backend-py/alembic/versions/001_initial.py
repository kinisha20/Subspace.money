"""Initial migration — create all tables

Revision ID: 001_initial
Create Date: 2026-05-29
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── users ────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id",            UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email",         sa.String(255), nullable=False),
        sa.Column("phone",         sa.String(15)),
        sa.Column("full_name",     sa.String(100), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("avatar_url",    sa.Text),
        sa.Column("currency",      sa.String(3),  server_default="INR"),
        sa.Column("timezone",      sa.String(50), server_default="Asia/Kolkata"),
        sa.Column("is_verified",   sa.Boolean,    server_default="false"),
        sa.Column("is_active",     sa.Boolean,    server_default="true"),
        sa.Column("created_at",    sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at",    sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_users_email", "users", ["email"], unique=True)

    # ── subscriptions ────────────────────────────────────────────────────────
    op.create_table(
        "subscriptions",
        sa.Column("id",              UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id",         UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name",            sa.String(100), nullable=False),
        sa.Column("provider",        sa.String(100)),
        sa.Column("amount",          sa.Numeric(10, 2), nullable=False),
        sa.Column("currency",        sa.String(3), server_default="INR"),
        sa.Column("billing_cycle",   sa.String(20), nullable=False),
        sa.Column("next_billing_at", sa.Date, nullable=False),
        sa.Column("category",        sa.String(50)),
        sa.Column("notes",           sa.Text),
        sa.Column("is_active",       sa.Boolean, server_default="true"),
        sa.Column("created_at",      sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.CheckConstraint("billing_cycle IN ('daily','weekly','monthly','quarterly','yearly')", name="chk_billing_cycle"),
    )
    op.create_index("idx_subs_user",    "subscriptions", ["user_id"])
    op.create_index("idx_subs_billing", "subscriptions", ["next_billing_at"])

    # ── groups ───────────────────────────────────────────────────────────────
    op.create_table(
        "groups",
        sa.Column("id",          UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name",        sa.String(100), nullable=False),
        sa.Column("created_by",  UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("created_at",  sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    # ── group_members ────────────────────────────────────────────────────────
    op.create_table(
        "group_members",
        sa.Column("id",        UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("group_id",  UUID(as_uuid=True), sa.ForeignKey("groups.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id",   UUID(as_uuid=True), sa.ForeignKey("users.id",  ondelete="CASCADE"), nullable=False),
        sa.Column("role",      sa.String(20), server_default="member"),
        sa.Column("joined_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.UniqueConstraint("group_id", "user_id", name="uq_group_member"),
        sa.CheckConstraint("role IN ('admin','member')", name="chk_member_role"),
    )

    # ── expenses ─────────────────────────────────────────────────────────────
    op.create_table(
        "expenses",
        sa.Column("id",         UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("group_id",   UUID(as_uuid=True), sa.ForeignKey("groups.id", ondelete="CASCADE"), nullable=False),
        sa.Column("paid_by",    UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title",      sa.String(150), nullable=False),
        sa.Column("amount",     sa.Numeric(10, 2), nullable=False),
        sa.Column("currency",   sa.String(3), server_default="INR"),
        sa.Column("category",   sa.String(50)),
        sa.Column("expense_at", sa.Date, server_default=sa.text("CURRENT_DATE")),
        sa.Column("notes",      sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    # ── expense_splits ───────────────────────────────────────────────────────
    op.create_table(
        "expense_splits",
        sa.Column("id",           UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("expense_id",   UUID(as_uuid=True), sa.ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id",      UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("share_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("is_settled",   sa.Boolean, server_default="false"),
        sa.Column("settled_at",   sa.DateTime(timezone=True)),
    )
    op.create_index("idx_splits_user", "expense_splits", ["user_id", "is_settled"])

    # ── savings_goals ────────────────────────────────────────────────────────
    op.create_table(
        "savings_goals",
        sa.Column("id",            UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id",       UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title",         sa.String(100), nullable=False),
        sa.Column("target_amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("saved_amount",  sa.Numeric(10, 2), server_default="0"),
        sa.Column("target_date",   sa.Date),
        sa.Column("category",      sa.String(50)),
        sa.Column("colour",        sa.String(7), server_default="#1A3C34"),
        sa.Column("is_completed",  sa.Boolean, server_default="false"),
        sa.Column("created_at",    sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    # ── goal_contributions ────────────────────────────────────────────────────
    op.create_table(
        "goal_contributions",
        sa.Column("id",             UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("goal_id",        UUID(as_uuid=True), sa.ForeignKey("savings_goals.id", ondelete="CASCADE"), nullable=False),
        sa.Column("amount",         sa.Numeric(10, 2), nullable=False),
        sa.Column("note",           sa.Text),
        sa.Column("contributed_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )


def downgrade() -> None:
    op.drop_table("goal_contributions")
    op.drop_table("savings_goals")
    op.drop_index("idx_splits_user", table_name="expense_splits")
    op.drop_table("expense_splits")
    op.drop_table("expenses")
    op.drop_table("group_members")
    op.drop_table("groups")
    op.drop_index("idx_subs_billing", table_name="subscriptions")
    op.drop_index("idx_subs_user",    table_name="subscriptions")
    op.drop_table("subscriptions")
    op.drop_index("idx_users_email",  table_name="users")
    op.drop_table("users")
