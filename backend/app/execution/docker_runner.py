import os
import time
import tempfile
import logging
from typing import Optional
import docker
from docker.errors import DockerException, ContainerError, APIError

from app.core.config import settings
from app.execution.base_runner import BaseRunner, ExecutionResult
from app.execution.language_config import get_language_config, LanguageConfig

logger = logging.getLogger(__name__)

class DockerRunner(BaseRunner):
    """
    Docker-based code runner that executes user code inside isolated,
    ephemeral containers with security and resource constraints.
    """

    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception as e:
            logger.warning(f"Failed to initialize Docker SDK client: {e}")
            self.client = None

    def run_code(self, language: str, code: str, timeout: Optional[float] = None) -> ExecutionResult:
        lang_config = get_language_config(language)
        if not lang_config:
            return ExecutionResult(
                status="execution_error",
                stdout="",
                stderr="",
                exit_code=1,
                error_message=f"Unsupported programming language: {language}"
            )

        effective_timeout = timeout if timeout is not None else lang_config.default_timeout
        effective_timeout = min(max(0.5, effective_timeout), settings.MAX_TIMEOUT)

        # Create temporary execution directory on host
        with tempfile.TemporaryDirectory(prefix="code_exec_") as temp_dir:
            file_path = os.path.join(temp_dir, lang_config.filename)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(code)

            return self._execute_in_container(temp_dir, lang_config, effective_timeout)

    def _execute_in_container(self, temp_dir: str, lang_config: LanguageConfig, timeout: float) -> ExecutionResult:
        container = None
        start_time = time.time()

        try:
            if not self.client:
                # Try re-initializing client
                self.client = docker.from_env()

            # Spawn ephemeral container
            container = self.client.containers.create(
                image=lang_config.docker_image,
                command=lang_config.run_command,
                volumes={
                    temp_dir: {"bind": "/app", "mode": "ro"}  # Read-only mount of user code
                },
                working_dir="/app",
                network_mode="none",  # Security: No network access
                mem_limit=settings.DOCKER_MEM_LIMIT,
                cpu_period=settings.DOCKER_CPU_PERIOD,
                cpu_quota=settings.DOCKER_CPU_QUOTA,
            )

            container.start()

            # Wait for execution with timeout protection
            try:
                result = container.wait(timeout=timeout)
                exit_code = result.get("StatusCode", 0)
                execution_time_ms = round((time.time() - start_time) * 1000, 2)

                # Capture logs (separate stdout/stderr stream parsing)
                stdout_bytes = container.logs(stdout=True, stderr=False)
                stderr_bytes = container.logs(stdout=False, stderr=True)

                stdout_str = stdout_bytes.decode("utf-8", errors="replace")
                stderr_str = stderr_bytes.decode("utf-8", errors="replace")

                status = "success" if exit_code == 0 else "runtime_error"

                return ExecutionResult(
                    status=status,
                    stdout=stdout_str,
                    stderr=stderr_str,
                    exit_code=exit_code,
                    execution_time_ms=execution_time_ms
                )

            except Exception as wait_err:
                # Execution timed out
                execution_time_ms = round((time.time() - start_time) * 1000, 2)
                try:
                    container.kill()
                except Exception:
                    pass

                return ExecutionResult(
                    status="timeout",
                    stdout="",
                    stderr=f"Execution timed out after {timeout} seconds.",
                    exit_code=124,
                    execution_time_ms=execution_time_ms,
                    error_message=f"Time limit exceeded ({timeout}s)"
                )

        except DockerException as de:
            logger.error(f"Docker API error: {de}")
            return ExecutionResult(
                status="execution_error",
                stdout="",
                stderr="",
                exit_code=1,
                error_message="Execution engine environment error."
            )
        except Exception as ex:
            logger.error(f"Unexpected execution error: {ex}")
            return ExecutionResult(
                status="execution_error",
                stdout="",
                stderr="",
                exit_code=1,
                error_message=str(ex)
            )
        finally:
            if container:
                try:
                    container.remove(force=True)
                except Exception:
                    pass
