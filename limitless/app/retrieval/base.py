from __future__ import annotations

from abc import ABC, abstractmethod
from uuid import UUID

from app.retrieval.ranking import ScoredResult
from app.schemas.query_plan import QueryPlan


class RetrieverBase(ABC):
    @abstractmethod
    async def retrieve(
        self,
        tenant_id: UUID,
        question: str,
        query_plan: QueryPlan,
        limit: int,
    ) -> list[ScoredResult]:
        """Return ordered list of ScoredResults most relevant to question."""
        ...
