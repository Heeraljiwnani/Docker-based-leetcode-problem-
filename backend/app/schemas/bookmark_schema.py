from datetime import datetime
from pydantic import BaseModel


class BookmarkResponse(BaseModel):
    problem_id: str
    created_at: datetime

    class Config:
        from_attributes = True
