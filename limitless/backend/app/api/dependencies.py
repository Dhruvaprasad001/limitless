from __future__ import annotations

from collections.abc import AsyncGenerator
from uuid import UUID

from fastapi import Depends
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db.session import get_session
from app.repositories.embedding_repository import EmbeddingRepository
from app.repositories.entity_repository import EntityRepository
from app.repositories.message_repository import MessageRepository
from app.repositories.tenant_repository import TenantRepository
from app.repositories.user_repository import UserRepository
from app.services.embedding_service import EmbeddingService
from app.services.message_service import MessageService
from app.services.tenant_service import TenantService
from app.services.user_service import UserService
from app.workers.embedding_worker import InProcessEmbeddingWorker, InProcessExtractionWorker


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_session():
        yield session


async def get_tenant_service(
    session: AsyncSession = Depends(get_db),
) -> TenantService:
    repo = TenantRepository(session)
    return TenantService(repo)


async def get_user_service(
    session: AsyncSession = Depends(get_db),
) -> UserService:
    tenant_repo = TenantRepository(session)
    user_repo = UserRepository(session)
    return UserService(tenant_repo, user_repo)


async def get_message_service(
    session: AsyncSession = Depends(get_db),
) -> MessageService:
    tenant_repo = TenantRepository(session)
    user_repo = UserRepository(session)
    message_repo = MessageRepository(session)
    return MessageService(tenant_repo, user_repo, message_repo)


async def get_embedding_service(
    session: AsyncSession = Depends(get_db),
) -> EmbeddingService:
    message_repo = MessageRepository(session)
    embedding_repo = EmbeddingRepository(session)
    openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return EmbeddingService(message_repo, embedding_repo, openai_client)


async def get_embedding_worker(
    embedding_service: EmbeddingService = Depends(get_embedding_service),
) -> InProcessEmbeddingWorker:
    return InProcessEmbeddingWorker(embedding_service)


async def get_extraction_worker(
    session: AsyncSession = Depends(get_db),
) -> InProcessExtractionWorker:
    from app.extraction.regex_extractor import RegexEntityExtractor

    entity_repo = EntityRepository(session)
    extractor = RegexEntityExtractor(entity_repo)
    return InProcessExtractionWorker(extractor)


async def verified_tenant(
    tenant_id: UUID,
    tenant_service: TenantService = Depends(get_tenant_service),
) -> UUID:
    """Call tenant_service.get_tenant; raises 404 automatically."""
    await tenant_service.get_tenant(tenant_id)
    return tenant_id


async def get_query_service(session: AsyncSession = Depends(get_db)) -> AsyncGenerator["QueryService", None]:
    from app.query_planner.deterministic_planner import DeterministicPlanner
    from app.query_planner.fallback_planner import FallbackPlanner
    from app.query_planner.openai_planner import OpenAIPlanner
    from app.retrieval.hybrid_retriever import HybridRetriever
    from app.retrieval.lexical import LexicalRetriever
    from app.retrieval.ranking import ReciprocalRankFusion
    from app.retrieval.semantic import SemanticRetriever
    from app.llm.openai_provider import OpenAIProvider
    from app.llm.prompt_builder import PromptBuilder
    from app.services.query_service import QueryService
    from app.db.session import AsyncSessionLocal

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    # lexical and semantic searches run concurrently via asyncio.gather, so
    # they each need their own session — a single async session cannot handle
    # two concurrent operations at the same time.
    async with AsyncSessionLocal() as lexical_session, AsyncSessionLocal() as semantic_session:
        message_repo = MessageRepository(lexical_session)
        embedding_repo = EmbeddingRepository(semantic_session)
        entity_repo = EntityRepository(session)
        user_repo = UserRepository(session)

        deterministic = DeterministicPlanner(entity_repo)
        llm_planner = OpenAIPlanner(client=client)
        planner = FallbackPlanner(deterministic, llm_planner)

        lexical = LexicalRetriever(message_repo)
        semantic = SemanticRetriever(embedding_repo, client)
        ranker = ReciprocalRankFusion()
        retriever = HybridRetriever(lexical, semantic, entity_repo, ranker)

        llm_provider = OpenAIProvider(client=client)
        prompt_builder = PromptBuilder()

        yield QueryService(
            query_planner=planner,
            retriever=retriever,
            message_repo=message_repo,
            user_repo=user_repo,
            llm_provider=llm_provider,
            prompt_builder=prompt_builder,
        )
