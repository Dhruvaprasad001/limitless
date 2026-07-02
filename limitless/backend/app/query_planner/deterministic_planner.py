from __future__ import annotations

import re

from app.query_planner.base import QueryPlannerBase
from app.schemas.query_plan import QueryPlan

_TIME_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btoday\b", re.IGNORECASE), "today"),
    (re.compile(r"\byesterday\b", re.IGNORECASE), "yesterday"),
    (re.compile(r"\bthis\s+week\b", re.IGNORECASE), "this_week"),
    (re.compile(r"\blast\s+week\b", re.IGNORECASE), "last_week"),
    (re.compile(r"\bthis\s+month\b", re.IGNORECASE), "this_month"),
]


class DeterministicPlanner(QueryPlannerBase):
    """Fast pre-check: extract explicit time expressions without an LLM call.

    Only handles time ranges. Entity extraction is delegated entirely to
    OpenAIPlanner, which produces canonical values consistent with
    OpenAIEntityExtractor at ingest time.
    """

    async def plan(self, question: str) -> QueryPlan:
        time_range: str | None = None

        for pattern, label in _TIME_PATTERNS:
            if pattern.search(question):
                time_range = label
                break

        return QueryPlan(
            intent=None,
            entity=None,
            time_range=time_range,
            confident=time_range is not None,
        )
