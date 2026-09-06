from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.schemas.admin_schema import (
    AdminProblemCreate,
    AdminProblemUpdate,
    AdminBoilerplateCreate,
    AdminTestCaseCreate,
    AdminUserResponse,
)
from app.schemas.problem_schema import ProblemDetail, BoilerplateResponse, TestCaseResponse
from app.services.problem_service import get_problem
from app.services.admin_service import (
    create_problem,
    update_problem,
    delete_problem,
    add_boilerplate,
    delete_boilerplate,
    add_testcase,
    delete_testcase,
    list_users,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(get_current_admin)],  # every route here requires an admin
)


# ------------------------------------------------------------ problems --

@router.post("/problems", response_model=ProblemDetail)
def admin_create_problem(body: AdminProblemCreate, db: Session = Depends(get_db)):
    if get_problem(db, body.id):
        raise HTTPException(400, "A problem with this id already exists")
    return create_problem(db, body.model_dump())


@router.put("/problems/{problem_id}", response_model=ProblemDetail)
def admin_update_problem(
    problem_id: str, body: AdminProblemUpdate, db: Session = Depends(get_db)
):
    problem = get_problem(db, problem_id)
    if not problem:
        raise HTTPException(404, "Problem not found")
    return update_problem(db, problem, body.model_dump())


@router.delete("/problems/{problem_id}")
def admin_delete_problem(problem_id: str, db: Session = Depends(get_db)):
    problem = get_problem(db, problem_id)
    if not problem:
        raise HTTPException(404, "Problem not found")
    delete_problem(db, problem)
    return {"message": "Problem deleted"}


# --------------------------------------------------------- boilerplate --

@router.post(
    "/problems/{problem_id}/boilerplates",
    response_model=BoilerplateResponse
)
def admin_add_boilerplate(
    problem_id: str, body: AdminBoilerplateCreate, db: Session = Depends(get_db)
):
    if not get_problem(db, problem_id):
        raise HTTPException(404, "Problem not found")
    return add_boilerplate(db, problem_id, body.language, body.starter_code)


@router.delete("/boilerplates/{boilerplate_id}")
def admin_delete_boilerplate(boilerplate_id: int, db: Session = Depends(get_db)):
    if not delete_boilerplate(db, boilerplate_id):
        raise HTTPException(404, "Boilerplate not found")
    return {"message": "Boilerplate deleted"}


# ------------------------------------------------------------ testcase --

@router.post(
    "/problems/{problem_id}/testcases",
    response_model=TestCaseResponse
)
def admin_add_testcase(
    problem_id: str, body: AdminTestCaseCreate, db: Session = Depends(get_db)
):
    if not get_problem(db, problem_id):
        raise HTTPException(404, "Problem not found")
    return add_testcase(db, problem_id, body.input_data, body.expected_output, body.is_hidden)


@router.delete("/testcases/{testcase_id}")
def admin_delete_testcase(testcase_id: int, db: Session = Depends(get_db)):
    if not delete_testcase(db, testcase_id):
        raise HTTPException(404, "Testcase not found")
    return {"message": "Testcase deleted"}


# ----------------------------------------------------------------users --

@router.get("/users", response_model=List[AdminUserResponse])
def admin_list_users(db: Session = Depends(get_db)):
    users = list_users(db)
    return [
        AdminUserResponse(
            id=str(u.id), username=u.username, email=u.email,
            is_admin=u.is_admin, is_verified=u.is_verified
        )
        for u in users
    ]
