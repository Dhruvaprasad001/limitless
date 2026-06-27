from __future__ import annotations

from pydantic import BaseModel


class QueryPlan(BaseModel):
    intent: str | None = None
    entity: str | None = None
    time_range: str | None = None  # e.g. "this_week", "today", "last_week", None
    confident: bool = False
