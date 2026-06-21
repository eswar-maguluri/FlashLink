from fastapi import FastAPI
from app.database import SessionLocal
from app.core.snowflake import SnowflakeGenerator
from app.core.base62 import encode
from app.core.base62 import decode
from app.api.auth import router as auth_router
from app.core.security import decode_access_token
from app.api.url import router as url_router
from app.schemas.url import CreateURLRequest

generator = SnowflakeGenerator(
    machine_id = 1
)

app = FastAPI(
    title="FlashLink"
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)
@app.get("/")
def root():
    return {
        "message": "FlashLink API Running"
    }

@app.get("/db-test")
def db_test():

    db = SessionLocal()

    try:
        return {
            "status": "Database Connected"
        }

    finally:
        db.close()

@app.get("/snowflake")
def generate_id():
    return {
        "id": generator.generate()
    }

@app.get("/encode")
def encode_test():

    snowflake_id = generator.generate()

    return {
        "snowflake": snowflake_id,
        "short_code": encode(snowflake_id)
    }

@app.get("/decode/{code}")
def decode_test(code: str):

    return {
        "decoded": decode(code)
    }

@app.get("/test-token")
def test_token(token: str):
    return decode_access_token(token)

@app.post("/test")
def test(data: CreateURLRequest):
    return {
        "url": data.url
    }

app.include_router(
    url_router,
    tags=["URL Shortener"]
)