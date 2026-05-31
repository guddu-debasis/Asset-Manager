from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Date, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    buying_price = Column(Numeric(12, 2), nullable=True)
    purchase_date = Column(Date, nullable=True)
    purchase_year = Column(Integer, nullable=True)
    brand = Column(String(100), nullable=True)
    model_number = Column(String(100), nullable=True)
    serial_number = Column(String(100), nullable=True)
    condition = Column("condition", String(50), nullable=True, default="good")

    # File paths relative to STORAGE_ROOT
    photo_path = Column(String(500), nullable=True)
    photo_thumb_path = Column(String(500), nullable=True)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    section = relationship("Section", back_populates="items")
    owner = relationship("User", back_populates="items")

    def __repr__(self):
        return f"<Item id={self.id} name={self.name} section_id={self.section_id}>"
