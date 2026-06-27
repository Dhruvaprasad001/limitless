from __future__ import annotations

import logging
from uuid import UUID

from openai import AsyncOpenAI

from app.repositories.embedding_repository import EmbeddingRepository
from app.repositories.message_repository import MessageRepository

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(
        self,
        message_repo: MessageRepository,
        embedding_repo: EmbeddingRepository,
        openai_client: AsyncOpenAI,
    ) -> None:
        self._message_repo = message_repo
        self._embedding_repo = embedding_repo
        self._openai_client = openai_client

    async def generate_and_store(self, tenant_id: UUID, message_id: UUID) -> None:
        try:
            from app.config import settings

            message = await self._message_repo.get_by_id(tenant_id, message_id)
            if message is None:
                logger.warning(
                    "Embedding skipped: message %s not found in tenant %s",
                    message_id,
                    tenant_id,
                )
                return

            response = await self._openai_client.embeddings.create(
                model=settings.EMBEDDING_MODEL,
                input=message.content,
            )
            vector = response.data[0].embedding

            await self._embedding_repo.upsert(tenant_id, message_id, vector)
        except Exception:
            logger.exception(
                "Failed to generate/store embedding for message %s (tenant %s)",
                message_id,
                tenant_id,
            )
