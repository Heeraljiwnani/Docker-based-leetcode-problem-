from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

@dataclass
class ExecutionResult:
    status: str  # "success" | "runtime_error" | "timeout" | "execution_error"
    stdout: str
    stderr: str
    exit_code: int
    execution_time_ms: float = 0.0
    error_message: Optional[str] = None

class BaseRunner(ABC):
    @abstractmethod
    def run_code(self, language: str, code: str, timeout: Optional[float] = None) -> ExecutionResult:
        """Execute user code inside an isolated environment."""
        pass
