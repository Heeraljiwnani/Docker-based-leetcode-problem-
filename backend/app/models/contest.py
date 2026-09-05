from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class Contest(Base):
    __tablename__ = "contests"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text, nullable=True)

    start_time = Column(DateTime, nullable=False)

    end_time = Column(DateTime, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    problems = relationship("ContestProblem", back_populates="contest")
