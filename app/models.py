from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import BigInteger, Boolean
from sqlalchemy import Text
from sqlalchemy import ForeignKey
from sqlalchemy import TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy import DateTime
from datetime import datetime

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(
        BigInteger,
        primary_key=True
    )

    short_code = Column(
        String(20),
        nullable=False
    )

    ip_address = Column(
        String(100),
        nullable=False
    )

    user_agent = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class User(Base):
    __tablename__ = 'users'
    id = Column(BigInteger, primary_key=True)

    email = Column(
        String(255),
        unique=True,
        nullable=False
    )

    password_hash = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

class URL(Base):
    __tablename__ = "urls"
    id = Column(BigInteger, primary_key=True)
    original_url = Column(
        Text,
        nullable=False
    )
    short_code = Column(
        String(20),
        unique=True,
        nullable=False
    )
    user_id = Column(
        BigInteger,
        ForeignKey("users.id")
    )
    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )
    click_count = Column(
        BigInteger,
        default=0
    )
    is_active = Column(
        Boolean,
        default=True
    )