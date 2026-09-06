from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_optional_current_user
from app.models.user import User
from app.schemas.problem_schema import (
    ProblemList,
    PaginatedProblems,
    ProblemDetail,
    BoilerplateResponse,
    TestCaseResponse
)
from app.services.problem_service import (
    get_problems_paginated,
    get_problem,
    get_related_problems,
    get_solved_problem_ids,
    get_boilerplate,
    get_all_boilerplates,
    get_sample_cases
)

router = APIRouter(
    prefix="/problems",
    tags=["Problems"]
)


@router.get("/", response_model=PaginatedProblems)
def list_problems(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    difficulty: Optional[str] = Query(None, description="Easy / Medium / Hard"),
    tag: Optional[str] = Query(None, description="Filter by a tag, e.g. Array"),
    search: Optional[str] = Query(None, description="Search in title/tags"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    total, problems = get_problems_paginated(
        db, page=page, limit=limit,
        difficulty=difficulty, tag=tag, search=search
    )

    solved_ids = (
        get_solved_problem_ids(db, current_user.id) if current_user else set()
    )

    items = [
        ProblemList(
            id=p.id,
            title=p.title,
            difficulty=p.difficulty,
            tags=p.tags,
            company_tags=p.company_tags,
            is_solved=(p.id in solved_ids) if current_user else None,
        )
        for p in problems
    ]

    return PaginatedProblems(total=total, page=page, limit=limit, items=items)


@router.get("/{problem_id}", response_model=ProblemDetail)
def problem_detail(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    problem = get_problem(db, problem_id)

    if not problem:
        raise HTTPException(404, "Problem not found")

    is_solved = None
    if current_user:
        is_solved = problem.id in get_solved_problem_ids(db, current_user.id)

    return ProblemDetail(
        id=problem.id,
        title=problem.title,
        difficulty=problem.difficulty,
        statement=problem.statement,
        constraints=problem.constraints,
        examples=problem.examples,
        tags=problem.tags,
        company_tags=problem.company_tags,
        hints=problem.hints,
        editorial=problem.editorial,
        is_solved=is_solved,
    )


@router.get("/{problem_id}/related", response_model=List[ProblemList])
def related_problems(problem_id: str, db: Session = Depends(get_db)):
    related = get_related_problems(db, problem_id)
    return [
        ProblemList(
            id=p.id, title=p.title, difficulty=p.difficulty,
            tags=p.tags, company_tags=p.company_tags
        )
        for p in related
    ]


@router.get("/{problem_id}/boilerplate", response_model=BoilerplateResponse)
def boilerplate(problem_id: str,
                 language: str,
                 db: Session = Depends(get_db)):

    code = get_boilerplate(db, problem_id, language)

    if not code:
        raise HTTPException(404, "Boilerplate not found")

    return code


@router.get(
    "/{problem_id}/boilerplates",
    response_model=List[BoilerplateResponse]
)
def all_boilerplates(problem_id: str,
                      db: Session = Depends(get_db)):
    """Starter code for every supported language - handy for a language dropdown."""
    return get_all_boilerplates(db, problem_id)


@router.get(
    "/{problem_id}/sample-testcases",
    response_model=List[TestCaseResponse]
)
def sample_cases(problem_id: str,
                  db: Session = Depends(get_db)):
    return get_sample_cases(db, problem_id)
