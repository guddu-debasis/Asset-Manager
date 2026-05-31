from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.item import Item


class ItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, item_id: int) -> Optional[Item]:
        return self.db.query(Item).filter(Item.id == item_id).first()

    def get_by_id_and_user(self, item_id: int, user_id: int) -> Optional[Item]:
        return (
            self.db.query(Item)
            .filter(Item.id == item_id, Item.user_id == user_id)
            .first()
        )

    def get_by_section(self, section_id: int, user_id: int) -> List[Item]:
        return (
            self.db.query(Item)
            .filter(Item.section_id == section_id, Item.user_id == user_id)
            .order_by(Item.created_at.desc())
            .all()
        )

    def get_by_user(self, user_id: int) -> List[Item]:
        return (
            self.db.query(Item)
            .filter(Item.user_id == user_id)
            .order_by(Item.created_at.desc())
            .all()
        )

    def count_by_section(self, section_id: int) -> int:
        return self.db.query(Item).filter(Item.section_id == section_id).count()

    def create(self, user_id: int, section_id: int, **kwargs) -> Item:
        item = Item(user_id=user_id, section_id=section_id, **kwargs)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item: Item, **kwargs) -> Item:
        for key, value in kwargs.items():
            setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item: Item) -> None:
        self.db.delete(item)
        self.db.commit()
