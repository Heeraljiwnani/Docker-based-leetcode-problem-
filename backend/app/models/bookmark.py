from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from app.core.database import Base


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("user_id", "problem_id", name="uq_user_problem_bookmark"),
    )
