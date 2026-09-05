from typing import Optional
from pydantic import BaseModel


class GlobalLeaderboardEntry(BaseModel):
    rank: int
    username: str
    total_solved: int
    solved_easy: int
    solved_medium: int
    solved_hard: int
    current_streak: int
    longest_streak: int
