from uuid import UUID

from sqlalchemy import select

from app.models.tenant import Tenant
from app.repositories.base import BaseRepository


class TenantRepository(BaseRepository):
    async def create(self, name: str) -> Tenant:
        tenant = Tenant(name=name)
        self.session.add(tenant)
        await self.session.commit()
        await self.session.refresh(tenant)
        return tenant

    async def get_by_id(self, tenant_id: UUID) -> Tenant | None:
        result = await self.session.execute(
            select(Tenant).where(Tenant.id == tenant_id)
        )
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Tenant]:
        result = await self.session.execute(select(Tenant))
        return list(result.scalars().all())
