from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.models.streak import Streak


def get_streak(db: Session, user_id):

    streak = db.query(Streak).filter(
        Streak.user_id == user_id
    ).first()

    if streak:
        return streak

    streak = Streak(user_id=user_id)

    db.add(streak)
    db.commit()
    db.refresh(streak)

    return streak


def update_streak(db: Session, user_id):

    streak = get_streak(db, user_id)

    today = date.today()

    if streak.last_solved_date == today:
        return streak

    yesterday = today - timedelta(days=1)

    if streak.last_solved_date == yesterday:
        streak.current_streak += 1

    else:
        streak.current_streak = 1

    streak.last_solved_date = today

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    db.commit()
    db.refresh(streak)

    return streak