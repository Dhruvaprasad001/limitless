from __future__ import annotations

import asyncio
from uuid import UUID

from app.repositories.entity_repository import EntityRepository
from app.retrieval.base import RetrieverBase
from app.retrieval.lexical import LexicalRetriever
from app.retrieval.ranking import RankingStrategyBase, ReciprocalRankFusion, ScoredResult
from app.retrieval.semantic import SemanticRetriever
from app.schemas.query_plan import QueryPlan
from app.utils.time_utils import resolve_time_range


class HybridRetriever(RetrieverBase):
    def __init__(
        self,
        lexical_retriever: LexicalRetriever,
        semantic_retriever: SemanticRetriever,
        entity_repo: EntityRepository,
        ranker: RankingStrategyBase | None = None,
    ) -> None:
        self._lexical = lexical_retriever
        self._semantic = semantic_retriever
        self._entity_repo = entity_repo
        self._ranker: RankingStrategyBase = ranker or ReciprocalRankFusion()

    async def retrieve(
        self,
        tenant_id: UUID,
        question: str,
        query_plan: QueryPlan,
        limit: int,
    ) -> list[ScoredResult]:
        candidate_ids: list[UUID] | None = None
        if query_plan.entity:
            entity_ids = await self._entity_repo.get_message_ids_for_entity(
                tenant_id, query_plan.entity
            )
            candidate_ids = entity_ids if entity_ids else None

        time_window = resolve_time_range(query_plan.time_range)

        lexical_results, semantic_results = await asyncio.gather(
            self._lexical.search(tenant_id, question, candidate_ids, limit, time_window),
            self._semantic.search(tenant_id, question, candidate_ids, limit, time_window),
        )

        lexical_ranking = [msg_id for msg_id, _ in lexical_results]
        semantic_ranking = [msg_id for msg_id, _ in semantic_results]

        ranked_lists: list[list[UUID]] = []
        if lexical_ranking:
            ranked_lists.append(lexical_ranking)
        if semantic_ranking:
            ranked_lists.append(semantic_ranking)

        if not ranked_lists:
            return []

        scored = self._ranker.rank(ranked_lists)
        return scored[:limit]
