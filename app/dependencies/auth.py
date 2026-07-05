from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.core.security import decode_access_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        token = credentials.credentials
        print("TOKEN =", token)
        payload = decode_access_token(token)
        print("PAYLOAD =", payload)
        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
        user_id = payload.get("sub")
        print("USER_ID =", user_id)
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Missing user id in token"
            )
        user = (
            db.query(User)
            .filter(User.id == int(user_id))
            .first()
        )
        print("USER =", user)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )
        return user
    except Exception as e:
        print("AUTH ERROR =", str(e))
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )