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
from fastapi import Response
from prometheus_client import generate_latest
from slowapi.middleware import SlowAPIMiddleware
from app.middleware.rate_limiter import limiter
from fastapi.middleware.cors import CORSMiddleware


generator = SnowflakeGenerator(machine_id=1)
app = FastAPI(title="FlashLink")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://flash-link-26.vercel.app"
        "https://flash-link-git-main-eswar5.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    print("Database tables ready")

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.include_router(auth_router,prefix="/auth",tags=["Authentication"])
app.include_router(url_router,tags=["URL Shortener"])

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

@app.get("/metrics")
def metrics():
    return Response(
        generate_latest(),
        media_type="text/plain"
    )