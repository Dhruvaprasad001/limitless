from __future__ import annotations

from uuid import UUID

from fastapi import HTTPException

from app.models.user import User
from app.repositories.tenant_repository import TenantRepository
from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(self, tenant_repo: TenantRepository, user_repo: UserRepository) -> None:
        self._tenant_repo = tenant_repo
        self._user_repo = user_repo

    async def create_user(self, tenant_id: UUID, name: str) -> User:
        tenant = await self._tenant_repo.get_by_id(tenant_id)
        if tenant is None:
            raise HTTPException(status_code=404, detail=f"Tenant {tenant_id} not found")
        return await self._user_repo.create(tenant_id, name)

    async def get_user(self, tenant_id: UUID, user_id: UUID) -> User:
        user = await self._user_repo.get_by_id(tenant_id, user_id)
        if user is None:
            raise HTTPException(
                status_code=404, detail=f"User {user_id} not found in tenant {tenant_id}"
            )
        return user

    async def list_users(self, tenant_id: UUID) -> list[User]:
        return await self._user_repo.list_by_tenant(tenant_id)
