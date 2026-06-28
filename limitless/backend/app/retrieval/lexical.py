from __future__ import annotations

from datetime import datetime
from uuid import UUID

from app.repositories.message_repository import MessageRepository


class LexicalRetriever:
    def __init__(self, message_repo: MessageRepository) -> None:
        self._message_repo = message_repo

    async def search(
        self,
        tenant_id: UUID,
        question: str,
        candidate_ids: list[UUID] | None,
        limit: int,
        time_window: tuple[datetime, datetime] | None = None,
    ) -> list[tuple[UUID, float]]:
        return await self._message_repo.lexical_search(
            tenant_id, question, candidate_ids, limit, time_window=time_window
        )
