from typing import Optional
from pydantic import BaseModel


class AdminProblemCreate(BaseModel):
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


class AdminProblemUpdate(BaseModel):
    title: Optional[str] = None
    difficulty: Optional[str] = None
    statement: Optional[str] = None
    constraints: Optional[str] = None
    examples: Optional[str] = None
    tags: Optional[str] = None
    company_tags: Optional[str] = None
    hints: Optional[str] = None
    editorial: Optional[str] = None


class AdminBoilerplateCreate(BaseModel):
    language: str
    starter_code: str


class AdminTestCaseCreate(BaseModel):
    input_data: str
    expected_output: str
    is_hidden: bool = False


class AdminUserResponse(BaseModel):
    id: str
    username: str
    email: str
    is_admin: bool
    is_verified: bool

    class Config:
        from_attributes = True
