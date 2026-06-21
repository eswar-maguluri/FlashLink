from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import url
from app.schemas.url import CreateURLRequest
from app.models import URL
from app.core.snowflake import SnowflakeGenerator
from app.core.base62 import encode
from fastapi.responses import RedirectResponse
from fastapi import HTTPException
from app.dependencies.auth import get_current_user

router = APIRouter()
generator = SnowflakeGenerator(
    machine_id=1
)

@router.post("/shorten")
def shorten_url(
    request: CreateURLRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    url_id = generator.generate()
    short_code = encode(url_id)
    new_url = URL(
        id=url_id,
        original_url=str(request.url),
        short_code=short_code,
        user_id = current_user.id
    )
    db.add(new_url)
    db.commit()
    db.refresh(new_url)
    return {
        "short_url":
        f"http://localhost:8000/{short_code}"
    }

@router.get("/my-urls")
def my_urls(
        current_user=Depends(get_current_user),
        db: Session = Depends(get_db)
):
    urls = (db.query(URL)
            .filter(
        URL.user_id == current_user.id,
                 URL.is_active == True)
            .all()
    )

    return [
        {
            "id": str(url.id),
            "short_code": url.short_code,
            "original_url": url.original_url,
            "click_count": url.click_count,
            "user_id": str(url.user_id)
        }
        for url in urls
        ]

@router.delete("/url/{url_id}")
def delete_url(
    url_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    url = (
        db.query(URL)
        .filter(
            URL.id == url_id,
            URL.user_id == current_user.id
        )
        .first()
    )
    if not url:
        raise HTTPException(
            status_code=404,
            detail="URL not found"
        )
    url.is_active = False
    db.commit()
    return {
        "message": "URL deleted successfully",
        "url_id": str(url.id)
    }

@router.get("/{short_code}")
def redirect_url(
    short_code: str,
    db: Session = Depends(get_db)
):
    url = (
        db.query(URL)
        .filter(
            URL.short_code == short_code
        )
        .first()
    )
    if not url:
        raise HTTPException(
            status_code=404,
            detail="URL not found"
        )

    url.click_count += 1

    db.commit()

    return RedirectResponse(
        url=url.original_url
    )
