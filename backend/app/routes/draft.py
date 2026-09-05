from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user

from app.schemas.draft_schema import DraftSave, DraftResponse

from app.services.draft_service import save_draft, get_draft

router = APIRouter(
    prefix="/drafts",
    tags=["Drafts"]
)


@router.post("/save", response_model=DraftResponse)
def save(
    draft: DraftSave,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return save_draft(
        db=db,
        user_id=current_user.id,
        problem_id=draft.problem_id,
        language=draft.language,
        code=draft.code
    )


@router.get("/{problem_id}", response_model=DraftResponse)
def fetch_draft(
    problem_id: str,
    language: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    draft = get_draft(
        db=db,
        user_id=current_user.id,
        problem_id=problem_id,
        language=language
    )

    if not draft:
        raise HTTPException(404, "No draft found for this problem/language")

    return draft
