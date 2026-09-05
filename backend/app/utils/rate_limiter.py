"""
Lightweight in-memory sliding-window rate limiter.

Good enough for a single-process demo/college-project deployment.
For a real multi-worker production deployment, swap this for a
Redis-backed limiter (e.g. slowapi + redis) - the call sites (a
FastAPI dependency) would not need to change.
"""

import time
import threading
from collections import defaultdict

from fastapi import Request, HTTPException

_lock = threading.Lock()
_hits: dict[str, list[float]] = defaultdict(list)


def _parse_rate(rate: str):
    """'5/60' -> (5 requests, 60 seconds)"""
    count_str, period_str = rate.split("/")
    return int(count_str), int(period_str)


def rate_limit(rate: str, bucket: str):
    """
    Returns a FastAPI dependency that limits calls per client IP.

    rate: string like "5/60" meaning 5 requests per 60 seconds.
    bucket: a name for this limiter (so /login and /register don't share
            the same counter).
    """
    max_calls, period = _parse_rate(rate)

    def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        key = f"{bucket}:{client_ip}"
        now = time.time()

        with _lock:
            hits = _hits[key]
            # drop timestamps outside the window
            cutoff = now - period
            while hits and hits[0] < cutoff:
                hits.pop(0)

            if len(hits) >= max_calls:
                retry_after = int(period - (now - hits[0])) + 1
                raise HTTPException(
                    status_code=429,
                    detail=f"Too many requests. Try again in {retry_after}s.",
                    headers={"Retry-After": str(retry_after)},
                )

            hits.append(now)

    return dependency
