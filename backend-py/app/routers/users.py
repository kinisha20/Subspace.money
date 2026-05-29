"""
AntiGravity Backend — Users Router
Profile management, account settings.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.models import User
from app.dependencies import get_current_user
from app.utils.security import hash_password, verify_password

router = APIRouter()


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str]
    avatar_url: Optional[str]
    currency: str
    timezone: str
    is_verified: bool
    created_at: Optional[str]

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


def _user_out(u: User) -> dict:
    return {
        "id":          str(u.id),
        "email":       u.email,
        "full_name":   u.full_name,
        "phone":       u.phone,
        "avatar_url":  u.avatar_url,
        "currency":    u.currency,
        "timezone":    u.timezone,
        "is_verified": u.is_verified,
        "created_at":  u.created_at.isoformat() if u.created_at else None,
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Get the authenticated user's profile."""
    return {"data": _user_out(current_user)}


@router.put("/me")
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile fields."""
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return {"data": _user_out(current_user)}


@router.post("/me/change-password", status_code=status.HTTP_200_OK)
def change_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change password — verify current, hash and store new."""
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    current_user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"success": True, "message": "Password updated successfully."}


@router.delete("/me", status_code=status.HTTP_200_OK)
def deactivate_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Soft-deactivate account (sets is_active=False)."""
    current_user.is_active = False
    db.commit()
    return {"success": True, "message": "Account deactivated."}
