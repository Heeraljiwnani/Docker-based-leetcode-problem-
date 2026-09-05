from typing import List, Optional
from pydantic import BaseModel


class ProblemList(BaseModel):
    id: str
    title: str
    difficulty: str
    tags: str
    company_tags: Optional[str] = None
    is_solved: Optional[bool] = None

    class Config:
        from_attributes = True


class PaginatedProblems(BaseModel):
    total: int
    page: int
    limit: int
    items: List[ProblemList]


class ProblemDetail(BaseModel):
    id: str
    title: str
    difficulty: str
    statement: str
    constraints: Optional[str] = None
    examples: Optional[str] = None
    tags: str
    company_tags: Optional[str] = None
    hints: Optional[str] = None
    editorial: Optional[str] = None
    is_solved: Optional[bool] = None

    class Config:
        from_attributes = True


class BoilerplateResponse(BaseModel):
    language: str
    starter_code: str

    class Config:
        from_attributes = True


class TestCaseResponse(BaseModel):
    input_data: str
    expected_output: str

    class Config:
        from_attributes = True
