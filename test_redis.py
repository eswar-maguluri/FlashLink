from app.cache.redis_client import redis_client

redis_client.set(
    "test",
    "flashlink"
)
print(
    redis_client.get("test")
)