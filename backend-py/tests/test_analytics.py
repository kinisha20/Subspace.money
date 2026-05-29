"""
AntiGravity Test Suite
test_analytics.py — Spend analytics, category totals, month-over-month delta
"""
import pytest
from datetime import date, timedelta
from collections import defaultdict
from typing import List, Dict


# ─── Standalone analytics logic ───────────────────────────────────────────────

def group_by_category(expenses: List[Dict]) -> Dict[str, float]:
    """Sum expenses by category. Returns {category: total}."""
    totals = defaultdict(float)
    for e in expenses:
        category = e.get("category", "Uncategorised")
        totals[category] += e.get("amount", 0)
    return {k: round(v, 2) for k, v in totals.items()}


def monthly_totals(expenses: List[Dict]) -> Dict[str, float]:
    """Sum expenses per month. Returns {'YYYY-MM': total}."""
    totals = defaultdict(float)
    for e in expenses:
        try:
            d = date.fromisoformat(str(e["expense_at"]))
            key = d.strftime("%Y-%m")
            totals[key] += e.get("amount", 0)
        except (KeyError, ValueError):
            pass
    return {k: round(v, 2) for k, v in sorted(totals.items())}


def month_over_month_delta(monthly: Dict[str, float]) -> Dict[str, float]:
    """
    Given {'YYYY-MM': total}, return delta vs previous month.
    First month has no delta (skipped).
    """
    keys = sorted(monthly.keys())
    deltas = {}
    for i in range(1, len(keys)):
        current = monthly[keys[i]]
        previous = monthly[keys[i - 1]]
        deltas[keys[i]] = round(current - previous, 2)
    return deltas


def top_categories(expenses: List[Dict], n: int = 3) -> List[Dict]:
    """Return top N categories by spend as sorted list."""
    totals = group_by_category(expenses)
    sorted_cats = sorted(totals.items(), key=lambda x: -x[1])
    return [{"category": k, "total": v} for k, v in sorted_cats[:n]]


def compute_subscription_share(
    subscription_annual: float,
    total_annual: float
) -> float:
    """Return what % of annual spend goes to subscriptions."""
    if total_annual <= 0:
        return 0.0
    return round((subscription_annual / total_annual) * 100, 2)


# ─── TC-ANA-001: Category grouping ────────────────────────────────────────────

class TestCategoryGrouping:
    """TC-ANA-001 group: expense totals grouped by category."""

    def test_single_category_sums_correctly(self):
        expenses = [
            {"amount": 500, "category": "Food"},
            {"amount": 300, "category": "Food"},
        ]
        result = group_by_category(expenses)
        assert result["Food"] == 800.0

    def test_multiple_categories_separate_totals(self):
        expenses = [
            {"amount": 500, "category": "Food"},
            {"amount": 1200, "category": "Transport"},
            {"amount": 649, "category": "Entertainment"},
        ]
        result = group_by_category(expenses)
        assert result["Food"] == 500.0
        assert result["Transport"] == 1200.0
        assert result["Entertainment"] == 649.0

    def test_missing_category_goes_to_uncategorised(self):
        expenses = [{"amount": 200}]
        result = group_by_category(expenses)
        assert "Uncategorised" in result

    def test_empty_expense_list_returns_empty(self):
        result = group_by_category([])
        assert result == {}

    def test_case_sensitivity_preserved(self):
        expenses = [
            {"amount": 100, "category": "food"},
            {"amount": 200, "category": "Food"},
        ]
        result = group_by_category(expenses)
        assert "food" in result
        assert "Food" in result
        assert result["food"] == 100.0


# ─── TC-ANA-002: Monthly totals ───────────────────────────────────────────────

class TestMonthlyTotals:
    """TC-ANA-002 group: per-month expense aggregation."""

    def test_two_months_separate_correctly(self):
        expenses = [
            {"amount": 1000, "expense_at": "2026-04-10"},
            {"amount": 500,  "expense_at": "2026-04-25"},
            {"amount": 2000, "expense_at": "2026-05-05"},
        ]
        result = monthly_totals(expenses)
        assert result["2026-04"] == 1500.0
        assert result["2026-05"] == 2000.0

    def test_single_month_sums_all(self):
        expenses = [
            {"amount": 300, "expense_at": "2026-05-01"},
            {"amount": 700, "expense_at": "2026-05-31"},
        ]
        result = monthly_totals(expenses)
        assert result["2026-05"] == 1000.0

    def test_invalid_date_skipped_silently(self):
        expenses = [
            {"amount": 500, "expense_at": "not-a-date"},
            {"amount": 300, "expense_at": "2026-05-10"},
        ]
        result = monthly_totals(expenses)
        assert result.get("2026-05") == 300.0

    def test_empty_list_returns_empty(self):
        assert monthly_totals([]) == {}

    def test_output_is_sorted_by_month(self):
        expenses = [
            {"amount": 100, "expense_at": "2026-06-01"},
            {"amount": 200, "expense_at": "2026-04-01"},
            {"amount": 300, "expense_at": "2026-05-01"},
        ]
        keys = list(monthly_totals(expenses).keys())
        assert keys == sorted(keys)


# ─── TC-ANA-003: Month-over-month delta ───────────────────────────────────────

class TestMonthOverMonthDelta:
    """TC-ANA-003 group: spend change vs prior month."""

    def test_spend_increase_is_positive_delta(self):
        monthly = {"2026-04": 5000.0, "2026-05": 7000.0}
        deltas = month_over_month_delta(monthly)
        assert deltas["2026-05"] == 2000.0

    def test_spend_decrease_is_negative_delta(self):
        monthly = {"2026-04": 8000.0, "2026-05": 5000.0}
        deltas = month_over_month_delta(monthly)
        assert deltas["2026-05"] == -3000.0

    def test_same_spend_is_zero_delta(self):
        monthly = {"2026-04": 5000.0, "2026-05": 5000.0}
        deltas = month_over_month_delta(monthly)
        assert deltas["2026-05"] == 0.0

    def test_first_month_has_no_delta(self):
        monthly = {"2026-04": 5000.0, "2026-05": 6000.0}
        deltas = month_over_month_delta(monthly)
        assert "2026-04" not in deltas

    def test_single_month_produces_no_deltas(self):
        monthly = {"2026-05": 5000.0}
        deltas = month_over_month_delta(monthly)
        assert deltas == {}


# ─── TC-ANA-004: Top categories ───────────────────────────────────────────────

class TestTopCategories:
    """TC-ANA-004 group: top N spends by category."""

    def test_top_3_returns_three_results(self):
        expenses = [
            {"amount": 1000, "category": "Food"},
            {"amount": 2000, "category": "Transport"},
            {"amount": 3000, "category": "Entertainment"},
            {"amount": 500,  "category": "Health"},
        ]
        result = top_categories(expenses, n=3)
        assert len(result) == 3

    def test_top_category_is_highest_spend(self):
        expenses = [
            {"amount": 500,  "category": "Food"},
            {"amount": 2000, "category": "Transport"},
            {"amount": 1000, "category": "Entertainment"},
        ]
        result = top_categories(expenses, n=1)
        assert result[0]["category"] == "Transport"

    def test_fewer_categories_than_n_returns_all(self):
        expenses = [
            {"amount": 500, "category": "Food"},
            {"amount": 300, "category": "Health"},
        ]
        result = top_categories(expenses, n=5)
        assert len(result) == 2

    def test_empty_returns_empty(self):
        assert top_categories([]) == []


# ─── TC-ANA-005: Subscription share ──────────────────────────────────────────

class TestSubscriptionShare:
    """TC-ANA-005 group: subscription vs total annual spend ratio."""

    def test_subscription_is_50_percent_of_total(self):
        result = compute_subscription_share(6000, 12000)
        assert result == 50.0

    def test_no_subscriptions_is_zero_percent(self):
        result = compute_subscription_share(0, 12000)
        assert result == 0.0

    def test_all_spend_is_subscriptions(self):
        result = compute_subscription_share(12000, 12000)
        assert result == 100.0

    def test_zero_total_returns_zero(self):
        result = compute_subscription_share(1000, 0)
        assert result == 0.0

    def test_result_rounded_to_two_decimals(self):
        result = compute_subscription_share(1000, 3000)
        assert result == 33.33
