from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.message import Message
    from app.models.tenant import Tenant


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(ForeignKey("tenants.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)

    # Firebase Auth fields — nullable so existing seed/test users remain valid
    firebase_uid: Mapped[str | None] = mapped_column(String, unique=True, nullable=True, index=True)
    email: Mapped[str | None] = mapped_column(String, nullable=True)
    display_name: Mapped[str | None] = mapped_column(String, nullable=True)

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="users")
    messages: Mapped[list[Message]] = relationship("Message", back_populates="user")
