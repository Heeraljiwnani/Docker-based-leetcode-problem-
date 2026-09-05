from sqlalchemy import Column, Integer, ForeignKey, Text, String
from sqlalchemy.orm import relationship

from app.core.database import Base

class Boilerplate(Base):
    __tablename__ = "boilerplates"

    id = Column(Integer, primary_key=True, index=True)

    problem_id = Column(String, ForeignKey("problems.id"))

    language = Column(String)

    starter_code = Column(Text)

    problem = relationship("Problem", back_populates="boilerplates")