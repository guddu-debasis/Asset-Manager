from sqlalchemy.orm import Session
from typing import List

from app.repositories.item_repo import ItemRepository
from app.repositories.section_repo import SectionRepository
from app.core.exceptions import NotFoundException
from app.schemas.item import ItemCreateRequest, ItemUpdateRequest, ItemResponse
from app.models.user import User


class ItemService:
    def __init__(self, db: Session):
        self.repo = ItemRepository(db)
        self.section_repo = SectionRepository(db)

    def create(self, user: User, payload: ItemCreateRequest) -> ItemResponse:
        # Verify section belongs to user
        section = self.section_repo.get_by_id_and_user(payload.section_id, user.id)
        if not section:
            raise NotFoundException("Section not found")

        item = self.repo.create(
            user_id=user.id,
            section_id=payload.section_id,
            name=payload.name,
            description=payload.description,
            buying_price=payload.buying_price,
            purchase_date=payload.purchase_date,
            purchase_year=payload.purchase_year,
            brand=payload.brand,
            model_number=payload.model_number,
            serial_number=payload.serial_number,
            condition=payload.condition,
            notes=payload.notes,
        )
        return ItemResponse.model_validate(item)

    def get_by_section(self, user: User, section_id: int) -> List[ItemResponse]:
        section = self.section_repo.get_by_id_and_user(section_id, user.id)
        if not section:
            raise NotFoundException("Section not found")
        items = self.repo.get_by_section(section_id, user.id)
        return [ItemResponse.model_validate(i) for i in items]

    def get_all(self, user: User) -> List[ItemResponse]:
        items = self.repo.get_by_user(user.id)
        return [ItemResponse.model_validate(i) for i in items]

    def get_one(self, user: User, item_id: int) -> ItemResponse:
        item = self.repo.get_by_id_and_user(item_id, user.id)
        if not item:
            raise NotFoundException("Item not found")
        return ItemResponse.model_validate(item)

    def update(self, user: User, item_id: int, payload: ItemUpdateRequest) -> ItemResponse:
        item = self.repo.get_by_id_and_user(item_id, user.id)
        if not item:
            raise NotFoundException("Item not found")

        if payload.section_id:
            section = self.section_repo.get_by_id_and_user(payload.section_id, user.id)
            if not section:
                raise NotFoundException("Target section not found")

        update_data = payload.model_dump(exclude_unset=True)
        updated = self.repo.update(item, **update_data)
        return ItemResponse.model_validate(updated)

    def delete(self, user: User, item_id: int) -> dict:
        item = self.repo.get_by_id_and_user(item_id, user.id)
        if not item:
            raise NotFoundException("Item not found")
        self.repo.delete(item)
        return {"message": "Item deleted successfully"}
