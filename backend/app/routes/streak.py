from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.schemas.progress_schema import StreakResponse
from app.services.streak_service import get_streak

router = APIRouter(
    prefix="/streak",
    tags=["Streak"]
)


@router.get("/", response_model=StreakResponse)
def streak(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_streak(db, current_user.id)
