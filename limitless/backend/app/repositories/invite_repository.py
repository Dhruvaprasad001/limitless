from uuid import UUID

from sqlalchemy import select

from app.models.invite import Invite
from app.repositories.base import BaseRepository


class InviteRepository(BaseRepository):
    async def create(self, tenant_id: UUID, created_by_user_id: UUID) -> Invite:
        invite = Invite(tenant_id=tenant_id, created_by_user_id=created_by_user_id)
        self.session.add(invite)
        await self.session.commit()
        await self.session.refresh(invite)
        return invite

    async def get_by_token(self, token: str) -> Invite | None:
        result = await self.session.execute(
            select(Invite).where(Invite.token == token)
        )
        return result.scalar_one_or_none()
