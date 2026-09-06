from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Streak(Base):
    __tablename__ = "streaks"

    id = Column(Integer, primary_key=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)

    current_streak = Column(Integer, default=0)

    longest_streak = Column(Integer, default=0)

    last_solved_date = Column(Date)