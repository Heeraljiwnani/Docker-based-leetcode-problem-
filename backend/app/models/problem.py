from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(String, primary_key=True)

    title = Column(String(200), nullable=False)

    difficulty = Column(String(20), nullable=False)

    statement = Column(Text, nullable=False)

    constraints = Column(Text)

    examples = Column(Text)

    tags = Column(String)

    # Comma separated, e.g. "Google,Amazon,Microsoft"
    company_tags = Column(String, nullable=True)

    hints = Column(Text, nullable=True)

    editorial = Column(Text, nullable=True)

    boilerplates = relationship("Boilerplate", back_populates="problem")

    testcases = relationship("TestCase", back_populates="problem")
