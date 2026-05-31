from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.item import ItemCreateRequest, ItemUpdateRequest, ItemResponse
from app.services.item_service import ItemService

router = APIRouter()


@router.post("", response_model=ItemResponse, status_code=201)
def create_item(
    payload: ItemCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a new item to a section."""
    return ItemService(db).create(current_user, payload)


@router.get("", response_model=List[ItemResponse])
def list_items(
    section_id: Optional[int] = Query(None, description="Filter by section"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List items — optionally filtered by section."""
    svc = ItemService(db)
    if section_id:
        return svc.get_by_section(current_user, section_id)
    return svc.get_all(current_user)


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single item by ID."""
    return ItemService(db).get_one(current_user, item_id)


@router.patch("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    payload: ItemUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an item's details."""
    return ItemService(db).update(current_user, item_id, payload)


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an item."""
    return ItemService(db).delete(current_user, item_id)
