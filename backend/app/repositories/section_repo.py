from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.section import Section


class SectionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, section_id: int) -> Optional[Section]:
        return self.db.query(Section).filter(Section.id == section_id).first()

    def get_by_user(self, user_id: int) -> List[Section]:
        return (
            self.db.query(Section)
            .filter(Section.user_id == user_id)
            .order_by(Section.created_at.desc())
            .all()
        )

    def get_by_id_and_user(self, section_id: int, user_id: int) -> Optional[Section]:
        return (
            self.db.query(Section)
            .filter(Section.id == section_id, Section.user_id == user_id)
            .first()
        )

    def create(self, user_id: int, name: str, description: Optional[str], icon: Optional[str]) -> Section:
        section = Section(
            user_id=user_id,
            name=name,
            description=description,
            icon=icon or "box",
        )
        self.db.add(section)
        self.db.commit()
        self.db.refresh(section)
        return section

    def update(self, section: Section, **kwargs) -> Section:
        for key, value in kwargs.items():
            if value is not None:
                setattr(section, key, value)
        self.db.commit()
        self.db.refresh(section)
        return section

    def delete(self, section: Section) -> None:
        self.db.delete(section)
        self.db.commit()
