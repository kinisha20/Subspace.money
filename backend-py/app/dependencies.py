"""
AntiGravity Backend — Dependencies
Shared FastAPI dependencies: get_db, get_current_user.
Design doc Section 7.1.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db as _get_db
from app.models import User
from app.utils.security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=True)


def get_db():
    """Re-export get_db for use in routers."""
    yield from _get_db()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Validate Bearer JWT and return the authenticated User.
    Raises 401 if token is missing, invalid, or expired.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
