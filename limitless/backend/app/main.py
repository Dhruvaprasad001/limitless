from __future__ import annotations

import logging
import sys
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

# Allow running as `python app/main.py` from the project root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI

from app.api import messages, tenants, users
from app.api import query
from app.auth.firebase import initialize_firebase_app
from app.config import settings
from app.db.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
    initialize_firebase_app()
    await init_db()
    yield


app = FastAPI(
    title="Limitless – Team Updates API",
    description="AI-powered multi-tenant team updates with hybrid retrieval and grounded LLM answers.",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(tenants.router)
app.include_router(users.router)
app.include_router(messages.router)
app.include_router(query.router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
