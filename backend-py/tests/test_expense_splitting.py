"""
AntiGravity Test Suite
test_expense_splitting.py — Group expense splits, balance calculation, settlement
"""
import pytest
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Dict


# ─── Standalone split calculation logic ───────────────────────────────────────

def split_equally(total: float, members: List[str]) -> Dict[str, float]:
    """Split total amount equally among all members. Returns {user_id: share}."""
    if not members:
        raise ValueError("Cannot split among zero members")
    if total < 0:
        raise ValueError("Expense amount cannot be negative")
    n = len(members)
    base_share = Decimal(str(total)) / Decimal(n)
    base_share = base_share.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    result = {member: float(base_share) for member in members}
    # Fix rounding residual on first member
    total_assigned = float(base_share) * n
    residual = round(total - total_assigned, 2)
    if residual != 0:
        result[members[0]] = round(result[members[0]] + residual, 2)
    return result


def split_custom(total: float, splits: Dict[str, float]) -> Dict[str, float]:
    """Validate and return custom splits. Sum must equal total."""
    if not splits:
        raise ValueError("Splits cannot be empty")
    split_sum = round(sum(splits.values()), 2)
    if abs(split_sum - round(total, 2)) > 0.01:
        raise ValueError(
            f"Split amounts ({split_sum}) must equal total ({total})"
        )
    if any(v < 0 for v in splits.values()):
        raise ValueError("Individual split amounts cannot be negative")
    return splits


def compute_balances(expenses: List[Dict]) -> Dict[str, float]:
    """
    Given list of {paid_by, splits: {user_id: amount}},
    return net balance per user (positive = owed money, negative = owes money).
    """
    balances: Dict[str, float] = {}
    for expense in expenses:
        payer = expense["paid_by"]
        total = expense["amount"]
        splits = expense["splits"]

        balances[payer] = balances.get(payer, 0) + total
        for user_id, share in splits.items():
            balances[user_id] = balances.get(user_id, 0) - share

    return {k: round(v, 2) for k, v in balances.items()}


def simplify_debts(balances: Dict[str, float]) -> List[Dict]:
    """
    Convert raw balances to minimal set of transactions.
    Returns list of {from_user, to_user, amount}.
    """
    creditors = [(u, b) for u, b in balances.items() if b > 0]
    debtors = [(u, -b) for u, b in balances.items() if b < 0]

    creditors.sort(key=lambda x: -x[1])
    debtors.sort(key=lambda x: -x[1])

    transactions = []
    i, j = 0, 0
    while i < len(creditors) and j < len(debtors):
        creditor, credit = creditors[i]
        debtor, debt = debtors[j]
        amount = min(credit, debt)
        if amount > 0.01:
            transactions.append({
                "from": debtor,
                "to": creditor,
                "amount": round(amount, 2)
            })
        creditors[i] = (creditor, round(credit - amount, 2))
        debtors[j] = (debtor, round(debt - amount, 2))
        if creditors[i][1] < 0.01:
            i += 1
        if debtors[j][1] < 0.01:
            j += 1

    return transactions


# ─── TC-SPLIT-001: Equal splitting ────────────────────────────────────────────

class TestEqualSplitting:
    """TC-SPLIT-001 group: equal split calculations."""

    def test_three_members_split_900_equally(self):
        result = split_equally(900.0, ["A", "B", "C"])
        assert result == {"A": 300.0, "B": 300.0, "C": 300.0}

    def test_two_members_split_649_equally(self):
        """649 / 2 = 324.50 each."""
        result = split_equally(649.0, ["A", "B"])
        assert result["A"] + result["B"] == pytest.approx(649.0, abs=0.01)

    def test_split_among_one_member_equals_total(self):
        result = split_equally(500.0, ["A"])
        assert result["A"] == 500.0

    def test_split_sums_to_original_total(self):
        """Rounding residual must be absorbed — total must add up."""
        result = split_equally(100.0, ["A", "B", "C"])
        assert sum(result.values()) == pytest.approx(100.0, abs=0.01)

    def test_split_with_zero_amount(self):
        result = split_equally(0.0, ["A", "B"])
        assert result == {"A": 0.0, "B": 0.0}

    def test_split_with_empty_members_raises(self):
        with pytest.raises(ValueError, match="zero members"):
            split_equally(500.0, [])

    def test_split_with_negative_amount_raises(self):
        with pytest.raises(ValueError, match="negative"):
            split_equally(-100.0, ["A", "B"])

    def test_large_group_split_sums_correctly(self):
        members = [f"user_{i}" for i in range(7)]
        result = split_equally(1000.0, members)
        assert sum(result.values()) == pytest.approx(1000.0, abs=0.01)


# ─── TC-SPLIT-002: Custom splitting ───────────────────────────────────────────

class TestCustomSplitting:
    """TC-SPLIT-002 group: custom split validation."""

    def test_valid_custom_split_passes(self):
        splits = {"A": 300.0, "B": 200.0, "C": 500.0}
        result = split_custom(1000.0, splits)
        assert result == splits

    def test_custom_split_sum_mismatch_raises(self):
        splits = {"A": 300.0, "B": 200.0}
        with pytest.raises(ValueError, match="must equal"):
            split_custom(1000.0, splits)

    def test_negative_individual_split_raises(self):
        splits = {"A": 1100.0, "B": -100.0}
        with pytest.raises(ValueError, match="negative"):
            split_custom(1000.0, splits)

    def test_empty_splits_raises(self):
        with pytest.raises(ValueError, match="empty"):
            split_custom(500.0, {})


# ─── TC-SPLIT-003: Balance computation ────────────────────────────────────────

class TestBalanceComputation:
    """TC-SPLIT-003 group: who owes whom after multiple expenses."""

    def test_single_payer_two_members(self):
        """A pays 1000, split 500/500. A is owed 500 by B."""
        expenses = [{
            "paid_by": "A",
            "amount": 1000.0,
            "splits": {"A": 500.0, "B": 500.0}
        }]
        balances = compute_balances(expenses)
        assert balances["A"] == pytest.approx(500.0, abs=0.01)
        assert balances["B"] == pytest.approx(-500.0, abs=0.01)

    def test_two_expenses_different_payers(self):
        """A pays 600, B pays 400 — split equally. Net: A owed 100, B owes 100."""
        expenses = [
            {"paid_by": "A", "amount": 600.0, "splits": {"A": 300.0, "B": 300.0}},
            {"paid_by": "B", "amount": 400.0, "splits": {"A": 200.0, "B": 200.0}},
        ]
        balances = compute_balances(expenses)
        assert balances["A"] == pytest.approx(100.0, abs=0.01)
        assert balances["B"] == pytest.approx(-100.0, abs=0.01)

    def test_zero_net_when_split_matches_paid(self):
        """If A pays exactly their own share, net balance is zero."""
        expenses = [{
            "paid_by": "A",
            "amount": 300.0,
            "splits": {"A": 300.0}
        }]
        balances = compute_balances(expenses)
        assert balances.get("A", 0) == pytest.approx(0.0, abs=0.01)

    def test_all_balances_sum_to_zero(self):
        """Conservation law: money in == money out."""
        expenses = [
            {"paid_by": "A", "amount": 900.0, "splits": {"A": 300.0, "B": 300.0, "C": 300.0}},
            {"paid_by": "B", "amount": 450.0, "splits": {"A": 150.0, "B": 150.0, "C": 150.0}},
        ]
        balances = compute_balances(expenses)
        assert sum(balances.values()) == pytest.approx(0.0, abs=0.01)


# ─── TC-SPLIT-004: Debt simplification ────────────────────────────────────────

class TestDebtSimplification:
    """TC-SPLIT-004 group: simplify_debts minimises number of transactions."""

    def test_simple_one_debtor_one_creditor(self):
        balances = {"A": 500.0, "B": -500.0}
        txns = simplify_debts(balances)
        assert len(txns) == 1
        assert txns[0]["from"] == "B"
        assert txns[0]["to"] == "A"
        assert txns[0]["amount"] == 500.0

    def test_already_settled_produces_no_transactions(self):
        balances = {"A": 0.0, "B": 0.0}
        txns = simplify_debts(balances)
        assert txns == []

    def test_transactions_net_to_zero(self):
        """After all simplified transactions, everyone is settled."""
        balances = {"A": 600.0, "B": -200.0, "C": -400.0}
        txns = simplify_debts(balances)
        net = {k: v for k, v in balances.items()}
        for t in txns:
            net[t["from"]] = net.get(t["from"], 0) + t["amount"]
            net[t["to"]] = net.get(t["to"], 0) - t["amount"]
        for user, balance in net.items():
            assert abs(balance) < 0.02, f"{user} has unsettled balance {balance}"

    def test_three_way_split_simplifies(self):
        """A is owed by both B and C."""
        balances = {"A": 700.0, "B": -300.0, "C": -400.0}
        txns = simplify_debts(balances)
        total_paid = sum(t["amount"] for t in txns)
        assert total_paid == pytest.approx(700.0, abs=0.01)
