import logging
from typing import Dict, Any, Optional

from app.execution.docker_runner import DockerRunner
from app.execution.base_runner import ExecutionResult
from app.execution.language_config import get_language_config

logger = logging.getLogger(__name__)

class ExecutionService:
    def __init__(self):
        self.runner = DockerRunner()

    def run_code(self, language: str, code: str, timeout: Optional[float] = None) -> Dict[str, Any]:
        """
        Orchestrates code execution requests against isolated runner.
        Returns structured execution dictionary.
        """
        lang_config = get_language_config(language)
        if not lang_config:
            return {
                "status": "execution_error",
                "stdout": "",
                "stderr": f"Unsupported language: '{language}'",
                "exit_code": 1,
                "execution_time_ms": 0.0,
                "error_message": f"Unsupported language: '{language}'"
            }

        if not code or not code.strip():
            return {
                "status": "success",
                "stdout": "",
                "stderr": "",
                "exit_code": 0,
                "execution_time_ms": 0.0
            }

        result: ExecutionResult = self.runner.run_code(
            language=language,
            code=code,
            timeout=timeout
        )

        return {
            "status": result.status,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "exit_code": result.exit_code,
            "execution_time_ms": result.execution_time_ms,
            "error_message": result.error_message
        }
