from pydantic import BaseModel
from datetime import date


class ProgressResponse(BaseModel):
    solved_easy: int
    solved_medium: int
    solved_hard: int
    total_solved: int

    class Config:
        from_attributes = True


class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_solved_date: date | None

    class Config:
        from_attributes = True