from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies import get_db, get_current_user

from app.schemas.user_schema import (
    UserRegister,
    UserResponse,
    TokenResponse,
    AccessTokenResponse,
    RefreshTokenRequest,
    LogoutRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ResendVerificationRequest,
    VerifyEmailRequest,
)

from app.services.auth_service import (
    create_user,
    get_user_by_email,
    get_user_by_username,
    authenticate_user,
    issue_refresh_token,
    get_valid_refresh_token,
    revoke_refresh_token,
    get_user_by_id,
    create_password_reset_token,
    consume_password_reset_token,
    set_user_password,
    create_email_verification_token,
    consume_email_verification_token,
    mark_user_verified,
)

from app.core.security import create_access_token
from app.utils.email_utils import send_email
from app.utils.rate_limiter import rate_limit
from app.core.config import RATE_LIMIT_LOGIN, RATE_LIMIT_REGISTER

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    dependencies=[Depends(rate_limit(RATE_LIMIT_REGISTER, "register"))],
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = create_user(db, user.username, user.email, user.password)

    # Fire off an email-verification link (printed to console in dev mode
    # unless SMTP_* is configured in .env - see app/utils/email_utils.py).
    token = create_email_verification_token(db, new_user.id)
    send_email(
        to=new_user.email,
        subject="Verify your LeetCode Clone account",
        body=(
            f"Hi {new_user.username},\n\n"
            f"Verify your email using this token:\n{token}\n\n"
            f"POST it to /auth/verify-email as {{\"token\": \"...\"}}."
        ),
    )

    return new_user


@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[Depends(rate_limit(RATE_LIMIT_LOGIN, "login"))],
)
def login(
    # Send the user's EMAIL in the "username" form field.
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email
    })
    refresh_token = issue_refresh_token(db, user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(
    body: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    record = get_valid_refresh_token(db, body.refresh_token)

    if not record:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = get_user_by_id(db, record.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email
    })

    return {"access_token": access_token}


@router.post("/logout")
def logout(
    body: LogoutRequest,
    db: Session = Depends(get_db)
):
    revoke_refresh_token(db, body.refresh_token)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def current_user(user=Depends(get_current_user)):
    return user


@router.post("/forgot-password")
def forgot_password(
    body: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, body.email)

    # Always return the same response whether or not the email exists,
    # so this endpoint can't be used to check which emails are registered.
    if user:
        token = create_password_reset_token(db, user.id)
        send_email(
            to=user.email,
            subject="Reset your LeetCode Clone password",
            body=(
                f"Hi {user.username},\n\n"
                f"Reset your password using this token:\n{token}\n\n"
                f"POST it to /auth/reset-password as "
                f'{{"token": "...", "new_password": "..."}}. '
                f"This token expires soon."
            ),
        )

    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(
    body: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    record = consume_password_reset_token(db, body.token)

    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = get_user_by_id(db, record.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    set_user_password(db, user, body.new_password)

    return {"message": "Password has been reset. You can now log in."}


@router.post("/resend-verification")
def resend_verification(
    body: ResendVerificationRequest,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, body.email)

    if user and not user.is_verified:
        token = create_email_verification_token(db, user.id)
        send_email(
            to=user.email,
            subject="Verify your LeetCode Clone account",
            body=f"Verify your email using this token:\n{token}",
        )

    return {"message": "If that email exists and is unverified, a link has been sent."}


@router.post("/verify-email")
def verify_email(
    body: VerifyEmailRequest,
    db: Session = Depends(get_db)
):
    record = consume_email_verification_token(db, body.token)

    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = get_user_by_id(db, record.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    mark_user_verified(db, user)

    return {"message": "Email verified successfully."}
