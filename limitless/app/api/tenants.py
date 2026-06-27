from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import get_tenant_service
from app.schemas.tenant import TenantCreate, TenantResponse
from app.services.tenant_service import TenantService

router = APIRouter(prefix="/tenants", tags=["tenants"])


@router.post("/", response_model=TenantResponse, status_code=201)
async def create_tenant(
    body: TenantCreate,
    service: TenantService = Depends(get_tenant_service),
) -> TenantResponse:
    tenant = await service.create_tenant(body.name)
    return tenant
