from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.schemas.progress_schema import ProgressResponse
from app.services.progress_service import get_progress

router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)


@router.get("/", response_model=ProgressResponse)
def progress(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_progress(db, current_user.id)
