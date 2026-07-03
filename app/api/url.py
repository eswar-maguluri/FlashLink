from fastapi import APIRouter
from fastapi import Depends
from fastapi import Request
from fastapi import HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.schemas.url import CreateURLRequest
from app.models import URL
from app.models import AnalyticsEvent
from app.core.snowflake import SnowflakeGenerator
from app.core.base62 import encode
from app.dependencies.auth import get_current_user
from app.cache.redis_client import redis_client
from app.middleware.redis_rate_limiter import RedisRateLimiter
from app.kafka.producer import get_producer
from app.monitoring.metrics import (
    url_created_counter,
    redirect_counter
)
router = APIRouter()

generator = SnowflakeGenerator(
    machine_id=1
)

rate_limiter = RedisRateLimiter(
    max_tokens=3,
    refill_rate=5
)

@router.post("/shorten")
def shorten_url(
    request: Request,
    body: CreateURLRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    print("RATE LIMITER CALLED")

    allowed = rate_limiter.is_allowed(
        f"user:{current_user.id}"
    )

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded"
        )

    url_id = generator.generate()
    short_code = encode(url_id)

    new_url = URL(
        id=url_id,
        original_url=str(body.url),
        short_code=short_code,
        user_id=current_user.id
    )

    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    # Prometheus Metric
    url_created_counter.inc()

    return {
        "short_url": f"http://localhost:8000/r/{short_code}"
    }

# =====================================
# USER URLS
# =====================================
@router.get("/my-urls")
def my_urls(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    urls = (
        db.query(URL)
        .filter(
            URL.user_id == current_user.id,
            URL.is_active == True
        )
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


# =====================================
# DELETE URL
# =====================================
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


# =====================================
# ANALYTICS API
# =====================================
@router.get("/analytics/{short_code}")
def get_analytics(
    short_code: str,
    db: Session = Depends(get_db)
):
    total_clicks = (
        db.query(AnalyticsEvent)
        .filter(
            AnalyticsEvent.short_code == short_code
        )
        .count()
    )

    unique_visitors = (
        db.query(
            func.count(
                func.distinct(
                    AnalyticsEvent.ip_address
                )
            )
        )
        .filter(
            AnalyticsEvent.short_code == short_code
        )
        .scalar()
    )

    recent_clicks = (
        db.query(AnalyticsEvent)
        .filter(
            AnalyticsEvent.short_code == short_code
        )
        .order_by(
            AnalyticsEvent.created_at.desc()
        )
        .limit(10)
        .all()
    )

    return {
        "short_code": short_code,
        "total_clicks": total_clicks,
        "unique_visitors": unique_visitors,
        "recent_clicks": [
            {
                "ip_address": click.ip_address,
                "user_agent": click.user_agent,
                "timestamp": click.created_at
            }
            for click in recent_clicks
        ]
    }

@router.get("/r/{short_code}")
def redirect_url(
    short_code: str,
    request: Request,
    db: Session = Depends(get_db)
):
    cached_url = redis_client.get(
        f"url:{short_code}"
    )

    # CACHE HIT
    if cached_url:
        print("CACHE HIT")

        if isinstance(cached_url, bytes):
            cached_url = cached_url.decode()

        redirect_counter.inc()

        return RedirectResponse(
            url=cached_url,
            status_code=307
        )

    print("CACHE MISS")

    url = (
        db.query(URL)
        .filter(
            URL.short_code == short_code,
            URL.is_active == True
        )
        .first()
    )

    if not url:
        raise HTTPException(
            status_code=404,
            detail="URL not found"
        )

    # Store in Redis
    redis_client.setex(
        f"url:{short_code}",
        86400,
        url.original_url
    )

    # Update click count
    url.click_count += 1

    # Kafka analytics event
    producer = get_producer()

    producer.send(
        "click-events",
        {
            "id": str(generator.generate()),
            "short_code": short_code,
            "ip_address": request.client.host,
            "user_agent": request.headers.get(
                "user-agent",
                "Unknown"
            )
        }
    )

    producer.flush()

    db.commit()

    # Prometheus metric
    redirect_counter.inc()

    return RedirectResponse(
        url=url.original_url,
        status_code=307
    )