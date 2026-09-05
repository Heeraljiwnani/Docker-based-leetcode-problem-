from sqlalchemy.orm import Session

from app.models.bookmark import Bookmark


def add_bookmark(db: Session, user_id, problem_id):
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == user_id,
        Bookmark.problem_id == problem_id
    ).first()

    if existing:
        return existing

    bookmark = Bookmark(user_id=user_id, problem_id=problem_id)
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return bookmark


def remove_bookmark(db: Session, user_id, problem_id) -> bool:
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == user_id,
        Bookmark.problem_id == problem_id
    ).first()

    if not bookmark:
        return False

    db.delete(bookmark)
    db.commit()
    return True


def list_bookmarks(db: Session, user_id):
    return db.query(Bookmark).filter(
        Bookmark.user_id == user_id
    ).order_by(Bookmark.created_at.desc()).all()
