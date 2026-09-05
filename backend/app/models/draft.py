from sqlalchemy import Column, Integer, ForeignKey, Text, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from app.core.database import Base

class Draft(Base):
    __tablename__ = "drafts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    problem_id = Column(String, ForeignKey("problems.id"))

    language = Column(String(20), nullable=False)

    code = Column(Text, nullable=False)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)