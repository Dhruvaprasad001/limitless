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

    async def get_by_firebase_uid(self, firebase_uid: str) -> User | None:
        """
        Look up a user by their Firebase UID.

        This is the only repository method that does NOT filter by tenant_id — it is
        a cross-tenant identity lookup keyed on a globally unique value. This is
        intentional: firebase_uid has a UNIQUE constraint so no data leakage is possible.
        """
        result = await self.session.execute(
            select(User).where(User.firebase_uid == firebase_uid)
        )
        return result.scalar_one_or_none()

    async def create_with_firebase(
        self,
        tenant_id: UUID,
        name: str,
        firebase_uid: str,
        email: str | None,
        display_name: str | None,
    ) -> User:
        """Create a new user record with Firebase identity fields populated."""
        self._require_tenant(tenant_id)
        user = User(
            tenant_id=tenant_id,
            name=name,
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
        )
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
