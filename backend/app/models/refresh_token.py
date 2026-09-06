from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from app.core.database import Base


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    token = Column(String, unique=True, nullable=False, index=True)

    expires_at = Column(DateTime, nullable=False)

    revoked = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
