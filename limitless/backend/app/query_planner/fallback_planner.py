from __future__ import annotations

from app.query_planner.base import QueryPlannerBase
from app.query_planner.deterministic_planner import DeterministicPlanner
from app.query_planner.openai_planner import OpenAIPlanner
from app.schemas.query_plan import QueryPlan


class FallbackPlanner(QueryPlannerBase):
    """Try DeterministicPlanner first; fall through to OpenAIPlanner only when not confident."""

    def __init__(self, deterministic: DeterministicPlanner, llm: OpenAIPlanner) -> None:
        self._deterministic = deterministic
        self._llm = llm

    async def plan(self, question: str) -> QueryPlan:
        result = await self._deterministic.plan(question)
        if result.confident:
            return result
        return await self._llm.plan(question)
