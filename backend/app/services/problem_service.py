from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.problem import Problem
from app.models.boilerplate import Boilerplate
from app.models.testcase import TestCase
from app.models.submission import Submission


def get_problems_paginated(
    db: Session,
    page: int = 1,
    limit: int = 20,
    difficulty: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
):
    query = db.query(Problem)

    if difficulty:
        query = query.filter(Problem.difficulty.ilike(difficulty))

    if tag:
        query = query.filter(Problem.tags.ilike(f"%{tag}%"))

    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(Problem.title.ilike(like), Problem.tags.ilike(like))
        )

    total = query.count()

    items = (
        query.order_by(Problem.id)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return total, items


def get_all_problems(db: Session):
    """Kept for backwards compatibility / internal use."""
    return db.query(Problem).all()


def get_problem(db: Session, problem_id: str):
    return db.query(Problem).filter(
        Problem.id == problem_id
    ).first()


def get_related_problems(db: Session, problem_id: str, limit: int = 5):
    problem = get_problem(db, problem_id)
    if not problem or not problem.tags:
        return []

    tags = [t.strip() for t in problem.tags.split(",") if t.strip()]
    if not tags:
        return []

    conditions = [Problem.tags.ilike(f"%{t}%") for t in tags]

    return (
        db.query(Problem)
        .filter(Problem.id != problem_id)
        .filter(or_(*conditions))
        .limit(limit)
        .all()
    )


def get_solved_problem_ids(db: Session, user_id) -> set:
    rows = (
        db.query(Submission.problem_id)
        .filter(Submission.user_id == user_id, Submission.status == "Accepted")
        .distinct()
        .all()
    )
    return {r[0] for r in rows}


def get_boilerplate(db: Session, problem_id: str, language: str):
    return db.query(Boilerplate).filter(
        Boilerplate.problem_id == problem_id,
        Boilerplate.language == language
    ).first()


def get_all_boilerplates(db: Session, problem_id: str):
    """All starter-code languages for a problem, e.g. for a language dropdown."""
    return db.query(Boilerplate).filter(
        Boilerplate.problem_id == problem_id
    ).all()


def get_sample_cases(db: Session, problem_id: str):
    return db.query(TestCase).filter(
        TestCase.problem_id == problem_id,
        TestCase.is_hidden.is_(False)
    ).all()


def get_hidden_cases(db: Session, problem_id: str):
    return db.query(TestCase).filter(
        TestCase.problem_id == problem_id,
        TestCase.is_hidden.is_(True)
    ).all()
