from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.password_reset import PasswordResetToken
from app.models.email_verification import EmailVerificationToken

from app.core.security import (
    hash_password,
    verify_password,
    generate_opaque_token,
    refresh_token_expiry,
)
from app.core.config import (
    RESET_TOKEN_EXPIRE_MINUTES,
    VERIFY_TOKEN_EXPIRE_HOURS,
)


# ---------------------------------------------------------------- users --

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, username: str, email: str, password: str):
    hashed = hash_password(password)

    user = User(
        username=username,
        email=email,
        password_hash=hashed
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


# ------------------------------------------------------- refresh tokens --

def issue_refresh_token(db: Session, user_id) -> str:
    token = generate_opaque_token()

    db.add(RefreshToken(
        user_id=user_id,
        token=token,
        expires_at=refresh_token_expiry()
    ))
    db.commit()

    return token


def get_valid_refresh_token(db: Session, token: str):
    record = db.query(RefreshToken).filter(
        RefreshToken.token == token,
        RefreshToken.revoked.is_(False)
    ).first()

    if not record:
        return None

    if record.expires_at < datetime.utcnow():
        return None

    return record


def revoke_refresh_token(db: Session, token: str):
    record = db.query(RefreshToken).filter(
        RefreshToken.token == token
    ).first()

    if record:
        record.revoked = True
        db.commit()


# ---------------------------------------------------- password reset ----

def create_password_reset_token(db: Session, user_id) -> str:
    token = generate_opaque_token()

    db.add(PasswordResetToken(
        user_id=user_id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    ))
    db.commit()

    return token


def consume_password_reset_token(db: Session, token: str):
    record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token,
        PasswordResetToken.used.is_(False)
    ).first()

    if not record or record.expires_at < datetime.utcnow():
        return None

    record.used = True
    db.commit()

    return record


def set_user_password(db: Session, user: User, new_password: str):
    user.password_hash = hash_password(new_password)
    db.commit()


# ------------------------------------------------- email verification ---

def create_email_verification_token(db: Session, user_id) -> str:
    token = generate_opaque_token()

    db.add(EmailVerificationToken(
        user_id=user_id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=VERIFY_TOKEN_EXPIRE_HOURS)
    ))
    db.commit()

    return token


def consume_email_verification_token(db: Session, token: str):
    record = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token == token,
        EmailVerificationToken.used.is_(False)
    ).first()

    if not record or record.expires_at < datetime.utcnow():
        return None

    record.used = True
    db.commit()

    return record


def mark_user_verified(db: Session, user: User):
    user.is_verified = True
    db.commit()
