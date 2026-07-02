from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel


class FirebaseClaims(BaseModel):
    uid: str
    email: str | None = None
    name: str | None = None
    picture: str | None = None


class CurrentUser(BaseModel):
    id: UUID
    tenant_id: UUID
    firebase_uid: str
    email: str | None = None
    display_name: str | None = None
