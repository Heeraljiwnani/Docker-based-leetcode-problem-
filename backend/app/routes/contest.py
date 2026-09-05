from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.schemas.contest_schema import (
    ContestCreate, ContestResponse, ContestDetail,
    ContestProblemBrief, LeaderboardEntry
)
from app.services.contest_service import (
    create_contest, list_contests, get_contest,
    get_contest_problems, get_contest_leaderboard, contest_status
)
from app.services.problem_service import get_problem

router = APIRouter(
    prefix="/contests",
    tags=["Contests"]
)


@router.post("/", response_model=ContestResponse, dependencies=[Depends(get_current_admin)])
def admin_create_contest(body: ContestCreate, db: Session = Depends(get_db)):
    for pid in body.problem_ids:
        if not get_problem(db, pid):
            raise HTTPException(404, f"Problem '{pid}' not found")

    contest = create_contest(
        db, body.title, body.description,
        body.start_time, body.end_time, body.problem_ids
    )

    return ContestResponse(
        id=contest.id, title=contest.title, description=contest.description,
        start_time=contest.start_time, end_time=contest.end_time,
        status=contest_status(contest)
    )


@router.get("/", response_model=List[ContestResponse])
def all_contests(db: Session = Depends(get_db)):
    contests = list_contests(db)
    return [
        ContestResponse(
            id=c.id, title=c.title, description=c.description,
            start_time=c.start_time, end_time=c.end_time,
            status=contest_status(c)
        )
        for c in contests
    ]


@router.get("/{contest_id}", response_model=ContestDetail)
def contest_detail(contest_id: int, db: Session = Depends(get_db)):
    contest = get_contest(db, contest_id)
    if not contest:
        raise HTTPException(404, "Contest not found")

    problems = get_contest_problems(db, contest_id)

    return ContestDetail(
        id=contest.id, title=contest.title, description=contest.description,
        start_time=contest.start_time, end_time=contest.end_time,
        status=contest_status(contest),
        problems=[
            ContestProblemBrief(id=p.id, title=p.title, difficulty=p.difficulty)
            for p in problems
        ]
    )


@router.get("/{contest_id}/leaderboard", response_model=List[LeaderboardEntry])
def contest_leaderboard(contest_id: int, db: Session = Depends(get_db)):
    if not get_contest(db, contest_id):
        raise HTTPException(404, "Contest not found")

    rows = get_contest_leaderboard(db, contest_id)
    return [LeaderboardEntry(**row) for row in rows]
