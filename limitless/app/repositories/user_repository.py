from uuid import UUID

from sqlalchemy import select

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository):
    async def create(self, tenant_id: UUID, name: str) -> User:
        self._require_tenant(tenant_id)
        user = User(tenant_id=tenant_id, name=name)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def get_by_id(self, tenant_id: UUID, user_id: UUID) -> User | None:
        self._require_tenant(tenant_id)
        result = await self.session.execute(
            select(User).where(User.tenant_id == tenant_id, User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def list_by_tenant(self, tenant_id: UUID) -> list[User]:
        self._require_tenant(tenant_id)
        result = await self.session.execute(
            select(User).where(User.tenant_id == tenant_id)
        )
        return list(result.scalars().all())
