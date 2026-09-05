from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.submission import Submission
from app.dependencies import get_db, get_current_user
from app.utils.verdict import verdict
from app.utils.rate_limiter import rate_limit
from app.core.config import RATE_LIMIT_RUN, RATE_LIMIT_SUBMIT

from app.schemas.submission_schema import (
    RunRequest, SubmitRequest, SubmissionResponse, SubmissionDetail
)

from app.services.problem_service import (
    get_sample_cases,
    get_hidden_cases
)

from app.services.submission_service import (
    create_submission,
    submission_history,
    problem_history
)

from app.services.progress_service import update_progress
from app.services.streak_service import update_streak

from app.utils.docker_client import run_code, submit_code


router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"]
)


# ---------------- RUN CODE ---------------- #

@router.post("/run", dependencies=[Depends(rate_limit(RATE_LIMIT_RUN, "run"))])
def run(
    request: RunRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    sample_cases = get_sample_cases(db, request.problem_id)

    result = run_code(
        request.language,
        request.code,
        sample_cases
    )

    return result


# ---------------- SUBMIT CODE ---------------- #

@router.post(
    "/submit",
    response_model=SubmissionDetail,
    dependencies=[Depends(rate_limit(RATE_LIMIT_SUBMIT, "submit"))],
)
def submit(
    request: SubmitRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    hidden_cases = get_hidden_cases(db, request.problem_id)

    # Docker Runner response
    result = submit_code(
        request.language,
        request.code,
        hidden_cases
    )

    # Convert runner output into LeetCode verdict
    status = verdict(result)

    # Check if user already solved this problem
    already_solved = db.query(Submission).filter(
        Submission.user_id == current_user.id,
        Submission.problem_id == request.problem_id,
        Submission.status == "Accepted"
    ).first()

    # Save every submission
    submission = create_submission(
        db=db,
        user_id=current_user.id,
        problem_id=request.problem_id,
        language=request.language,
        code=request.code,
        contest_id=request.contest_id,
        result={
            "status": status,
            "runtime": result["runtime"],
            "memory": result["memory"],
            "passed": result["passed"],
            "total": result["total"]
        }
    )

    # Update progress only first time Accepted
    if status == "Accepted" and already_solved is None:
        update_progress(db, current_user.id, request.problem_id)

    # Update streak on every Accepted day
    if status == "Accepted":
        update_streak(db, current_user.id)

    return submission


# -------- HISTORY OF ALL SUBMISSIONS -------- #

@router.get("/history", response_model=List[SubmissionResponse])
def history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return submission_history(db, current_user.id)


# ------- HISTORY OF PARTICULAR PROBLEM ------- #

@router.get("/problem/{problem_id}", response_model=List[SubmissionResponse])
def history_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return problem_history(
        db,
        current_user.id,
        problem_id
    )
