from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import evict_cached, get_current_user, get_db_session
from app.auth.schemas import CurrentUser
from app.repositories.invite_repository import InviteRepository
from app.repositories.tenant_repository import TenantRepository
from app.repositories.user_repository import UserRepository
from app.schemas.invite import InvitePreview, InviteResponse
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/invites", tags=["invites"])


@router.post("/", response_model=InviteResponse, status_code=201)
async def create_invite(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> InviteResponse:
    """Generate an invite token for the current user's org."""
    repo = InviteRepository(session)
    invite = await repo.create(
        tenant_id=current_user.tenant_id,
        created_by_user_id=current_user.id,
    )
    logger.info("invite_created token=%s tenant_id=%s", invite.token, invite.tenant_id)
    return InviteResponse(
        token=invite.token,
        tenant_id=invite.tenant_id,
        created_at=invite.created_at,
    )


@router.get("/{token}", response_model=InvitePreview)
async def preview_invite(
    token: str,
    session: AsyncSession = Depends(get_db_session),
) -> InvitePreview:
    """Return org name for the join page — no auth required."""
    invite_repo = InviteRepository(session)
    tenant_repo = TenantRepository(session)

    invite = await invite_repo.get_by_token(token)
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found or expired")

    tenant = await tenant_repo.get_by_id(invite.tenant_id)
    if tenant is None:
        raise HTTPException(status_code=404, detail="Organisation no longer exists")

    return InvitePreview(token=invite.token, tenant_name=tenant.name)


@router.post("/{token}/accept", response_model=None, status_code=204)
async def accept_invite(
    token: str,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> None:
    """
    Move the authenticated user into the org identified by the invite token.

    If the user was auto-provisioned into their own solo tenant during this
    very first login (tenant name == their email), that solo tenant is left
    as-is — it will simply have no users.  The user's tenant_id is updated
    to the invite's tenant.
    """
    invite_repo = InviteRepository(session)
    user_repo = UserRepository(session)

    invite = await invite_repo.get_by_token(token)
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found or expired")

    if current_user.tenant_id == invite.tenant_id:
        return  # already in this org — idempotent

    user = await user_repo.get_by_firebase_uid(current_user.firebase_uid)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.tenant_id = invite.tenant_id
    await session.commit()
    evict_cached(current_user.firebase_uid)

    logger.info(
        "invite_accepted token=%s user_id=%s new_tenant_id=%s",
        token,
        current_user.id,
        invite.tenant_id,
    )
