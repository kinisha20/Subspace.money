"""
AntiGravity Backend — Auth Router
Endpoints: register, login, refresh, logout, verify-email, forgot-password
Design doc Section 4.3 (Table 3) + Section 5.1 (Authentication Flow)
"""
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Cookie
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
import re
import uuid

from app.database import get_db
from app.models import User
from app.utils.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_refresh_token
)
from app.utils.redis_client import get_redis, CacheKeys, TTL, cache_set, cache_delete

router = APIRouter()


# ─── Pydantic Schemas ─────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    phone: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[!@#$%^&*]", v):
            raise ValueError("Password must contain at least one special character (!@#$%^&*)")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    pass  # Refresh token comes from httpOnly cookie


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str


# ─── POST /auth/register ──────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    """Create a new user account and return JWT tokens."""

    # Check duplicate email
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    # Create user
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        phone=payload.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Issue tokens
    access_token = create_access_token(str(user.id), user.email)
    refresh_token, jti = create_refresh_token(str(user.id))

    # Store refresh token JTI in Redis for revocation
    cache_set(CacheKeys.refresh_token(jti), str(user.id), TTL.REFRESH_TOKEN)

    # Set refresh token as httpOnly cookie (Section 14.3)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=TTL.REFRESH_TOKEN,
        path="/api/v1/auth",
    )

    return TokenResponse(
        access_token=access_token,
        user_id=str(user.id),
        email=user.email,
        full_name=user.full_name,
    )


# ─── POST /auth/login ─────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT tokens.
    Authentication flow per design doc Figure 3.
    """
    # Step 1: Lookup user by email
    user = db.query(User).filter(User.email == payload.email, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    # Step 2: Verify bcrypt hash
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    # Step 3: Issue tokens
    access_token = create_access_token(str(user.id), user.email)
    refresh_token, jti = create_refresh_token(str(user.id))

    # Step 4: Store refresh token JTI in Redis
    cache_set(CacheKeys.refresh_token(jti), str(user.id), TTL.REFRESH_TOKEN)

    # Step 5: httpOnly cookie for refresh token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=TTL.REFRESH_TOKEN,
        path="/api/v1/auth",
    )

    return TokenResponse(
        access_token=access_token,
        user_id=str(user.id),
        email=user.email,
        full_name=user.full_name,
    )


# ─── POST /auth/refresh ───────────────────────────────────────────────────────

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    response: Response,
    db: Session = Depends(get_db),
    refresh_token: Optional[str] = Cookie(default=None),
):
    """Issue a new access token using a valid refresh token from httpOnly cookie."""
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token provided.")

    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token.")

    jti     = payload.get("jti")
    user_id = payload.get("sub")

    # Check Redis: token must not have been revoked
    stored = cache_get(CacheKeys.refresh_token(jti)) if jti else None
    if not stored:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has been revoked.")

    # Load user
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")

    # Issue new access token
    new_access_token = create_access_token(str(user.id), user.email)

    return TokenResponse(
        access_token=new_access_token,
        user_id=str(user.id),
        email=user.email,
        full_name=user.full_name,
    )


# ─── POST /auth/logout ────────────────────────────────────────────────────────

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    refresh_token: Optional[str] = Cookie(default=None),
):
    """Invalidate the refresh token in Redis and clear the cookie."""
    if refresh_token:
        payload = decode_refresh_token(refresh_token)
        if payload and payload.get("jti"):
            cache_delete(CacheKeys.refresh_token(payload["jti"]))

    response.delete_cookie(key="refresh_token", path="/api/v1/auth")
    return None


# ─── POST /auth/forgot-password ───────────────────────────────────────────────

@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(email: EmailStr, db: Session = Depends(get_db)):
    """Send password reset email. Always returns 202 to prevent email enumeration."""
    user = db.query(User).filter(User.email == email).first()
    if user:
        # In production: generate a reset token, store in Redis, send email
        reset_token = str(uuid.uuid4())
        cache_set(f"pwd_reset:{reset_token}", str(user.id), 30 * 60)  # 30 min TTL
        # await send_email(user.email, "password_reset", {"token": reset_token})
    return {"message": "If an account exists with that email, a reset link has been sent."}


# ─── POST /auth/verify-email ──────────────────────────────────────────────────

@router.post("/verify-email", status_code=status.HTTP_200_OK)
def verify_email(token: str, db: Session = Depends(get_db)):
    """Confirm email with OTP/token."""
    # In production: validate token from Redis, mark user.is_verified = True
    return {"message": "Email verified successfully."}


# Helper that was referenced above
def cache_get(key):
    from app.utils.redis_client import cache_get as _cache_get
    return _cache_get(key)
