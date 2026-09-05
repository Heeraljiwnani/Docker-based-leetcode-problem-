from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class RunRequest(BaseModel):
    problem_id: str
    language: str
    code: str


class SubmitRequest(BaseModel):
    problem_id: str
    language: str
    code: str
    contest_id: Optional[int] = None


class SubmissionResponse(BaseModel):
    id: int
    problem_id: str
    language: str
    status: str
    runtime: str
    memory: str
    passed_testcases: int
    total_testcases: int
    submitted_at: datetime

    class Config:
        from_attributes = True


class SubmissionDetail(SubmissionResponse):
    code: str
