from sqlalchemy.orm import Session
from typing import List

from app.repositories.section_repo import SectionRepository
from app.repositories.item_repo import ItemRepository
from app.core.exceptions import NotFoundException, UnauthorizedException
from app.schemas.section import SectionCreateRequest, SectionUpdateRequest, SectionResponse
from app.models.user import User


class SectionService:
    def __init__(self, db: Session):
        self.repo = SectionRepository(db)
        self.item_repo = ItemRepository(db)

    def create(self, user: User, payload: SectionCreateRequest) -> SectionResponse:
        section = self.repo.create(
            user_id=user.id,
            name=payload.name,
            description=payload.description,
            icon=payload.icon,
        )
        response = SectionResponse.model_validate(section)
        response.item_count = 0
        return response

    def get_all(self, user: User) -> List[SectionResponse]:
        sections = self.repo.get_by_user(user.id)
        result = []
        for s in sections:
            resp = SectionResponse.model_validate(s)
            resp.item_count = self.item_repo.count_by_section(s.id)
            result.append(resp)
        return result

    def get_one(self, user: User, section_id: int) -> SectionResponse:
        section = self.repo.get_by_id_and_user(section_id, user.id)
        if not section:
            raise NotFoundException("Section not found")
        resp = SectionResponse.model_validate(section)
        resp.item_count = self.item_repo.count_by_section(section.id)
        return resp

    def update(self, user: User, section_id: int, payload: SectionUpdateRequest) -> SectionResponse:
        section = self.repo.get_by_id_and_user(section_id, user.id)
        if not section:
            raise NotFoundException("Section not found")

        updated = self.repo.update(
            section,
            name=payload.name,
            description=payload.description,
            icon=payload.icon,
        )
        resp = SectionResponse.model_validate(updated)
        resp.item_count = self.item_repo.count_by_section(updated.id)
        return resp

    def delete(self, user: User, section_id: int) -> dict:
        section = self.repo.get_by_id_and_user(section_id, user.id)
        if not section:
            raise NotFoundException("Section not found")
        self.repo.delete(section)
        return {"message": "Section deleted successfully"}
