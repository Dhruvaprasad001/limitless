from sqlalchemy import text

from app.db.session import engine
from app.models.base import Base

# Import all models so their tables are registered on Base.metadata
import app.models.tenant  # noqa: F401
import app.models.user  # noqa: F401
import app.models.message  # noqa: F401
import app.models.message_embedding  # noqa: F401
import app.models.entity  # noqa: F401
import app.models.invite  # noqa: F401


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
