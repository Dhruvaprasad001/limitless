from __future__ import annotations

from datetime import datetime
from uuid import UUID

from openai import AsyncOpenAI

from app.config import settings
from app.repositories.embedding_repository import EmbeddingRepository


class SemanticRetriever:
    def __init__(self, embedding_repo: EmbeddingRepository, client: AsyncOpenAI) -> None:
        self._embedding_repo = embedding_repo
        self._client = client

    async def search(
        self,
        tenant_id: UUID,
        question: str,
        candidate_ids: list[UUID] | None,
        limit: int,
        time_window: tuple[datetime, datetime] | None = None,
    ) -> list[tuple[UUID, float]]:
        response = await self._client.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=question,
        )
        embedding = response.data[0].embedding
        return await self._embedding_repo.semantic_search(
            tenant_id, embedding, candidate_ids, limit, time_window=time_window
        )
