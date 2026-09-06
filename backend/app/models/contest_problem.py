from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class ContestProblem(Base):
    __tablename__ = "contest_problems"

    id = Column(Integer, primary_key=True, index=True)

    contest_id = Column(Integer, ForeignKey("contests.id"), nullable=False)

    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)

    # Display order within the contest (1, 2, 3...)
    order_index = Column(Integer, default=1)

    contest = relationship("Contest", back_populates="problems")
