"""
AntiGravity Test Suite
test_savings_goals.py — Goal creation, contribution tracking, milestone detection
"""
import pytest
from datetime import date, timedelta
from decimal import Decimal


# ─── Standalone goal logic ────────────────────────────────────────────────────

def compute_progress_percent(saved: float, target: float) -> float:
    """Return percentage of goal achieved. Capped at 100."""
    if target <= 0:
        raise ValueError("Target amount must be positive")
    return min(round((saved / target) * 100, 2), 100.0)


def get_milestone_crossed(previous_saved: float, new_saved: float, target: float) -> list:
    """Return list of milestone percentages crossed by this contribution."""
    milestones = [25, 50, 75, 100]
    crossed = []
    for m in milestones:
        threshold = target * m / 100
        if previous_saved < threshold <= new_saved:
            crossed.append(m)
    return crossed


def compute_daily_savings_required(
    target: float,
    saved: float,
    target_date: date,
    today: date = None
) -> float:
    """Return daily savings amount needed to hit goal on time."""
    if today is None:
        today = date.today()
    remaining = target - saved
    if remaining <= 0:
        return 0.0
    days_left = (target_date - today).days
    if days_left <= 0:
        raise ValueError("Target date is in the past")
    return round(remaining / days_left, 2)


def is_goal_on_track(
    saved: float,
    target: float,
    created_date: date,
    target_date: date,
    today: date = None
) -> bool:
    """Return True if current savings pace is on track to hit goal."""
    if today is None:
        today = date.today()
    total_days = (target_date - created_date).days
    days_elapsed = (today - created_date).days
    if total_days <= 0 or days_elapsed < 0:
        return False
    expected_by_now = (days_elapsed / total_days) * target
    return saved >= expected_by_now


def validate_goal_payload(payload: dict) -> list:
    """Return list of validation errors for a goal creation payload."""
    errors = []
    if not payload.get("title", "").strip():
        errors.append("title is required")
    if payload.get("target_amount", 0) <= 0:
        errors.append("target_amount must be positive")
    if "target_date" in payload and payload["target_date"]:
        try:
            target_date = date.fromisoformat(str(payload["target_date"]))
            if target_date <= date.today():
                errors.append("target_date must be in the future")
        except ValueError:
            errors.append("target_date must be a valid ISO date")
    return errors


# ─── TC-GOAL-001: Progress computation ────────────────────────────────────────

class TestGoalProgress:
    """TC-GOAL-001 group: progress percentage calculations."""

    def test_zero_saved_is_zero_percent(self):
        assert compute_progress_percent(0, 50000) == 0.0

    def test_half_saved_is_50_percent(self):
        assert compute_progress_percent(25000, 50000) == 50.0

    def test_full_saved_is_100_percent(self):
        assert compute_progress_percent(50000, 50000) == 100.0

    def test_oversaved_capped_at_100(self):
        """If user saved more than target, cap at 100%, not 110%."""
        assert compute_progress_percent(60000, 50000) == 100.0

    def test_fractional_progress_rounds_to_two_decimal(self):
        result = compute_progress_percent(1, 3)
        assert result == 33.33

    def test_zero_target_raises(self):
        with pytest.raises(ValueError, match="positive"):
            compute_progress_percent(100, 0)

    def test_negative_target_raises(self):
        with pytest.raises(ValueError):
            compute_progress_percent(100, -5000)


# ─── TC-GOAL-002: Milestone detection ─────────────────────────────────────────

class TestMilestoneDetection:
    """TC-GOAL-002 group: milestone crossing on contributions."""

    def test_no_milestone_on_small_contribution(self):
        milestones = get_milestone_crossed(1000, 5000, 50000)
        assert milestones == []

    def test_25_percent_milestone_detected(self):
        """Going from 10000 to 13000 on a 50000 target crosses 25%."""
        milestones = get_milestone_crossed(10000, 13000, 50000)
        assert 25 in milestones

    def test_50_percent_milestone_detected(self):
        milestones = get_milestone_crossed(24000, 26000, 50000)
        assert 50 in milestones

    def test_100_percent_milestone_detected(self):
        milestones = get_milestone_crossed(48000, 50000, 50000)
        assert 100 in milestones

    def test_multiple_milestones_in_one_contribution(self):
        """Large single contribution can cross multiple thresholds."""
        milestones = get_milestone_crossed(0, 50000, 50000)
        assert 25 in milestones
        assert 50 in milestones
        assert 75 in milestones
        assert 100 in milestones

    def test_already_past_milestone_not_recrossed(self):
        """If already above 25%, crossing 25% again should not trigger."""
        milestones = get_milestone_crossed(13000, 15000, 50000)
        assert 25 not in milestones


# ─── TC-GOAL-003: Daily savings required ──────────────────────────────────────

class TestDailySavingsRequired:
    """TC-GOAL-003 group: on-track pace calculations."""

    def test_50000_target_in_100_days_needs_500_daily(self):
        today = date.today()
        result = compute_daily_savings_required(
            target=50000, saved=0,
            target_date=today + timedelta(days=100),
            today=today
        )
        assert result == 500.0

    def test_already_met_target_returns_zero(self):
        today = date.today()
        result = compute_daily_savings_required(
            target=50000, saved=50000,
            target_date=today + timedelta(days=30),
            today=today
        )
        assert result == 0.0

    def test_over_saved_returns_zero(self):
        today = date.today()
        result = compute_daily_savings_required(
            target=50000, saved=60000,
            target_date=today + timedelta(days=30),
            today=today
        )
        assert result == 0.0

    def test_past_target_date_raises(self):
        today = date.today()
        with pytest.raises(ValueError, match="past"):
            compute_daily_savings_required(
                target=50000, saved=10000,
                target_date=today - timedelta(days=1),
                today=today
            )


# ─── TC-GOAL-004: On-track status ─────────────────────────────────────────────

class TestGoalOnTrack:
    """TC-GOAL-004 group: pace check against elapsed time."""

    def test_exactly_on_track_at_midpoint(self):
        today = date(2026, 4, 1)
        created = date(2026, 1, 1)
        target_date = date(2026, 7, 1)
        # Midpoint progress, saved exactly 50%
        result = is_goal_on_track(25000, 50000, created, target_date, today=today)
        assert result is True

    def test_behind_schedule(self):
        today = date(2026, 4, 1)
        created = date(2026, 1, 1)
        target_date = date(2026, 7, 1)
        # Saved only 10% at midpoint
        result = is_goal_on_track(5000, 50000, created, target_date, today=today)
        assert result is False

    def test_ahead_of_schedule(self):
        today = date(2026, 3, 1)
        created = date(2026, 1, 1)
        target_date = date(2026, 7, 1)
        # Saved 80% when only 33% elapsed
        result = is_goal_on_track(40000, 50000, created, target_date, today=today)
        assert result is True


# ─── TC-GOAL-005: Payload validation ──────────────────────────────────────────

class TestGoalPayloadValidation:
    """TC-GOAL-005 group: goal creation request validation."""

    def test_valid_payload_no_errors(self, goal_payload):
        errors = validate_goal_payload(goal_payload)
        assert errors == []

    def test_missing_title_returns_error(self, goal_payload):
        goal_payload["title"] = ""
        errors = validate_goal_payload(goal_payload)
        assert any("title" in e for e in errors)

    def test_zero_target_returns_error(self, goal_payload):
        goal_payload["target_amount"] = 0
        errors = validate_goal_payload(goal_payload)
        assert any("target_amount" in e for e in errors)

    def test_negative_target_returns_error(self, goal_payload):
        goal_payload["target_amount"] = -1000
        errors = validate_goal_payload(goal_payload)
        assert any("target_amount" in e for e in errors)

    def test_past_target_date_returns_error(self, goal_payload):
        goal_payload["target_date"] = str(date.today() - timedelta(days=1))
        errors = validate_goal_payload(goal_payload)
        assert any("target_date" in e for e in errors)

    def test_malformed_date_returns_error(self, goal_payload):
        goal_payload["target_date"] = "31/12/2026"
        errors = validate_goal_payload(goal_payload)
        assert any("target_date" in e for e in errors)
