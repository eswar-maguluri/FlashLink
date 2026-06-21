import redis

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True
)
redis_client.set(
    "test",
    "flashlink"
)

print(
    redis_client.get("test")
)