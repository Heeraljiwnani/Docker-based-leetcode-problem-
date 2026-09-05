from pydantic import BaseModel

class TestCase(BaseModel):
    input: str
    expected_output: str

class RunRequest(BaseModel):
    language: str
    code: str
    testcases: list[TestCase]