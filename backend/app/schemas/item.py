from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional
from decimal import Decimal


class ItemCreateRequest(BaseModel):
    model_config = {"protected_namespaces": ()}

    section_id: int
    name: str
    description: Optional[str] = None
    buying_price: Optional[Decimal] = None
    purchase_date: Optional[date] = None
    purchase_year: Optional[int] = None
    brand: Optional[str] = None
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    condition: Optional[str] = "good"
    notes: Optional[str] = None


class ItemUpdateRequest(BaseModel):
    model_config = {"protected_namespaces": ()}

    name: Optional[str] = None
    description: Optional[str] = None
    buying_price: Optional[Decimal] = None
    purchase_date: Optional[date] = None
    purchase_year: Optional[int] = None
    brand: Optional[str] = None
    model_number: Optional[str] = None
    serial_number: Optional[str] = None
    condition: Optional[str] = None
    notes: Optional[str] = None
    section_id: Optional[int] = None


class ItemResponse(BaseModel):
    model_config = {"from_attributes": True, "protected_namespaces": ()}

    id: int
    section_id: int
    user_id: int
    name: str
    description: Optional[str]
    buying_price: Optional[Decimal]
    purchase_date: Optional[date]
    purchase_year: Optional[int]
    brand: Optional[str]
    model_number: Optional[str]
    serial_number: Optional[str]
    condition: Optional[str]
    photo_path: Optional[str]
    photo_thumb_path: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
