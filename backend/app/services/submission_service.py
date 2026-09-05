from typing import Optional

from sqlalchemy.orm import Session

from app.models.submission import Submission


def create_submission(
    db: Session,
    user_id,
    problem_id,
    language,
    code,
    result,
    contest_id: Optional[int] = None,
):

    submission = Submission(
        user_id=user_id,
        problem_id=problem_id,
        contest_id=contest_id,
        language=language,
        code=code,
        status=result["status"],
        runtime=result["runtime"],
        memory=result["memory"],
        passed_testcases=result["passed"],
        total_testcases=result["total"]
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return submission


def submission_history(db: Session, user_id):
    return db.query(Submission).filter(
        Submission.user_id == user_id
    ).order_by(
        Submission.submitted_at.desc()
    ).all()


def problem_history(db: Session, user_id, problem_id):
    return db.query(Submission).filter(
        Submission.user_id == user_id,
        Submission.problem_id == problem_id
    ).order_by(
        Submission.submitted_at.desc()
    ).all()
