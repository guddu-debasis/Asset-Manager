from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.upload_service import UploadService

router = APIRouter()


@router.post("/items/{item_id}/photo")
def upload_item_photo(
    item_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload or replace a photo for an item. Returns public URLs."""
    return UploadService(db).upload_item_photo(current_user, item_id, file)


@router.delete("/items/{item_id}/photo")
def delete_item_photo(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove the photo from an item."""
    return UploadService(db).delete_item_photo(current_user, item_id)
