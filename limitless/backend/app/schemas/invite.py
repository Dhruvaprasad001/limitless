from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class InviteResponse(BaseModel):
    token: str
    tenant_id: UUID
    created_at: datetime


class InvitePreview(BaseModel):
    """Public info shown on the /join page before the user accepts."""
    token: str
    tenant_name: str
