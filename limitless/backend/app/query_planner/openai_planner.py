from __future__ import annotations

import json
import logging

from openai import AsyncOpenAI

from app.config import settings
from app.query_planner.base import QueryPlannerBase
from app.schemas.query_plan import QueryPlan

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """\
You are an intent parser for a team updates search system.
Given a natural language question, extract the following and respond ONLY with valid JSON:

{
  "intent": "<one of: pending_status, status_update, person_activity, order_status, general_query>",
  "entity": "<the primary named entity being asked about — a person name, order number, machine name, etc. — or null if none>",
  "time_range": "<one of: today, this_week, last_week, this_month, or null if not specified>"
}

Be conservative with time_range — only set it if the question explicitly mentions a time period.\
"""

_SAFE_DEFAULT = QueryPlan(intent="general_query", entity=None, time_range=None, confident=True)


class OpenAIPlanner(QueryPlannerBase):
    def __init__(self, client: AsyncOpenAI | None = None, model: str | None = None) -> None:
        self._client = client or AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._model = model or settings.OPENAI_MODEL

    async def plan(self, question: str) -> QueryPlan:
        try:
            response = await self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": _SYSTEM_PROMPT},
                    {"role": "user", "content": question},
                ],
                response_format={"type": "json_object"},
                temperature=0.0,
            )
            raw = response.choices[0].message.content or "{}"
            data = json.loads(raw)
            return QueryPlan(
                intent=data.get("intent", "general_query"),
                entity=data.get("entity") or None,
                time_range=data.get("time_range") or None,
                confident=True,
            )
        except Exception:
            logger.warning("QueryPlanner failed to parse intent; using safe default", exc_info=True)
            return _SAFE_DEFAULT
