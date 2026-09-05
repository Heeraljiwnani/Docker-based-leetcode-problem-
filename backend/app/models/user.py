from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    username = Column(String(50), unique=True, nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    password_hash = Column(String, nullable=False)

    is_verified = Column(Boolean, default=False)

    is_admin = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
