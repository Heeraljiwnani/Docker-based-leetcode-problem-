from datetime import datetime

from sqlalchemy.orm import Session

from app.models.contest import Contest
from app.models.contest_problem import ContestProblem
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User


def contest_status(contest: Contest) -> str:
    now = datetime.utcnow()
    if now < contest.start_time:
        return "upcoming"
    if now > contest.end_time:
        return "ended"
    return "ongoing"


def create_contest(db: Session, title, description, start_time, end_time, problem_ids):
    contest = Contest(
        title=title, description=description,
        start_time=start_time, end_time=end_time
    )
    db.add(contest)
    db.commit()
    db.refresh(contest)

    for index, problem_id in enumerate(problem_ids, start=1):
        db.add(ContestProblem(
            contest_id=contest.id, problem_id=problem_id, order_index=index
        ))
    db.commit()

    return contest


def list_contests(db: Session):
    return db.query(Contest).order_by(Contest.start_time.desc()).all()


def get_contest(db: Session, contest_id: int):
    return db.query(Contest).filter(Contest.id == contest_id).first()


def get_contest_problems(db: Session, contest_id: int):
    rows = (
        db.query(Problem)
        .join(ContestProblem, ContestProblem.problem_id == Problem.id)
        .filter(ContestProblem.contest_id == contest_id)
        .order_by(ContestProblem.order_index)
        .all()
    )
    return rows


def get_contest_leaderboard(db: Session, contest_id: int, limit: int = 50):
    """
    Ranks users by number of distinct problems solved (Accepted) during
    the contest, tie-broken by earliest last-accepted-submission time.
    """
    rows = (
        db.query(
            User.username,
            Submission.problem_id,
            Submission.submitted_at,
        )
        .join(Submission, Submission.user_id == User.id)
        .filter(
            Submission.contest_id == contest_id,
            Submission.status == "Accepted",
        )
        .all()
    )

    per_user = {}
    for username, problem_id, submitted_at in rows:
        entry = per_user.setdefault(
            username, {"solved": set(), "last_submission": submitted_at}
        )
        entry["solved"].add(problem_id)
        if submitted_at and (
            entry["last_submission"] is None
            or submitted_at > entry["last_submission"]
        ):
            entry["last_submission"] = submitted_at

    leaderboard = [
        {
            "username": username,
            "solved_count": len(data["solved"]),
            "last_submission_at": data["last_submission"],
        }
        for username, data in per_user.items()
    ]

    leaderboard.sort(
        key=lambda e: (-e["solved_count"], e["last_submission_at"] or datetime.max)
    )

    for i, entry in enumerate(leaderboard[:limit], start=1):
        entry["rank"] = i

    return leaderboard[:limit]
