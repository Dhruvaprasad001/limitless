"""Add invites table

Revision ID: 0004
Revises: 0003
Create Date: 2026-07-02 00:00:00.000000
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS invites (
            token VARCHAR NOT NULL,
            tenant_id UUID NOT NULL REFERENCES tenants (id),
            created_by_user_id UUID NOT NULL REFERENCES users (id),
            created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            PRIMARY KEY (token)
        )
    """)
    op.execute("""
        CREATE INDEX IF NOT EXISTS ix_invites_tenant_id ON invites (tenant_id)
    """)


def downgrade() -> None:
    op.drop_index("ix_invites_tenant_id", table_name="invites")
    op.drop_table("invites")
