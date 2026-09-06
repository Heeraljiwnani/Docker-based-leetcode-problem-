from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


class ContestCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    problem_ids: List[str]


class ContestProblemBrief(BaseModel):
    id: str
    title: str
    difficulty: str

    class Config:
        from_attributes = True


class ContestResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    status: str  # upcoming / ongoing / ended

    class Config:
        from_attributes = True


class ContestDetail(ContestResponse):
    problems: List[ContestProblemBrief]


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    solved_count: int
    last_submission_at: Optional[datetime] = None
