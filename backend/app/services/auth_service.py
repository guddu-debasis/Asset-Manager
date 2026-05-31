from sqlalchemy.orm import Session

from app.repositories.user_repo import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.core.exceptions import ConflictException, UnauthorizedException
from app.schemas.auth import SignupRequest, SigninRequest, TokenResponse
from app.models.user import User
from app.services.email_service import EmailService


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def signup(self, payload: SignupRequest) -> TokenResponse:
        existing = self.repo.get_by_email(payload.email)
        if existing:
            raise ConflictException("An account with this email already exists")

        hashed = hash_password(payload.password)
        user = self.repo.create(
            full_name=payload.full_name,
            email=payload.email,
            hashed_password=hashed,
        )

        # Send welcome email in background — does NOT block the response
        EmailService.send_welcome_background(
            email=user.email,
            full_name=user.full_name,
        )

        token = create_access_token({"sub": str(user.id)})
        return TokenResponse(
            access_token=token,
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
        )

    def signin(self, payload: SigninRequest) -> TokenResponse:
        user = self.repo.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException("Your account has been deactivated")

        token = create_access_token({"sub": str(user.id)})
        return TokenResponse(
            access_token=token,
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
        )
