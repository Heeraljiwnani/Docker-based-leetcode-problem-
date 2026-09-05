from sqlalchemy.orm import Session
from app.models.draft import Draft


def save_draft(db: Session, user_id, problem_id, language, code):

    draft = db.query(Draft).filter(
        Draft.user_id == user_id,
        Draft.problem_id == problem_id,
        Draft.language == language
    ).first()

    if draft:
        draft.code = code

    else:
        draft = Draft(
            user_id=user_id,
            problem_id=problem_id,
            language=language,
            code=code
        )
        db.add(draft)

    db.commit()
    db.refresh(draft)

    return draft


def get_draft(db: Session, user_id, problem_id, language):

    return db.query(Draft).filter(
        Draft.user_id == user_id,
        Draft.problem_id == problem_id,
        Draft.language == language
    ).first()