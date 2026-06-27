from __future__ import annotations

import logging
import re
from uuid import UUID

from app.extraction.base import EntityExtractorBase
from app.models.entity import Entity
from app.repositories.entity_repository import EntityRepository

logger = logging.getLogger(__name__)

_ORDER_PATTERN = re.compile(r"(?:order|#)\s*#?(\d+)", re.IGNORECASE)
_MACHINE_PATTERN = re.compile(
    r"\b(?:machine|line|machine line)\s+(\w[\w\s]*?)(?:\s+(?:stopped|resumed|failed|running|started|down|up)|\.|$)",
    re.IGNORECASE,
)
_PERSON_FROM_PATTERN = re.compile(r"\bfrom\s+([A-Z][a-z]+)\b")
_PERSON_TO_PATTERN = re.compile(r"\bto\s+([A-Z][a-z]+)\b")

_EXTRACTORS: list[tuple[str, re.Pattern[str], int]] = [
    ("ORDER", _ORDER_PATTERN, 1),
    ("MACHINE", _MACHINE_PATTERN, 1),
]

_PERSON_EXTRACTORS: list[re.Pattern[str]] = [_PERSON_FROM_PATTERN, _PERSON_TO_PATTERN]


class RegexEntityExtractor(EntityExtractorBase):
    def __init__(self, entity_repo: EntityRepository) -> None:
        self._entity_repo = entity_repo

    async def extract(self, tenant_id: UUID, message_id: UUID, content: str) -> list[Entity]:
        persisted: list[Entity] = []
        seen: set[tuple[str, str]] = set()

        candidates: list[tuple[str, str]] = []

        for entity_type, pattern, group in _EXTRACTORS:
            for match in pattern.finditer(content):
                value = match.group(group).strip()
                if value:
                    candidates.append((entity_type, value))

        for pattern in _PERSON_EXTRACTORS:
            for match in pattern.finditer(content):
                value = match.group(1).strip()
                if value:
                    candidates.append(("PERSON", value))

        for entity_type, entity_value in candidates:
            key = (entity_type, entity_value.lower())
            if key in seen:
                continue
            seen.add(key)
            try:
                entity = await self._entity_repo.create(
                    tenant_id=tenant_id,
                    message_id=message_id,
                    entity_type=entity_type,
                    entity_value=entity_value,
                )
                persisted.append(entity)
            except Exception:
                logger.debug(
                    "Entity extraction skipped duplicate or failed: %s=%s",
                    entity_type,
                    entity_value,
                )

        return persisted
