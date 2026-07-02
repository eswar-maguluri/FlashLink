from fastapi import FastAPI
from app.database import engine
from app.database import Base
from app import models
from app.database import SessionLocal
from app.core.snowflake import SnowflakeGenerator
from app.core.base62 import encode, decode
from app.api.auth import router as auth_router
from app.api.url import router as url_router
from app.core.security import decode_access_token
from app.schemas.url import CreateURLRequest

from slowapi.middleware import SlowAPIMiddleware
from app.middleware.rate_limiter import limiter

generator = SnowflakeGenerator(
    machine_id=1
)
app = FastAPI(
    title="FlashLink"
)

@app.on_event("startup")
def startup():

    Base.metadata.create_all(
        bind=engine
    )

    print(
        "Database tables ready"
    )
    
# Rate Limiter Setup
app.state.limiter = limiter
app.add_middleware(
    SlowAPIMiddleware
)

# Routers
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    url_router,
    tags=["URL Shortener"]
)

# Root
@app.get("/")
def root():
    return {
        "message": "FlashLink API Running"
    }

# Database Test
@app.get("/db-test")
def db_test():

    db = SessionLocal()

    try:
        return {
            "status": "Database Connected"
        }

    finally:
        db.close()

# Snowflake Test
@app.get("/snowflake")
def generate_id():
    return {
        "id": generator.generate()
    }

# Base62 Encode Test
@app.get("/encode")
def encode_test():

    snowflake_id = generator.generate()

    return {
        "snowflake": snowflake_id,
        "short_code": encode(snowflake_id)
    }

# Base62 Decode Test
@app.get("/decode/{code}")
def decode_test(code: str):

    return {
        "decoded": decode(code)
    }

# JWT Test
@app.get("/test-token")
def test_token(token: str):

    return decode_access_token(token)

# URL Schema Test
@app.post("/test")
def test(data: CreateURLRequest):

    return {
        "url": data.url
    }