from uuid import UUID

from sqlalchemy import func, select

from app.models.entity import Entity
from app.repositories.base import BaseRepository


class EntityRepository(BaseRepository):
    async def create(
        self,
        tenant_id: UUID,
        message_id: UUID,
        entity_type: str,
        entity_value: str,
    ) -> Entity:
        self._require_tenant(tenant_id)
        entity = Entity(
            tenant_id=tenant_id,
            message_id=message_id,
            entity_type=entity_type,
            entity_value=entity_value,
        )
        self.session.add(entity)
        await self.session.commit()
        await self.session.refresh(entity)
        return entity

    async def get_message_ids_for_entity(
        self,
        tenant_id: UUID,
        entity_value: str,
    ) -> list[UUID]:
        self._require_tenant(tenant_id)
        result = await self.session.execute(
            select(Entity.message_id).where(
                Entity.tenant_id == tenant_id,
                func.lower(Entity.entity_value) == entity_value.lower(),
            )
        )
        return list(result.scalars().all())

    async def list_by_message(self, tenant_id: UUID, message_id: UUID) -> list[Entity]:
        self._require_tenant(tenant_id)
        result = await self.session.execute(
            select(Entity).where(
                Entity.tenant_id == tenant_id,
                Entity.message_id == message_id,
            )
        )
        return list(result.scalars().all())

    async def list_all_by_type(self, tenant_id: UUID, entity_type: str) -> list[Entity]:
        """Return all entities of a given type for the tenant."""
        self._require_tenant(tenant_id)
        result = await self.session.execute(
            select(Entity).where(
                Entity.tenant_id == tenant_id,
                Entity.entity_type == entity_type,
            )
        )
        return list(result.scalars().all())
