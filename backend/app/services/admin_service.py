from sqlalchemy.orm import Session

from app.models.problem import Problem
from app.models.boilerplate import Boilerplate
from app.models.testcase import TestCase
from app.models.user import User


# ------------------------------------------------------------ problems --

def create_problem(db: Session, data: dict) -> Problem:
    problem = Problem(**data)
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem


def update_problem(db: Session, problem: Problem, data: dict) -> Problem:
    for key, value in data.items():
        if value is not None:
            setattr(problem, key, value)
    db.commit()
    db.refresh(problem)
    return problem


def delete_problem(db: Session, problem: Problem):
    db.delete(problem)
    db.commit()


# --------------------------------------------------------- boilerplate --

def add_boilerplate(db: Session, problem_id: str, language: str, starter_code: str):
    existing = db.query(Boilerplate).filter(
        Boilerplate.problem_id == problem_id,
        Boilerplate.language == language
    ).first()

    if existing:
        existing.starter_code = starter_code
        db.commit()
        db.refresh(existing)
        return existing

    boilerplate = Boilerplate(
        problem_id=problem_id, language=language, starter_code=starter_code
    )
    db.add(boilerplate)
    db.commit()
    db.refresh(boilerplate)
    return boilerplate


def delete_boilerplate(db: Session, boilerplate_id: int) -> bool:
    row = db.query(Boilerplate).filter(Boilerplate.id == boilerplate_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ------------------------------------------------------------ testcase --

def add_testcase(db: Session, problem_id: str, input_data: str,
                  expected_output: str, is_hidden: bool):
    testcase = TestCase(
        problem_id=problem_id,
        input_data=input_data,
        expected_output=expected_output,
        is_hidden=is_hidden,
    )
    db.add(testcase)
    db.commit()
    db.refresh(testcase)
    return testcase


def delete_testcase(db: Session, testcase_id: int) -> bool:
    row = db.query(TestCase).filter(TestCase.id == testcase_id).first()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


# ----------------------------------------------------------------users --

def list_users(db: Session):
    return db.query(User).order_by(User.created_at.desc()).all()
