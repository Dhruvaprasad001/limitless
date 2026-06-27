from __future__ import annotations

import asyncio
import sys
from datetime import datetime, timedelta

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.entity import Entity
from app.models.message import Message
from app.models.tenant import Tenant
from app.models.user import User

# Import all models so Base.metadata is fully populated
import app.models.tenant  # noqa: F401
import app.models.user  # noqa: F401
import app.models.message  # noqa: F401
import app.models.message_embedding  # noqa: F401
import app.models.entity  # noqa: F401


MANUFACTURER_NAME = "Acme Manufacturing Co."
TRADING_NAME = "Horizon Trading Company"


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        # Idempotency check: skip if manufacturer tenant already seeded
        result = await session.execute(
            select(Tenant).where(Tenant.name == MANUFACTURER_NAME)
        )
        if result.scalar_one_or_none() is not None:
            print("Seed data already present — skipping.")
            return

        print(f"Seeding '{MANUFACTURER_NAME}'...")
        base_time = datetime(2026, 6, 26, 8, 0, 0)

        # ── Manufacturer tenant ──────────────────────────────────────────────
        manufacturer = Tenant(name=MANUFACTURER_NAME)
        session.add(manufacturer)
        await session.flush()

        alice = User(tenant_id=manufacturer.id, name="Alice")
        bob = User(tenant_id=manufacturer.id, name="Bob")
        charlie = User(tenant_id=manufacturer.id, name="Charlie")
        session.add_all([alice, bob, charlie])
        await session.flush()

        mfr_messages_data = [
            (alice, "Machine Line 2 stopped unexpectedly.", "MACHINE", "Line 2"),
            (bob, "Production on Line 2 resumed after maintenance.", "MACHINE", "Line 2"),
            (charlie, "Order #4521 delayed due to transport issues.", "ORDER", "4521"),
            (alice, "Order #4521 has been shipped via courier.", "ORDER", "4521"),
        ]

        for i, (user, content, entity_type, entity_value) in enumerate(mfr_messages_data):
            msg_time = base_time + timedelta(hours=i)
            msg = Message(
                tenant_id=manufacturer.id,
                user_id=user.id,
                content=content,
                event_time=msg_time,
                ingested_at=msg_time,
            )
            session.add(msg)
            await session.flush()

            entity = Entity(
                tenant_id=manufacturer.id,
                message_id=msg.id,
                entity_type=entity_type,
                entity_value=entity_value,
                created_at=msg_time,
            )
            session.add(entity)
            print(f"  [{user.name}] {content}")

        print(f"\nSeeding '{TRADING_NAME}'...")

        # ── Trading Company tenant ───────────────────────────────────────────
        trading = Tenant(name=TRADING_NAME)
        session.add(trading)
        await session.flush()

        david = User(tenant_id=trading.id, name="David")
        emma = User(tenant_id=trading.id, name="Emma")
        frank = User(tenant_id=trading.id, name="Frank")
        session.add_all([david, emma, frank])
        await session.flush()

        trading_messages_data = [
            (david, "Payment pending from Rajan for invoice #102.", "PERSON", "Rajan"),
            (emma, "Invoice #102 sent to Rajan via email.", "PERSON", "Rajan"),
            (frank, "Customer Rajan requested a 7-day payment extension.", "PERSON", "Rajan"),
            (david, "Payment received from Rajan. Invoice #102 closed.", "PERSON", "Rajan"),
        ]

        for i, (user, content, entity_type, entity_value) in enumerate(trading_messages_data):
            msg_time = base_time + timedelta(hours=i)
            msg = Message(
                tenant_id=trading.id,
                user_id=user.id,
                content=content,
                event_time=msg_time,
                ingested_at=msg_time,
            )
            session.add(msg)
            await session.flush()

            entity = Entity(
                tenant_id=trading.id,
                message_id=msg.id,
                entity_type=entity_type,
                entity_value=entity_value,
                created_at=msg_time,
            )
            session.add(entity)
            print(f"  [{user.name}] {content}")

        await session.commit()
        print("\nSeed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
    sys.exit(0)
