import requests
from requests.exceptions import RequestException

from app.core.config import RUNNER_URL


def _build_payload(language, code, testcases):
    return {
        "language": language,
        "code": code,
        "testcases": [
            {
                "input": tc.input_data,
                "expected_output": tc.expected_output
            }
            for tc in testcases
        ]
    }


def run_code(language, code, testcases):
    """
    Used by the "Run" button. Sends sample (visible) testcases to the
    Docker code-runner microservice and returns its raw response as-is.
    """

    payload = _build_payload(language, code, testcases)

    try:
        response = requests.post(
            f"{RUNNER_URL}/run",
            json=payload,
            timeout=15
        )

        response.raise_for_status()
        return response.json()

    except RequestException as e:
        return {
            "runner_error": True,
            "status": "Runner Unavailable",
            "runtime": "0 ms",
            "memory": "0 MB",
            "output": [],
            "error": str(e)
        }


def submit_code(language, code, hidden_testcases):
    """
    Used by the "Submit" button. Sends hidden testcases to the Docker
    code-runner microservice for final judging.
    """

    payload = _build_payload(language, code, hidden_testcases)

    try:
        response = requests.post(
            f"{RUNNER_URL}/submit",
            json=payload,
            timeout=20
        )

        response.raise_for_status()
        return response.json()

    except RequestException as e:
        return {
            "runner_error": True,
            "compile_error": False,
            "runtime_error": False,
            "time_limit": False,
            "runtime": "0 ms",
            "memory": "0 MB",
            "passed": 0,
            "total": len(hidden_testcases),
            "error": str(e)
        }
