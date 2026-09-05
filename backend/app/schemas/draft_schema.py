from pydantic import BaseModel

class DraftSave(BaseModel):
    problem_id: str
    language: str
    code: str


class DraftResponse(BaseModel):
    problem_id: str
    language: str
    code: str

    class Config:
        from_attributes = True