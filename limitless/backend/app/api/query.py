from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import get_query_service
from app.auth.dependencies import get_current_user
from app.auth.schemas import CurrentUser
from app.schemas.query import QueryRequest, QueryResponse
from app.services.query_service import QueryService

router = APIRouter(prefix="/query", tags=["query"])


@router.post("/", response_model=QueryResponse)
async def query_updates(
    body: QueryRequest,
    current_user: CurrentUser = Depends(get_current_user),
    service: QueryService = Depends(get_query_service),
) -> QueryResponse:
    return await service.answer(current_user.tenant_id, body.question)
