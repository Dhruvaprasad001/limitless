from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    tenant_id: UUID
    name: str


class UserResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
