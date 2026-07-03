from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest
from app.database import get_db
from app.models import User
from app.core.snowflake import SnowflakeGenerator
from app.core.security import hash_password
from app.schemas.auth import LoginRequest
from app.core.security import verify_password
from app.core.security import create_access_token
from fastapi import Header
from app.core.security import decode_access_token
from app.dependencies.auth import get_current_user
from app.monitoring.metrics import user_registered_counter

router = APIRouter()

generator = SnowflakeGenerator(
    machine_id=1
)

@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(
            User.email == request.email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = User(
        id=generator.generate(),
        email=request.email,
        password_hash=hash_password(
            request.password
        )
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Prometheus Metric
    user_registered_counter.inc()

    return {
        "message": "User registered successfully",
        "user_id": str(user.id)
    }

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email == request.email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        request.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def me(
    authorization: str = Header(...)
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = decode_access_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return payload

@router.get("/profile")
def profile(
    current_user=Depends(get_current_user)
):
    return {
        "id": str(current_user.id),
        "email": current_user.email
    }