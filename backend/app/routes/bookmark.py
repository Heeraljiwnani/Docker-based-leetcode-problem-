from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.schemas.bookmark_schema import BookmarkResponse
from app.services.bookmark_service import (
    add_bookmark, remove_bookmark, list_bookmarks
)
from app.services.problem_service import get_problem

router = APIRouter(
    prefix="/bookmarks",
    tags=["Bookmarks"]
)


@router.post("/{problem_id}", response_model=BookmarkResponse)
def bookmark_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not get_problem(db, problem_id):
        raise HTTPException(404, "Problem not found")

    return add_bookmark(db, current_user.id, problem_id)


@router.delete("/{problem_id}")
def unbookmark_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    removed = remove_bookmark(db, current_user.id, problem_id)

    if not removed:
        raise HTTPException(404, "Bookmark not found")

    return {"message": "Bookmark removed"}


@router.get("/", response_model=List[BookmarkResponse])
def my_bookmarks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return list_bookmarks(db, current_user.id)
