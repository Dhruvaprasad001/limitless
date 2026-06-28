from __future__ import annotations

import re
from uuid import UUID

from app.query_planner.base import QueryPlannerBase
from app.repositories.entity_repository import EntityRepository
from app.schemas.query_plan import QueryPlan

_ORDER_PATTERN = re.compile(r"(?:order\s+#?|#)(\d+)", re.IGNORECASE)

_TIME_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btoday\b", re.IGNORECASE), "today"),
    (re.compile(r"\byesterday\b", re.IGNORECASE), "yesterday"),
    (re.compile(r"\bthis\s+week\b", re.IGNORECASE), "this_week"),
    (re.compile(r"\blast\s+week\b", re.IGNORECASE), "last_week"),
    (re.compile(r"\bthis\s+month\b", re.IGNORECASE), "this_month"),
]


class DeterministicPlanner(QueryPlannerBase):
    def __init__(self, entity_repo: EntityRepository) -> None:
        self._entity_repo = entity_repo

    async def plan(self, question: str) -> QueryPlan:
        entity: str | None = None
        time_range: str | None = None

        # Order extraction
        order_match = _ORDER_PATTERN.search(question)
        if order_match:
            entity = order_match.group(1)

        # Person name matching via DB lookup (only if no order entity found)
        if entity is None:
            entity = await self._match_person(question)

        # Time expression extraction
        for pattern, label in _TIME_PATTERNS:
            if pattern.search(question):
                time_range = label
                break

        confident = entity is not None or time_range is not None
        return QueryPlan(
            intent=None,
            entity=entity,
            time_range=time_range,
            confident=confident,
        )

    async def _match_person(self, question: str) -> str | None:
        """
        Query known PERSON entities across all tenants is not possible without a
        tenant_id. The planner is called before a tenant is known at planning time;
        however in practice the FallbackPlanner wraps this and the entity_repo is
        scoped to a session. We need the tenant_id to query entities.

        Since QueryPlannerBase.plan() only receives `question: str` (no tenant_id),
        we cannot do a tenant-scoped lookup here. Instead, person matching is left
        to the FallbackPlanner's wrapper or the downstream hybrid retriever which
        does have tenant context.

        This method is intentionally a no-op and returns None so that
        DeterministicPlanner stays stateless and re-usable across tenants.
        The entity_repo is retained for future tenant-aware subclasses.
        """
        return None
