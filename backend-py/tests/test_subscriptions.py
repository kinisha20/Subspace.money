"""
AntiGravity Test Suite
test_subscriptions.py — Subscription CRUD, billing cycle, renewal detection
"""
import pytest
from datetime import date, timedelta
from decimal import Decimal, InvalidOperation


# ─── Standalone subscription logic (no DB, pure function tests) ───────────────

VALID_BILLING_CYCLES = {"daily", "weekly", "monthly", "quarterly", "yearly"}
VALID_CURRENCIES = {"INR", "USD", "EUR", "GBP"}


def compute_next_billing_date(from_date: date, cycle: str) -> date:
    """Pure function: given current billing date and cycle, return next date."""
    if cycle == "daily":
        return from_date + timedelta(days=1)
    elif cycle == "weekly":
        return from_date + timedelta(weeks=1)
    elif cycle == "monthly":
        # Handle month roll-over
        month = from_date.month + 1
        year = from_date.year + (1 if month > 12 else 0)
        month = 1 if month > 12 else month
        try:
            return from_date.replace(year=year, month=month)
        except ValueError:
            # e.g. Jan 31 -> Feb 28
            import calendar
            last_day = calendar.monthrange(year, month)[1]
            return from_date.replace(year=year, month=month, day=last_day)
    elif cycle == "quarterly":
        return from_date + timedelta(days=91)
    elif cycle == "yearly":
        return from_date.replace(year=from_date.year + 1)
    raise ValueError(f"Unknown billing cycle: {cycle}")


def is_due_within(billing_date: date, days: int = 7) -> bool:
    """Return True if billing date falls within next N days."""
    today = date.today()
    return today <= billing_date <= today + timedelta(days=days)


def compute_annual_cost(amount: float, cycle: str) -> float:
    """Convert any billing cycle amount to annual equivalent."""
    multipliers = {
        "daily": 365,
        "weekly": 52,
        "monthly": 12,
        "quarterly": 4,
        "yearly": 1
    }
    if cycle not in multipliers:
        raise ValueError(f"Unknown cycle: {cycle}")
    return round(amount * multipliers[cycle], 2)


def validate_subscription_payload(payload: dict) -> list:
    """Return list of validation error strings, empty if valid."""
    errors = []
    if not payload.get("name", "").strip():
        errors.append("name is required")
    if payload.get("amount", 0) <= 0:
        errors.append("amount must be positive")
    if payload.get("billing_cycle") not in VALID_BILLING_CYCLES:
        errors.append(f"billing_cycle must be one of {VALID_BILLING_CYCLES}")
    try:
        billing_date = date.fromisoformat(str(payload.get("next_billing_at", "")))
    except (ValueError, TypeError):
        errors.append("next_billing_at must be a valid ISO date")
    return errors


# ─── TC-SUB-001: Next billing date computation ────────────────────────────────

class TestNextBillingDate:
    """TC-SUB-001 group: billing cycle date calculation correctness."""

    def test_monthly_cycle_adds_one_month(self):
        start = date(2026, 5, 15)
        nxt = compute_next_billing_date(start, "monthly")
        assert nxt == date(2026, 6, 15)

    def test_monthly_cycle_handles_jan_31_to_feb(self):
        """Jan 31 monthly should become Feb 28 (not crash)."""
        start = date(2026, 1, 31)
        nxt = compute_next_billing_date(start, "monthly")
        assert nxt.month == 2
        assert nxt.day == 28

    def test_yearly_cycle_adds_one_year(self):
        start = date(2026, 3, 10)
        nxt = compute_next_billing_date(start, "yearly")
        assert nxt == date(2027, 3, 10)

    def test_weekly_cycle_adds_seven_days(self):
        start = date(2026, 5, 1)
        nxt = compute_next_billing_date(start, "weekly")
        assert nxt == date(2026, 5, 8)

    def test_daily_cycle_adds_one_day(self):
        start = date(2026, 5, 29)
        nxt = compute_next_billing_date(start, "daily")
        assert nxt == date(2026, 5, 30)

    def test_quarterly_cycle_adds_91_days(self):
        start = date(2026, 1, 1)
        nxt = compute_next_billing_date(start, "quarterly")
        assert nxt == date(2026, 4, 2)

    def test_invalid_cycle_raises_value_error(self):
        with pytest.raises(ValueError):
            compute_next_billing_date(date.today(), "fortnightly")


# ─── TC-SUB-002: Renewal detection ────────────────────────────────────────────

class TestRenewalDetection:
    """TC-SUB-002 group: is_due_within detects upcoming renewals."""

    def test_billing_today_is_due(self):
        assert is_due_within(date.today(), days=3) is True

    def test_billing_in_3_days_is_due_within_7(self):
        future = date.today() + timedelta(days=3)
        assert is_due_within(future, days=7) is True

    def test_billing_in_8_days_is_not_due_within_7(self):
        future = date.today() + timedelta(days=8)
        assert is_due_within(future, days=7) is False

    def test_billing_yesterday_is_not_due(self):
        past = date.today() - timedelta(days=1)
        assert is_due_within(past, days=7) is False

    def test_billing_exactly_7_days_is_due(self):
        exactly = date.today() + timedelta(days=7)
        assert is_due_within(exactly, days=7) is True


# ─── TC-SUB-003: Annual cost calculation ──────────────────────────────────────

class TestAnnualCostCalculation:
    """TC-SUB-003 group: convert any cycle amount to yearly cost."""

    def test_monthly_649_annualises_to_7788(self):
        assert compute_annual_cost(649.0, "monthly") == 7788.0

    def test_yearly_amount_stays_same(self):
        assert compute_annual_cost(5000.0, "yearly") == 5000.0

    def test_weekly_100_annualises_correctly(self):
        assert compute_annual_cost(100.0, "weekly") == 5200.0

    def test_daily_10_annualises_correctly(self):
        assert compute_annual_cost(10.0, "daily") == 3650.0

    def test_quarterly_1000_annualises_to_4000(self):
        assert compute_annual_cost(1000.0, "quarterly") == 4000.0

    def test_invalid_cycle_raises(self):
        with pytest.raises(ValueError):
            compute_annual_cost(100.0, "biweekly")


# ─── TC-SUB-004: Payload validation ───────────────────────────────────────────

class TestSubscriptionPayloadValidation:
    """TC-SUB-004 group: field-level validation of subscription payloads."""

    def test_valid_payload_has_no_errors(self, subscription_payload):
        errors = validate_subscription_payload(subscription_payload)
        assert errors == []

    def test_missing_name_returns_error(self, subscription_payload):
        subscription_payload["name"] = ""
        errors = validate_subscription_payload(subscription_payload)
        assert any("name" in e for e in errors)

    def test_zero_amount_returns_error(self, subscription_payload):
        subscription_payload["amount"] = 0
        errors = validate_subscription_payload(subscription_payload)
        assert any("amount" in e for e in errors)

    def test_negative_amount_returns_error(self, subscription_payload):
        subscription_payload["amount"] = -100
        errors = validate_subscription_payload(subscription_payload)
        assert any("amount" in e for e in errors)

    def test_invalid_billing_cycle_returns_error(self, subscription_payload):
        subscription_payload["billing_cycle"] = "biweekly"
        errors = validate_subscription_payload(subscription_payload)
        assert any("billing_cycle" in e for e in errors)

    def test_invalid_date_format_returns_error(self, subscription_payload):
        subscription_payload["next_billing_at"] = "29-05-2026"
        errors = validate_subscription_payload(subscription_payload)
        assert any("next_billing_at" in e for e in errors)

    def test_all_valid_billing_cycles_pass(self, subscription_payload):
        for cycle in VALID_BILLING_CYCLES:
            subscription_payload["billing_cycle"] = cycle
            errors = validate_subscription_payload(subscription_payload)
            cycle_errors = [e for e in errors if "billing_cycle" in e]
            assert cycle_errors == [], f"Cycle '{cycle}' should be valid"
