"""
AntiGravity Backend — FastAPI Application Factory
Middleware stack, router registration, startup/shutdown events.
Design doc Section 7: Backend Architecture
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid
import logging
import time

from app.config import get_settings
from app.database import create_tables

# Import all routers
from app.routers import auth, users, subscriptions, groups, expenses, goals, analytics
from app.workers.scheduler import start_scheduler, stop_scheduler

settings = get_settings()
logger = logging.getLogger("antigravity")

# ─── App factory ──────────────────────────────────────────────────────────────

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="AntiGravity personal finance management API",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
    )

    # ── 1. CORS Middleware ────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
    )

    # ── 2. Request ID Middleware ──────────────────────────────────────────────
    @app.middleware("http")
    async def request_id_middleware(request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

    # ── 3. Logging Middleware ─────────────────────────────────────────────────
    @app.middleware("http")
    async def logging_middleware(request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration_ms = round((time.time() - start) * 1000, 2)
        logger.info(
            f'{request.method} {request.url.path} → {response.status_code} [{duration_ms}ms]'
        )
        return response

    # ── 4. Rate Limit Middleware ──────────────────────────────────────────────
    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        if request.url.path.startswith("/api/"):
            try:
                from app.utils.redis_client import check_rate_limit
                client_ip = request.client.host if request.client else "unknown"
                if not check_rate_limit(client_ip, request.url.path, settings.RATE_LIMIT_PER_MINUTE):
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={"status": 429, "title": "Too Many Requests",
                                 "detail": "Rate limit exceeded. Try again in 60 seconds."}
                    )
            except Exception:
                pass  # Redis down: fail open (don't block requests)
        return await call_next(request)

    # ── 5. Global exception handler ───────────────────────────────────────────
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "status": 500,
                "title": "Internal Server Error",
                "detail": str(exc) if settings.DEBUG else "An unexpected error occurred.",
            }
        )

    # ── Routes ────────────────────────────────────────────────────────────────
    app.include_router(auth.router,          prefix="/api/v1/auth",          tags=["Authentication"])
    app.include_router(users.router,         prefix="/api/v1/users",         tags=["Users"])
    app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"])
    app.include_router(groups.router,        prefix="/api/v1/groups",        tags=["Groups"])
    app.include_router(expenses.router,      prefix="/api/v1/expenses",      tags=["Expenses"])
    app.include_router(goals.router,         prefix="/api/v1/goals",         tags=["Savings Goals"])
    app.include_router(analytics.router,     prefix="/api/v1/analytics",     tags=["Analytics"])

    # ── Health check ──────────────────────────────────────────────────────────
    @app.get("/health", tags=["System"])
    def health_check():
        return {
            "status": "ok",
            "service": "antigravity-api",
            "version": settings.APP_VERSION,
            "environment": settings.ENVIRONMENT,
        }

    # ── Startup / Shutdown ────────────────────────────────────────────────────
    @app.on_event("startup")
    async def on_startup():
        logger.info("Starting AntiGravity API...")
        create_tables()
        start_scheduler()
        logger.info("Startup complete.")

    @app.on_event("shutdown")
    async def on_shutdown():
        stop_scheduler()
        logger.info("AntiGravity API shutdown complete.")

    return app


app = create_app()
