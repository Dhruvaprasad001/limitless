from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import func, select

from app.models.message import Message
from app.repositories.base import BaseRepository


class MessageRepository(BaseRepository):
    async def create(
        self,
        tenant_id: UUID,
        user_id: UUID,
        content: str,
        event_time: datetime | None = None,
    ) -> Message:
        self._require_tenant(tenant_id)
        message = Message(
            tenant_id=tenant_id,
            user_id=user_id,
            content=content,
            event_time=event_time or datetime.utcnow(),
            ingested_at=datetime.utcnow(),
        )
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def get_by_id(self, tenant_id: UUID, message_id: UUID) -> Message | None:
        self._require_tenant(tenant_id)
        result = await self.session.execute(
            select(Message).where(Message.tenant_id == tenant_id, Message.id == message_id)
        )
        return result.scalar_one_or_none()

    async def get_many_by_ids(self, tenant_id: UUID, message_ids: list[UUID]) -> list[Message]:
        self._require_tenant(tenant_id)
        if not message_ids:
            return []
        result = await self.session.execute(
            select(Message).where(
                Message.tenant_id == tenant_id,
                Message.id.in_(message_ids),
            )
        )
        return list(result.scalars().all())

    async def list_by_tenant(self, tenant_id: UUID, limit: int = 100) -> list[Message]:
        self._require_tenant(tenant_id)
        result = await self.session.execute(
            select(Message)
            .where(Message.tenant_id == tenant_id)
            .order_by(Message.event_time.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def lexical_search(
        self,
        tenant_id: UUID,
        query: str,
        candidate_ids: list[UUID] | None,
        limit: int,
        time_window: tuple[datetime, datetime] | None = None,
    ) -> list[tuple[UUID, float]]:
        self._require_tenant(tenant_id)

        score_expr = func.ts_rank(
            func.to_tsvector("english", Message.content),
            func.plainto_tsquery("english", query),
        ).label("score")

        stmt = (
            select(Message.id, score_expr)
            .where(Message.tenant_id == tenant_id)
            .order_by(score_expr.desc())
            .limit(limit)
        )

        if candidate_ids is not None:
            stmt = stmt.where(Message.id.in_(candidate_ids))

        if time_window:
            stmt = stmt.where(
                Message.event_time >= time_window[0],
                Message.event_time <= time_window[1],
            )

        result = await self.session.execute(stmt)
        return [(row.id, float(row.score)) for row in result.all()]
