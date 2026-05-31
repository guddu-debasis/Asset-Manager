from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SectionCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "box"


class SectionUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None


class SectionResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    icon: Optional[str]
    item_count: Optional[int] = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
