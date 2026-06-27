from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.models.message import Message
from app.models.message_embedding import MessageEmbedding
from app.repositories.base import BaseRepository


class EmbeddingRepository(BaseRepository):
    async def upsert(
        self,
        tenant_id: UUID,
        message_id: UUID,
        embedding: list[float],
    ) -> MessageEmbedding:
        self._require_tenant(tenant_id)

        stmt = (
            pg_insert(MessageEmbedding)
            .values(
                message_id=message_id,
                tenant_id=tenant_id,
                embedding=embedding,
                created_at=datetime.utcnow(),
            )
            .on_conflict_do_update(
                index_elements=["message_id"],
                set_={"embedding": embedding, "tenant_id": tenant_id},
            )
            .returning(MessageEmbedding)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one()

    async def semantic_search(
        self,
        tenant_id: UUID,
        embedding: list[float],
        candidate_ids: list[UUID] | None,
        limit: int,
        time_window: tuple[datetime, datetime] | None = None,
    ) -> list[tuple[UUID, float]]:
        self._require_tenant(tenant_id)

        distance_expr = MessageEmbedding.embedding.cosine_distance(embedding).label("distance")

        stmt = (
            select(MessageEmbedding.message_id, distance_expr)
            .join(Message, Message.id == MessageEmbedding.message_id)
            .where(MessageEmbedding.tenant_id == tenant_id)
            .order_by(distance_expr)
            .limit(limit)
        )

        if candidate_ids is not None:
            stmt = stmt.where(MessageEmbedding.message_id.in_(candidate_ids))

        if time_window:
            stmt = stmt.where(
                Message.event_time >= time_window[0],
                Message.event_time <= time_window[1],
            )

        result = await self.session.execute(stmt)
        return [(row.message_id, 1.0 - float(row.distance)) for row in result.all()]
