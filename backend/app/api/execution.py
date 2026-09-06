from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.execution_service import ExecutionService

router = APIRouter(tags=["Code Execution"])
execution_service = ExecutionService()

class CodeExecutionRequest(BaseModel):
    language: str = Field(..., json_schema_extra={"example": "python"}, description="Programming language (e.g. 'python')")
    code: str = Field(..., json_schema_extra={"example": "print('Hello World')"}, description="Source code to execute")
    timeout: Optional[float] = Field(None, json_schema_extra={"example": 5.0}, description="Optional execution timeout limit in seconds")

class CodeExecutionResponse(BaseModel):
    status: str = Field(..., json_schema_extra={"example": "success"}, description="Execution status: 'success', 'runtime_error', 'timeout', or 'execution_error'")
    stdout: str = Field("", description="Standard output captured from execution")
    stderr: str = Field("", description="Standard error captured from execution")
    exit_code: int = Field(0, description="Process exit code")
    execution_time_ms: float = Field(0.0, description="Execution duration in milliseconds")
    error_message: Optional[str] = Field(None, description="Detailed error message if execution status is execution_error or timeout")

@router.post("/execute/run", response_model=CodeExecutionResponse, status_code=status.HTTP_200_OK)
@router.post("/api/v1/execute/run", response_model=CodeExecutionResponse, status_code=status.HTTP_200_OK)
async def run_code(request: CodeExecutionRequest):
    """
    Execute user submitted code in an isolated Docker container environment.
    """
    result = execution_service.run_code(
        language=request.language,
        code=request.code,
        timeout=request.timeout
    )
    return result

@router.get("/execute/health")
async def health_check():
    """Health check endpoint for code execution engine."""
    return {"status": "ok", "engine": "Docker Python Runner"}
