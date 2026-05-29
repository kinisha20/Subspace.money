"""
AntiGravity Test Suite
test_auth.py — Authentication: registration, login, JWT, token refresh, logout
"""
import pytest
import uuid
import time
from datetime import datetime, timedelta, timezone


# ─── Utility helpers (standalone, no real app needed) ─────────────────────────

def hash_password(password: str) -> str:
    import bcrypt
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    import bcrypt
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(user_id: str, secret: str = "test-secret", expires_minutes: int = 15) -> str:
    from jose import jwt
    payload = {
        "sub": user_id,
        "type": "access",
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def decode_token(token: str, secret: str = "test-secret") -> dict:
    from jose import jwt
    return jwt.decode(token, secret, algorithms=["HS256"])


# ─── TC-AUTH-001: Password hashing ────────────────────────────────────────────

class TestPasswordHashing:
    """TC-AUTH-001 group: bcrypt hashing and verification."""

    def test_hash_is_not_plain_text(self):
        """Stored hash must not equal the original password."""
        password = "MySecret@99"
        hashed = hash_password(password)
        assert hashed != password

    def test_correct_password_verifies(self):
        """Correct password must pass verification."""
        password = "MySecret@99"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_wrong_password_fails_verification(self):
        """Wrong password must fail verification."""
        hashed = hash_password("MySecret@99")
        assert verify_password("WrongPass@00", hashed) is False

    def test_empty_password_produces_hash(self):
        """Even empty strings produce a hash (edge case)."""
        hashed = hash_password("")
        assert len(hashed) > 0

    def test_two_hashes_of_same_password_are_different(self):
        """bcrypt salts must make identical passwords hash differently."""
        h1 = hash_password("SamePass@1")
        h2 = hash_password("SamePass@1")
        assert h1 != h2

    def test_unicode_password_hashes_correctly(self):
        """Passwords with unicode characters should hash and verify."""
        password = "पासवर्ड@123"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True


# ─── TC-AUTH-002: JWT token creation ──────────────────────────────────────────

class TestJWTCreation:
    """TC-AUTH-002 group: JWT creation and payload structure."""

    def test_token_is_string(self):
        token = create_access_token("user-001")
        assert isinstance(token, str)

    def test_token_has_three_parts(self):
        """JWT must have header.payload.signature structure."""
        token = create_access_token("user-001")
        parts = token.split(".")
        assert len(parts) == 3

    def test_token_payload_contains_sub(self):
        user_id = str(uuid.uuid4())
        token = create_access_token(user_id)
        payload = decode_token(token)
        assert payload["sub"] == user_id

    def test_token_payload_contains_type_access(self):
        token = create_access_token("user-001")
        payload = decode_token(token)
        assert payload["type"] == "access"

    def test_token_payload_contains_expiry(self):
        token = create_access_token("user-001")
        payload = decode_token(token)
        assert "exp" in payload

    def test_expiry_is_in_future(self):
        token = create_access_token("user-001", expires_minutes=15)
        payload = decode_token(token)
        exp = payload["exp"]
        assert exp > time.time()

    def test_different_users_get_different_tokens(self):
        token1 = create_access_token("user-001")
        token2 = create_access_token("user-002")
        assert token1 != token2


# ─── TC-AUTH-003: JWT expiry ───────────────────────────────────────────────────

class TestJWTExpiry:
    """TC-AUTH-003 group: expired tokens must be rejected."""

    def test_expired_token_raises_on_decode(self):
        from jose import jwt, JWTError
        # Create token that expired 1 second ago
        payload = {
            "sub": "user-001",
            "exp": datetime.now(timezone.utc) - timedelta(seconds=1)
        }
        token = jwt.encode(payload, "test-secret", algorithm="HS256")
        with pytest.raises(Exception):
            decode_token(token)

    def test_token_with_wrong_secret_is_rejected(self):
        from jose import JWTError
        token = create_access_token("user-001", secret="correct-secret")
        with pytest.raises(Exception):
            decode_token(token, secret="wrong-secret")

    def test_tampered_token_is_rejected(self):
        from jose import JWTError
        token = create_access_token("user-001")
        parts = token.split(".")
        tampered = parts[0] + "." + parts[1] + "TAMPERED" + "." + parts[2]
        with pytest.raises(Exception):
            decode_token(tampered)


# ─── TC-AUTH-004: Email validation logic ──────────────────────────────────────

class TestEmailValidation:
    """TC-AUTH-004 group: email format checking."""

    def _is_valid_email(self, email: str) -> bool:
        import re
        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        return bool(re.match(pattern, email))

    def test_valid_email_passes(self):
        assert self._is_valid_email("kinisha@example.com") is True

    def test_email_without_at_fails(self):
        assert self._is_valid_email("kinishaexample.com") is False

    def test_email_without_domain_fails(self):
        assert self._is_valid_email("kinisha@") is False

    def test_email_with_subdomain_passes(self):
        assert self._is_valid_email("kinisha@mail.example.co.in") is True

    def test_empty_email_fails(self):
        assert self._is_valid_email("") is False

    def test_email_with_spaces_fails(self):
        assert self._is_valid_email("kinisha @example.com") is False


# ─── TC-AUTH-005: Password strength ───────────────────────────────────────────

class TestPasswordStrength:
    """TC-AUTH-005 group: password strength rules."""

    def _is_strong(self, password: str) -> bool:
        import re
        if len(password) < 8:
            return False
        if not re.search(r"[A-Z]", password):
            return False
        if not re.search(r"[0-9]", password):
            return False
        if not re.search(r"[!@#$%^&*]", password):
            return False
        return True

    def test_strong_password_passes(self):
        assert self._is_strong("Secure@123") is True

    def test_too_short_fails(self):
        assert self._is_strong("Ab@1") is False

    def test_no_uppercase_fails(self):
        assert self._is_strong("secure@123") is False

    def test_no_number_fails(self):
        assert self._is_strong("Secure@abc") is False

    def test_no_special_char_fails(self):
        assert self._is_strong("Secure123") is False

    def test_all_spaces_fails(self):
        assert self._is_strong("        ") is False
