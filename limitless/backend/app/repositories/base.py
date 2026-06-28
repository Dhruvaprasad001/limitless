from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession


class BaseRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _require_tenant(self, tenant_id: UUID | None) -> UUID:
        if tenant_id is None:
            raise ValueError("tenant_id is required")
        return tenant_id
