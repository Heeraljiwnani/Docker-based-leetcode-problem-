from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)

    solved_easy = Column(Integer, default=0)

    solved_medium = Column(Integer, default=0)

    solved_hard = Column(Integer, default=0)

    total_solved = Column(Integer, default=0)