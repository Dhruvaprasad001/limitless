from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.message import Message


class Entity(TimestampMixin, Base):
    __tablename__ = "entities"
    __table_args__ = (
        Index("ix_entities_tenant_type_value", "tenant_id", "entity_type", "entity_value"),
    )

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(ForeignKey("tenants.id"), nullable=False, index=True)
    message_id: Mapped[UUID] = mapped_column(ForeignKey("messages.id"), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String, nullable=False)
    entity_value: Mapped[str] = mapped_column(String, nullable=False)

    message: Mapped[Message] = relationship("Message", back_populates="entities")
