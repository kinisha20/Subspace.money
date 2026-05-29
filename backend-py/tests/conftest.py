"""
AntiGravity Test Suite
conftest.py — shared fixtures used across all test modules
"""
import pytest
import uuid
from datetime import date, timedelta
from decimal import Decimal


# ─── Fake User Fixtures ────────────────────────────────────────────────────────

@pytest.fixture
def user_payload():
    """Standard valid user registration payload."""
    return {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "full_name": "Kinisha Gupta",
        "password": "SecurePass@123",
        "phone": "+919876543210",
        "currency": "INR",
        "timezone": "Asia/Kolkata"
    }


@pytest.fixture
def another_user_payload():
    """A second user for group/split tests."""
    return {
        "email": f"user2_{uuid.uuid4().hex[:8]}@example.com",
        "full_name": "Aryan Mehta",
        "password": "AnotherPass@456",
        "phone": "+919012345678",
        "currency": "INR",
        "timezone": "Asia/Kolkata"
    }


@pytest.fixture
def subscription_payload():
    """Standard valid subscription payload."""
    return {
        "name": "Netflix",
        "provider": "Netflix Inc.",
        "amount": 649.00,
        "currency": "INR",
        "billing_cycle": "monthly",
        "next_billing_at": str(date.today() + timedelta(days=10)),
        "category": "Entertainment"
    }


@pytest.fixture
def goal_payload():
    """Standard valid savings goal payload."""
    return {
        "title": "Emergency Fund",
        "target_amount": 50000.00,
        "target_date": str(date.today() + timedelta(days=180)),
        "category": "Safety",
        "colour": "#1A3C34"
    }


@pytest.fixture
def group_payload():
    """Standard valid group payload."""
    return {
        "name": "Goa Trip 2026",
        "description": "Splitting costs for the Goa vacation"
    }


@pytest.fixture
def expense_payload():
    """Standard valid expense payload."""
    return {
        "title": "Hotel Stay",
        "amount": 8400.00,
        "currency": "INR",
        "category": "Travel",
        "expense_at": str(date.today())
    }
