import os
import uuid
from pathlib import Path
from typing import Optional, Tuple

from PIL import Image
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import NotFoundException, BadRequestException
from app.repositories.item_repo import ItemRepository
from app.models.user import User

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE_MB = 10
THUMB_SIZE = (300, 300)
FULL_SIZE = (1200, 1200)


class UploadService:
    def __init__(self, db: Session):
        self.repo = ItemRepository(db)

    def _get_user_item_dir(self, user_id: int, item_id: int) -> Path:
        path = Path(settings.STORAGE_ROOT) / "users" / str(user_id) / "items" / str(item_id)
        path.mkdir(parents=True, exist_ok=True)
        return path

    def _validate_file(self, file: UploadFile) -> str:
        ext = Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise BadRequestException(f"File type not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}")
        return ext

    def _save_images(self, file: UploadFile, save_dir: Path) -> Tuple[str, str]:
        ext = self._validate_file(file)
        unique_name = uuid.uuid4().hex

        full_filename = f"photo_{unique_name}{ext}"
        thumb_filename = f"thumb_{unique_name}{ext}"

        full_path = save_dir / full_filename
        thumb_path = save_dir / thumb_filename

        # Read and process with Pillow
        image = Image.open(file.file)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        # Save full-size (max 1200x1200)
        image.thumbnail(FULL_SIZE, Image.LANCZOS)
        image.save(str(full_path), quality=85, optimize=True)

        # Save thumbnail
        thumb = image.copy()
        thumb.thumbnail(THUMB_SIZE, Image.LANCZOS)
        thumb.save(str(thumb_path), quality=75, optimize=True)

        return full_filename, thumb_filename

    def upload_item_photo(self, user: User, item_id: int, file: UploadFile) -> dict:
        item = self.repo.get_by_id_and_user(item_id, user.id)
        if not item:
            raise NotFoundException("Item not found")

        save_dir = self._get_user_item_dir(user.id, item_id)

        # Remove old photos if they exist
        if item.photo_path:
            old_full = save_dir / Path(item.photo_path).name
            if old_full.exists():
                old_full.unlink()
        if item.photo_thumb_path:
            old_thumb = save_dir / Path(item.photo_thumb_path).name
            if old_thumb.exists():
                old_thumb.unlink()

        full_filename, thumb_filename = self._save_images(file, save_dir)

        # Store relative web paths
        relative_full = f"users/{user.id}/items/{item_id}/{full_filename}"
        relative_thumb = f"users/{user.id}/items/{item_id}/{thumb_filename}"

        self.repo.update(item, photo_path=relative_full, photo_thumb_path=relative_thumb)

        return {
            "photo_url": f"/storage/{relative_full}",
            "thumb_url": f"/storage/{relative_thumb}",
        }

    def delete_item_photo(self, user: User, item_id: int) -> dict:
        item = self.repo.get_by_id_and_user(item_id, user.id)
        if not item:
            raise NotFoundException("Item not found")

        save_dir = self._get_user_item_dir(user.id, item_id)
        if item.photo_path:
            p = save_dir / Path(item.photo_path).name
            if p.exists():
                p.unlink()
        if item.photo_thumb_path:
            t = save_dir / Path(item.photo_thumb_path).name
            if t.exists():
                t.unlink()

        self.repo.update(item, photo_path=None, photo_thumb_path=None)
        return {"message": "Photo deleted successfully"}
