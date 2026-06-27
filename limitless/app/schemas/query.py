from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.query_plan import QueryPlan


class QueryRequest(BaseModel):
    tenant_id: UUID
    question: str


class RetrievedMessage(BaseModel):
    id: UUID
    user_name: str
    content: str
    created_at: datetime


class QueryResponse(BaseModel):
    answer: str
    supporting_message_ids: list[UUID]
    supporting_timestamps: list[datetime]
    query_plan: dict  # serialized QueryPlan
