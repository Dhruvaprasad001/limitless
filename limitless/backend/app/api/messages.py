from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, Depends

from app.api.dependencies import get_embedding_worker, get_extraction_worker, get_message_service
from app.auth.dependencies import get_current_user
from app.auth.schemas import CurrentUser
from app.schemas.message import MessageCreate, MessageResponse
from app.services.message_service import MessageService
from app.workers.embedding_worker import InProcessEmbeddingWorker, InProcessExtractionWorker

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/", response_model=MessageResponse, status_code=201)
async def create_message(
    body: MessageCreate,
    background_tasks: BackgroundTasks,
    current_user: CurrentUser = Depends(get_current_user),
    message_service: MessageService = Depends(get_message_service),
    embedding_worker: InProcessEmbeddingWorker = Depends(get_embedding_worker),
    extraction_worker: InProcessExtractionWorker = Depends(get_extraction_worker),
) -> MessageResponse:
    message = await message_service.create_message(
        current_user.tenant_id, current_user.id, body.content, event_time=body.event_time
    )
    background_tasks.add_task(embedding_worker.enqueue, message.id, message.tenant_id)
    background_tasks.add_task(
        extraction_worker.enqueue, message.id, message.tenant_id, message.content
    )
    return message
