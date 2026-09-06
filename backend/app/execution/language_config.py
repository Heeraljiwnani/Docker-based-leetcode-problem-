from dataclasses import dataclass
from typing import Dict, List, Optional
from app.core.config import settings

@dataclass
class LanguageConfig:
    name: str
    docker_image: str
    file_extension: str
    filename: str
    run_command: List[str]
    compile_command: Optional[List[str]] = None
    default_timeout: float = settings.DEFAULT_TIMEOUT

# Extensible registry of language configurations
LANGUAGES: Dict[str, LanguageConfig] = {
    "python": LanguageConfig(
        name="python",
        docker_image=settings.DOCKER_PYTHON_IMAGE,
        file_extension=".py",
        filename="solution.py",
        run_command=["python3", "solution.py"],
        default_timeout=settings.DEFAULT_TIMEOUT,
    ),
    "python3": LanguageConfig(
        name="python3",
        docker_image=settings.DOCKER_PYTHON_IMAGE,
        file_extension=".py",
        filename="solution.py",
        run_command=["python3", "solution.py"],
        default_timeout=settings.DEFAULT_TIMEOUT,
    ),
}

def get_language_config(language: str) -> Optional[LanguageConfig]:
    """Retrieve execution configuration for a given programming language."""
    return LANGUAGES.get(language.strip().lower())
