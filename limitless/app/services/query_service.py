from __future__ import annotations

import logging
import time
from dataclasses import asdict, dataclass
from uuid import UUID

from app.config import settings
from app.llm.base import LLMProviderBase
from app.llm.prompt_builder import PromptBuilder
from app.query_planner.base import QueryPlannerBase
from app.repositories.message_repository import MessageRepository
from app.repositories.user_repository import UserRepository
from app.retrieval.base import RetrieverBase
from app.retrieval.ranking import ScoredResult
from app.schemas.query import QueryResponse, RetrievedMessage

logger = logging.getLogger(__name__)


@dataclass
class QueryLog:
    tenant_id: UUID
    question: str
    query_plan: dict
    retrieved_message_ids: list[str]
    n_retrieved: int
    model: str
    latency_ms: float
    avg_retrieval_score: float


class QueryService:
    def __init__(
        self,
        query_planner: QueryPlannerBase,
        retriever: RetrieverBase,
        message_repo: MessageRepository,
        user_repo: UserRepository,
        llm_provider: LLMProviderBase,
        prompt_builder: PromptBuilder,
    ) -> None:
        self._query_planner = query_planner
        self._retriever = retriever
        self._message_repo = message_repo
        self._user_repo = user_repo
        self._llm_provider = llm_provider
        self._prompt_builder = prompt_builder

    async def answer(self, tenant_id: UUID, question: str) -> QueryResponse:
        start = time.monotonic()

        # 1. Parse intent
        query_plan = await self._query_planner.plan(question)

        # 2. Retrieve relevant scored results (hybrid: entity-boosted if entity present)
        scored_results: list[ScoredResult] = await self._retriever.retrieve(
            tenant_id=tenant_id,
            question=question,
            query_plan=query_plan,
            limit=settings.RETRIEVAL_TOP_K,
        )

        # 3. Apply retrieval confidence gate
        avg_score = (
            sum(r.score for r in scored_results) / len(scored_results) if scored_results else 0.0
        )

        if avg_score < settings.RETRIEVAL_CONFIDENCE_THRESHOLD or not scored_results:
            return QueryResponse(
                answer="I don't have enough information in the retrieved messages to answer this question.",
                supporting_message_ids=[],
                supporting_timestamps=[],
                query_plan=query_plan.model_dump(),
            )

        message_ids = [r.message_id for r in scored_results]

        # 4. Fetch full message rows (tenant-scoped)
        messages = await self._message_repo.get_many_by_ids(tenant_id, message_ids)

        # 5. Resolve user names: build {user_id: user_name} for all unique user_ids in messages
        unique_user_ids = {msg.user_id for msg in messages}
        user_names: dict[UUID, str] = {}
        for user_id in unique_user_ids:
            user = await self._user_repo.get_by_id(tenant_id, user_id)
            if user is not None:
                user_names[user_id] = user.name

        # 6. Build RetrievedMessage list ordered by event_time ascending
        retrieved: list[RetrievedMessage] = [
            RetrievedMessage(
                id=msg.id,
                user_name=user_names.get(msg.user_id, "Unknown"),
                content=msg.content,
                created_at=msg.event_time,
            )
            for msg in sorted(messages, key=lambda m: m.event_time)
        ]

        # 7. If no messages retrieved after fetch, return a clear "no information" response
        if not retrieved:
            return QueryResponse(
                answer="I don't have enough information in the retrieved messages to answer this question.",
                supporting_message_ids=[],
                supporting_timestamps=[],
                query_plan=query_plan.model_dump(),
            )

        # 8. Build prompt and call LLM
        prompt_messages = self._prompt_builder.build(question, retrieved)
        answer = await self._llm_provider.complete(prompt_messages)

        # 9. Compute latency
        latency_ms = (time.monotonic() - start) * 1000

        # 10. Emit structured log
        log_entry = QueryLog(
            tenant_id=tenant_id,
            question=question,
            query_plan=query_plan.model_dump(),
            retrieved_message_ids=[str(m.id) for m in retrieved],
            n_retrieved=len(retrieved),
            model=settings.OPENAI_MODEL,
            latency_ms=round(latency_ms, 2),
            avg_retrieval_score=round(avg_score, 6),
        )
        logger.info("query_completed", extra={"query_log": asdict(log_entry)})

        # 11. Return response
        return QueryResponse(
            answer=answer,
            supporting_message_ids=[m.id for m in retrieved],
            supporting_timestamps=[m.created_at for m in retrieved],
            query_plan=query_plan.model_dump(),
        )
