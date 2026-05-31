from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import secrets

from app.models.password_reset import PasswordResetToken
from app.core.config import settings


class PasswordResetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_token(self, user_id: int) -> PasswordResetToken:
        # Invalidate any existing unused tokens for this user
        self.db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user_id,
            PasswordResetToken.is_used == False,
        ).update({"is_used": True})
        self.db.commit()

        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)

        reset_token = PasswordResetToken(
            user_id=user_id,
            token=token,
            expires_at=expires_at,
        )
        self.db.add(reset_token)
        self.db.commit()
        self.db.refresh(reset_token)
        return reset_token

    def get_valid_token(self, token: str) -> Optional[PasswordResetToken]:
        return (
            self.db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.token == token,
                PasswordResetToken.is_used == False,
                PasswordResetToken.expires_at > datetime.utcnow(),
            )
            .first()
        )

    def mark_used(self, reset_token: PasswordResetToken) -> None:
        reset_token.is_used = True
        self.db.commit()
