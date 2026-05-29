"""
AntiGravity Backend — Redis Client
Session storage, rate limiting, token revocation.
Design doc Section 9: Caching Strategy (Table 9)
"""
import json
from typing import Optional, Any
import redis
from app.config import get_settings

settings = get_settings()

# Singleton Redis connection pool
_redis_client: Optional[redis.Redis] = None


def get_redis() -> redis.Redis:
    """Return the shared Redis client (lazy init)."""
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
        )
    return _redis_client


# ─── Cache Key Patterns (Table 9) ─────────────────────────────────────────────

class CacheKeys:
    @staticmethod
    def session(user_id: str) -> str:
        return f"session:{user_id}"                   # TTL: 15 min

    @staticmethod
    def subscriptions(user_id: str) -> str:
        return f"subs:{user_id}"                      # TTL: 5 min

    @staticmethod
    def goal(goal_id: str) -> str:
        return f"goal:{goal_id}"                      # TTL: 10 min

    @staticmethod
    def analytics(user_id: str, month: str) -> str:
        return f"analytics:{user_id}:{month}"         # TTL: 1 hour

    @staticmethod
    def group_balance(group_id: str) -> str:
        return f"balance:{group_id}"                  # TTL: 2 min

    @staticmethod
    def refresh_token(jti: str) -> str:
        return f"rt:{jti}"                            # TTL: 30 days

    @staticmethod
    def rate_limit(ip: str, endpoint: str) -> str:
        return f"rl:{ip}:{endpoint}"                  # TTL: 60 sec


# ─── Cache helpers ────────────────────────────────────────────────────────────

def cache_set(key: str, value: Any, ttl_seconds: int) -> None:
    """Serialize and store a value in Redis with TTL."""
    r = get_redis()
    r.setex(key, ttl_seconds, json.dumps(value, default=str))


def cache_get(key: str) -> Optional[Any]:
    """Retrieve and deserialize a value from Redis."""
    r = get_redis()
    raw = r.get(key)
    if raw is None:
        return None
    return json.loads(raw)


def cache_delete(key: str) -> None:
    """Remove a key from Redis."""
    get_redis().delete(key)


# ─── TTL constants (Table 9) ──────────────────────────────────────────────────

class TTL:
    SESSION         = 15 * 60           # 15 minutes
    SUBSCRIPTIONS   = 5  * 60           # 5 minutes
    GOAL            = 10 * 60           # 10 minutes
    ANALYTICS       = 60 * 60           # 1 hour
    GROUP_BALANCE   = 2  * 60           # 2 minutes
    REFRESH_TOKEN   = 30 * 24 * 60 * 60 # 30 days
    RATE_LIMIT      = 60                # 60 seconds


# ─── Rate limiter ─────────────────────────────────────────────────────────────

def check_rate_limit(ip: str, endpoint: str, max_requests: int = 100) -> bool:
    """
    Redis-based rate limiter (Section 5.3, Table 7).
    Returns True if request is allowed, False if rate limit exceeded.
    """
    r = get_redis()
    key = CacheKeys.rate_limit(ip, endpoint)
    pipe = r.pipeline()
    pipe.incr(key)
    pipe.expire(key, TTL.RATE_LIMIT)
    count, _ = pipe.execute()
    return int(count) <= max_requests
