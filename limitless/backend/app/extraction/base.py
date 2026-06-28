from __future__ import annotations

from abc import ABC, abstractmethod
from uuid import UUID

from app.models.entity import Entity


class EntityExtractorBase(ABC):
    @abstractmethod
    async def extract(self, tenant_id: UUID, message_id: UUID, content: str) -> list[Entity]:
        """Extract entities from content and persist them. Returns persisted Entity rows."""
        ...
