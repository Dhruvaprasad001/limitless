from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.user import User


class Invite(TimestampMixin, Base):
    __tablename__ = "invites"

    token: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: uuid4().hex)
    tenant_id: Mapped[UUID] = mapped_column(ForeignKey("tenants.id"), nullable=False, index=True)
    created_by_user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)

    tenant: Mapped[Tenant] = relationship("Tenant")
    created_by: Mapped[User] = relationship("User", foreign_keys=[created_by_user_id])
