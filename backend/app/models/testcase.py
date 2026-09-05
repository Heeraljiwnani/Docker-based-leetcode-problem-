from sqlalchemy import Column, Integer, ForeignKey, Text, Boolean, String
from sqlalchemy.orm import relationship

from app.core.database import Base

class TestCase(Base):
    __tablename__ = "testcases"

    id = Column(Integer, primary_key=True)

    problem_id = Column(String, ForeignKey("problems.id"))

    input_data = Column(Text)

    expected_output = Column(Text)

    is_hidden = Column(Boolean, default=False)

    problem = relationship("Problem", back_populates="testcases")