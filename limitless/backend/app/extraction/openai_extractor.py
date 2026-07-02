from __future__ import annotations

import json
import logging
from uuid import UUID

from openai import AsyncOpenAI

from app.config import settings
from app.extraction.base import EntityExtractorBase
from app.models.entity import Entity
from app.repositories.entity_repository import EntityRepository

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """\
You are an entity extractor for a team communication platform.

Extract all named entities from the message that are important for search and retrieval.
Respond ONLY with valid JSON:

{
  "entities": [
    {"type": "<category e.g. order, machine, person, product, ticket, location>", "value": "<canonical value>"}
  ]
}

Rules:
- Extract anything specific and nameable: order IDs, machine names, people names, product names, \
ticket numbers, shipment IDs, locations, SKUs — whatever is relevant to the domain.
- For "value": use the shortest unambiguous form of the identifier.
  Examples: "order #442" → "442", "machine line 3" → "line 3", "John Smith" → "John Smith", \
"ticket JIRA-123" → "JIRA-123", "shipment SHP-0042" → "SHP-0042".
- Do not extract generic words like "team", "system", "update", "issue", "status".
- If nothing specific and nameable is present, return {"entities": []}.\
"""


class OpenAIEntityExtractor(EntityExtractorBase):
    def __init__(
        self,
        entity_repo: EntityRepository,
        client: AsyncOpenAI | None = None,
        model: str | None = None,
    ) -> None:
        self._entity_repo = entity_repo
        self._client = client or AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._model = model or settings.OPENAI_MODEL

    async def extract(self, tenant_id: UUID, message_id: UUID, content: str) -> list[Entity]:
        try:
            response = await self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": _SYSTEM_PROMPT},
                    {"role": "user", "content": content},
                ],
                response_format={"type": "json_object"},
                temperature=0.0,
            )
            raw = response.choices[0].message.content or "{}"
            data = json.loads(raw)
            candidates: list[dict] = data.get("entities", [])
        except Exception:
            logger.exception(
                "OpenAI entity extraction failed for message %s (tenant %s); skipping",
                message_id,
                tenant_id,
            )
            return []

        persisted: list[Entity] = []
        seen: set[tuple[str, str]] = set()

        for item in candidates:
            entity_type = str(item.get("type", "")).strip()
            entity_value = str(item.get("value", "")).strip()

            if not entity_type or not entity_value:
                continue

            key = (entity_type.lower(), entity_value.lower())
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
                    "Entity skipped (duplicate or error): %s=%s",
                    entity_type,
                    entity_value,
                )

        return persisted
