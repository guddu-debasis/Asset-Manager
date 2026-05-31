from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.section import SectionCreateRequest, SectionUpdateRequest, SectionResponse
from app.services.section_service import SectionService

router = APIRouter()


@router.post("", response_model=SectionResponse, status_code=201)
def create_section(
    payload: SectionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new section (e.g. Car, Kitchen, Electronics)."""
    return SectionService(db).create(current_user, payload)


@router.get("", response_model=List[SectionResponse])
def list_sections(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all sections belonging to the current user."""
    return SectionService(db).get_all(current_user)


@router.get("/{section_id}", response_model=SectionResponse)
def get_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single section by ID."""
    return SectionService(db).get_one(current_user, section_id)


@router.patch("/{section_id}", response_model=SectionResponse)
def update_section(
    section_id: int,
    payload: SectionUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a section's name, description, or icon."""
    return SectionService(db).update(current_user, section_id, payload)


@router.delete("/{section_id}")
def delete_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a section and all its items."""
    return SectionService(db).delete(current_user, section_id)
