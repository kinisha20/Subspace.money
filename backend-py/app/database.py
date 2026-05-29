"""
AntiGravity Backend — Database
SQLAlchemy async engine + session factory.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.pool import QueuePool
from app.config import get_settings

settings = get_settings()


class Base(DeclarativeBase):
    pass


# Synchronous engine (upgrade to async with asyncpg if needed)
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=True,  # Handles stale connections
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db():
    """Dependency: yields a DB session and closes it after request."""
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """Create all tables from ORM models. Called on startup."""
    Base.metadata.create_all(bind=engine)
