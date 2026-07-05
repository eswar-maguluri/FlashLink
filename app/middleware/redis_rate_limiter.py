import time

from fastapi import HTTPException

from app.cache.redis_client import redis_client


class RedisRateLimiter:
    def __init__(
        self,
        max_tokens: int,
        refill_rate: int
    ):
        self.max_tokens = max_tokens
        self.refill_rate = refill_rate
    def is_allowed(
        self,
        key: str
    ) -> bool:
        print("INSIDE REDIS LIMITER")
        bucket_key = f"bucket:{key}"
        current_time = time.time()
        bucket = redis_client.hgetall(
            bucket_key
        )
        if not bucket:
            redis_client.hset(
                bucket_key,
                mapping={
                    "tokens": self.max_tokens,
                    "last_refill": current_time
                }
            )
            redis_client.expire(
                bucket_key,
                3600
            )
            return True
        tokens = float(bucket["tokens"])
        last_refill = float(bucket["last_refill"])
        elapsed = (current_time - last_refill)
        new_tokens = (elapsed * self.refill_rate / 60)
        tokens = min(
            self.max_tokens,
            tokens + new_tokens
        )
        if tokens < 1:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded"
            )
        tokens -= 1
        redis_client.hset(
            bucket_key,
            mapping={
                "tokens": tokens,
                "last_refill": current_time
            }
        )
        return True