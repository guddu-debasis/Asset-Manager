from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdateRequest, ChangePasswordRequest
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return UserService(None).get_profile(current_user)


@router.patch("/me", response_model=UserResponse)
def update_my_profile(
    payload: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the current user's name or email."""
    return UserService(db).update_profile(current_user, payload)


@router.post("/me/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the current user's password."""
    return UserService(db).change_password(current_user, payload)
