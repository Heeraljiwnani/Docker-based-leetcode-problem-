from sqlalchemy.orm import Session

from app.models.progress import Progress
from app.models.problem import Problem
from app.models.submission import Submission


def get_progress(db: Session, user_id):
    progress = db.query(Progress).filter(
        Progress.user_id == user_id
    ).first()

    if progress:
        return progress

    progress = Progress(user_id=user_id)
    db.add(progress)
    db.commit()
    db.refresh(progress)

    return progress


def update_progress(db: Session, user_id, problem_id):

    progress = get_progress(db, user_id)

    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    progress.total_solved += 1

    if problem.difficulty == "Easy":
        progress.solved_easy += 1
    elif problem.difficulty == "Medium":
        progress.solved_medium += 1
    else:
        progress.solved_hard += 1

    db.commit()
    db.refresh(progress)

    return progress