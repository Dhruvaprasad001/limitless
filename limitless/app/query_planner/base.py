from __future__ import annotations

from abc import ABC, abstractmethod

from app.schemas.query_plan import QueryPlan


class QueryPlannerBase(ABC):
    @abstractmethod
    async def plan(self, question: str) -> QueryPlan: ...
