from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from app.core.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    problem_id = Column(String, ForeignKey("problems.id"))

    # Set when this submission was made as part of a contest.
    contest_id = Column(Integer, ForeignKey("contests.id"), nullable=True)

    language = Column(String(20), nullable=False)

    code = Column(Text, nullable=False)

    status = Column(String(30), nullable=False)

    runtime = Column(String(20))

    memory = Column(String(20))

    passed_testcases = Column(Integer, default=0)

    total_testcases = Column(Integer, default=0)

    submitted_at = Column(DateTime, default=datetime.utcnow)
