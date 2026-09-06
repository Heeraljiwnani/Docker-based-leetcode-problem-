from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.user import User
from app.models.progress import Progress
from app.models.streak import Streak


def get_global_leaderboard(db: Session, page: int = 1, limit: int = 20):
    query = (
        db.query(User, Progress, Streak)
        .join(Progress, Progress.user_id == User.id)
        .outerjoin(Streak, Streak.user_id == User.id)
        .order_by(desc(Progress.total_solved))
    )

    total = query.count()

    rows = query.offset((page - 1) * limit).limit(limit).all()

    entries = []
    start_rank = (page - 1) * limit + 1

    for i, (user, progress, streak) in enumerate(rows):
        entries.append({
            "rank": start_rank + i,
            "username": user.username,
            "total_solved": progress.total_solved,
            "solved_easy": progress.solved_easy,
            "solved_medium": progress.solved_medium,
            "solved_hard": progress.solved_hard,
            "current_streak": streak.current_streak if streak else 0,
            "longest_streak": streak.longest_streak if streak else 0,
        })

    return total, entries
