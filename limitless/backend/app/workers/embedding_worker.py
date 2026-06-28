from __future__ import annotations

from abc import ABC, abstractmethod
from uuid import UUID

from app.extraction.base import EntityExtractorBase
from app.services.embedding_service import EmbeddingService


class EmbeddingWorkerBase(ABC):
    @abstractmethod
    async def enqueue(self, message_id: UUID, tenant_id: UUID) -> None: ...


class InProcessEmbeddingWorker(EmbeddingWorkerBase):
    """Calls EmbeddingService directly. Replace body with Celery/SQS push in future."""

    def __init__(self, embedding_service: EmbeddingService) -> None:
        self._embedding_service = embedding_service

    async def enqueue(self, message_id: UUID, tenant_id: UUID) -> None:
        await self._embedding_service.generate_and_store(tenant_id, message_id)


class ExtractionWorkerBase(ABC):
    @abstractmethod
    async def enqueue(self, message_id: UUID, tenant_id: UUID, content: str) -> None: ...


class InProcessExtractionWorker(ExtractionWorkerBase):
    """Calls EntityExtractorBase directly. Replace body with async queue in future."""

    def __init__(self, extractor: EntityExtractorBase) -> None:
        self._extractor = extractor

    async def enqueue(self, message_id: UUID, tenant_id: UUID, content: str) -> None:
        await self._extractor.extract(tenant_id, message_id, content)

