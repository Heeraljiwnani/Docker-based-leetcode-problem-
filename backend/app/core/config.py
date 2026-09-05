import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "CodeArena Code Execution Engine"
    API_V1_STR: str = "/api/v1"
    
    # Execution Settings
    DEFAULT_TIMEOUT: float = 5.0  # seconds
    MAX_TIMEOUT: float = 15.0      # seconds
    
    # Docker Resource Limits
    DOCKER_PYTHON_IMAGE: str = "python:3.11-slim"
    DOCKER_MEM_LIMIT: str = "128m"
    DOCKER_CPU_PERIOD: int = 100000
    DOCKER_CPU_QUOTA: int = 50000  # 0.5 CPU core limit

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
