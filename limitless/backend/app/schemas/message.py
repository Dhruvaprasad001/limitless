from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MessageCreate(BaseModel):
    content: str
    event_time: datetime | None = None


class MessageResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    user_id: UUID
    content: str
    event_time: datetime
    ingested_at: datetime

    model_config = ConfigDict(from_attributes=True)
