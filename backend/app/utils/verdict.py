def verdict(result: dict) -> str:
    """
    Converts the raw JSON coming back from the Docker code-runner
    microservice into a LeetCode-style verdict string.
    """

    if result.get("runner_error"):
        return "Runner Unavailable"

    if result.get("compile_error"):
        return "Compilation Error"

    if result.get("runtime_error"):
        return "Runtime Error"

    if result.get("time_limit"):
        return "Time Limit Exceeded"

    if result.get("passed", 0) == result.get("total", 0) and result.get("total", 0) > 0:
        return "Accepted"

    return "Wrong Answer"
