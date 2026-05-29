"""
AntiGravity Backend — Security Utilities
JWT creation/verification and bcrypt password hashing.
Design doc Section 5: Authentication and Security Design
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import get_settings

settings = get_settings()

# bcrypt with cost factor 12 (Section 5.3, Table 7)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


# ─── Password ─────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash a plain-text password with bcrypt cost=12."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against its bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ─── JWT Tokens ───────────────────────────────────────────────────────────────

def create_access_token(user_id: str, email: str) -> str:
    """
    Issue a short-lived access token (15 min).
    Payload per Section 5.2.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "sub":   user_id,
        "email": email,
        "type":  "access",
        "iat":   now,
        "exp":   now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> tuple[str, str]:
    """
    Issue a long-lived refresh token (30 days).
    Returns (token, jti) — jti is stored in Redis for revocation.
    """
    now = datetime.now(timezone.utc)
    jti = str(uuid.uuid4())
    payload = {
        "sub":  user_id,
        "jti":  jti,          # Unique token ID, stored in Redis for revocation
        "type": "refresh",
        "exp":  now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    }
    token = jwt.encode(payload, settings.JWT_REFRESH_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, jti


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and validate an access token.
    Returns payload dict or None if invalid/expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


def decode_refresh_token(token: str) -> Optional[dict]:
    """
    Decode and validate a refresh token.
    Returns payload dict or None if invalid/expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_REFRESH_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        if payload.get("type") != "refresh":
            return None
        return payload
    except JWTError:
        return None
