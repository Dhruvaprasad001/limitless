from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import get_user_service
from app.auth.dependencies import get_current_user
from app.auth.schemas import CurrentUser
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    body: UserCreate,
    service: UserService = Depends(get_user_service),
) -> UserResponse:
    user = await service.create_user(body.tenant_id, body.name)
    return user


@router.get("/", response_model=list[UserResponse])
async def list_users(
    current_user: CurrentUser = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
) -> list[UserResponse]:
    return await service.list_users(current_user.tenant_id)
