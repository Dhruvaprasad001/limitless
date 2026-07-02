from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EntityResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    message_id: UUID
    entity_type: str
    entity_value: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
