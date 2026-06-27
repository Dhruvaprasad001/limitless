"""Add event_time and ingested_at columns to messages

Revision ID: 0002
Revises: 7ff4dce10766
Create Date: 2026-06-27 07:00:00.000000
"""

from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("messages", sa.Column("event_time", sa.DateTime(), nullable=True))
    op.add_column("messages", sa.Column("ingested_at", sa.DateTime(), nullable=True))
    # Backfill both from existing created_at
    op.execute("UPDATE messages SET event_time = created_at, ingested_at = created_at")
    # Make non-nullable
    op.alter_column("messages", "event_time", nullable=False)
    op.alter_column("messages", "ingested_at", nullable=False)
    # Add index on event_time for time-range filtering
    op.create_index("ix_messages_event_time", "messages", ["event_time"])


def downgrade() -> None:
    op.drop_index("ix_messages_event_time", "messages")
    op.drop_column("messages", "event_time")
    op.drop_column("messages", "ingested_at")
