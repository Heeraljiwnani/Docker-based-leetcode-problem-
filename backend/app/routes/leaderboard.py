from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.leaderboard_schema import GlobalLeaderboardEntry
from app.services.leaderboard_service import get_global_leaderboard

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"]
)


@router.get("/", response_model=List[GlobalLeaderboardEntry])
def global_leaderboard(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    _, entries = get_global_leaderboard(db, page=page, limit=limit)
    return [GlobalLeaderboardEntry(**e) for e in entries]
