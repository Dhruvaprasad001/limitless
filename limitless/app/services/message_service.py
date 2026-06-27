from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import HTTPException

from app.models.message import Message
from app.repositories.message_repository import MessageRepository
from app.repositories.tenant_repository import TenantRepository
from app.repositories.user_repository import UserRepository


class MessageService:
    def __init__(
        self,
        tenant_repo: TenantRepository,
        user_repo: UserRepository,
        message_repo: MessageRepository,
    ) -> None:
        self._tenant_repo = tenant_repo
        self._user_repo = user_repo
        self._message_repo = message_repo

    async def create_message(
        self,
        tenant_id: UUID,
        user_id: UUID,
        content: str,
        event_time: datetime | None = None,
    ) -> Message:
        tenant = await self._tenant_repo.get_by_id(tenant_id)
        if tenant is None:
            raise HTTPException(status_code=404, detail=f"Tenant {tenant_id} not found")

        user = await self._user_repo.get_by_id(tenant_id, user_id)
        if user is None:
            raise HTTPException(
                status_code=404, detail=f"User {user_id} not found in tenant {tenant_id}"
            )

        return await self._message_repo.create(tenant_id, user_id, content, event_time=event_time)

    async def get_message(self, tenant_id: UUID, message_id: UUID) -> Message:
        message = await self._message_repo.get_by_id(tenant_id, message_id)
        if message is None:
            raise HTTPException(
                status_code=404,
                detail=f"Message {message_id} not found in tenant {tenant_id}",
            )
        return message
