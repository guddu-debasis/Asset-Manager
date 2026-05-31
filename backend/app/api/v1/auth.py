from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import SignupRequest, SigninRequest, TokenResponse
from app.schemas.password_reset import ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import AuthService
from app.services.password_reset_service import PasswordResetService

router = APIRouter()


@router.post("/signup", response_model=TokenResponse, status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user account and return a JWT token."""
    return AuthService(db).signup(payload)


@router.post("/signin", response_model=TokenResponse)
def signin(payload: SigninRequest, db: Session = Depends(get_db)):
    """Sign in with email and password, returns a JWT token."""
    return AuthService(db).signin(payload)


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Send a password reset email if the account exists."""
    return await PasswordResetService(db).request_reset(payload.email)


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using the token from the email link."""
    return PasswordResetService(db).confirm_reset(payload.token, payload.new_password)
