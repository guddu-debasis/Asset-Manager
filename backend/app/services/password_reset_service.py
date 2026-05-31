from sqlalchemy.orm import Session

from app.repositories.user_repo import UserRepository
from app.repositories.password_reset_repo import PasswordResetRepository
from app.services.email_service import send_password_reset_email
from app.core.security import hash_password
from app.core.exceptions import BadRequestException


class PasswordResetService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.reset_repo = PasswordResetRepository(db)

    async def request_reset(self, email: str) -> dict:
        user = self.user_repo.get_by_email(email)

        # Always return success even if email not found (security best practice)
        # This prevents attackers from knowing which emails are registered
        if not user or not user.is_active:
            return {"message": "If that email exists, a reset link has been sent"}

        reset_token = self.reset_repo.create_token(user.id)

        await send_password_reset_email(
            email=user.email,
            full_name=user.full_name,
            token=reset_token.token,
        )

        return {"message": "If that email exists, a reset link has been sent"}

    def confirm_reset(self, token: str, new_password: str) -> dict:
        reset_token = self.reset_repo.get_valid_token(token)

        if not reset_token:
            raise BadRequestException("Reset link is invalid or has expired")

        if len(new_password) < 8:
            raise BadRequestException("Password must be at least 8 characters")

        if len(new_password.encode("utf-8")) > 72:
            raise BadRequestException("Password must be 72 characters or fewer")

        # Update user password
        user = reset_token.user
        self.user_repo.update(user, hashed_password=hash_password(new_password))

        # Mark token as used
        self.reset_repo.mark_used(reset_token)

        return {"message": "Password reset successfully. You can now sign in."}
