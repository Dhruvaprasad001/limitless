from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException

from app.models.tenant import Tenant
from app.repositories.tenant_repository import TenantRepository


class TenantService:
    def __init__(self, repo: TenantRepository) -> None:
        self._repo = repo

    async def create_tenant(self, name: str) -> Tenant:
        return await self._repo.create(name)

    async def get_tenant(self, tenant_id: UUID) -> Tenant:
        tenant = await self._repo.get_by_id(tenant_id)
        if tenant is None:
            raise HTTPException(status_code=404, detail=f"Tenant {tenant_id} not found")
        return tenant

    async def list_tenants(self) -> list[Tenant]:
        return await self._repo.list_all()
