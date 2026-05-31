from sqlalchemy.orm import Session

from app.repositories.user_repo import UserRepository
from app.core.security import verify_password, hash_password
from app.core.exceptions import NotFoundException, ConflictException, UnauthorizedException
from app.schemas.user import UserUpdateRequest, ChangePasswordRequest, UserResponse
from app.models.user import User


class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def get_profile(self, user: User) -> UserResponse:
        return UserResponse.model_validate(user)

    def update_profile(self, user: User, payload: UserUpdateRequest) -> UserResponse:
        if payload.email and payload.email != user.email:
            existing = self.repo.get_by_email(payload.email)
            if existing:
                raise ConflictException("Email already in use by another account")

        updated = self.repo.update(
            user,
            full_name=payload.full_name,
            email=payload.email,
        )
        return UserResponse.model_validate(updated)

    def change_password(self, user: User, payload: ChangePasswordRequest) -> dict:
        if not verify_password(payload.current_password, user.hashed_password):
            raise UnauthorizedException("Current password is incorrect")

        new_hashed = hash_password(payload.new_password)
        self.repo.update(user, hashed_password=new_hashed)
        return {"message": "Password updated successfully"}
