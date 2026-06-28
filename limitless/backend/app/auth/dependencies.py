from __future__ import annotations

import logging

from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.firebase import verify_firebase_token
from app.auth.middleware import extract_bearer_token
from app.auth.schemas import CurrentUser
from app.db.session import get_session
from app.repositories.tenant_repository import TenantRepository
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)


async def get_db_session() -> AsyncSession:
    async for session in get_session():
        yield session


async def get_current_user(
    authorization: str | None = Header(None),
    session: AsyncSession = Depends(get_db_session),
) -> CurrentUser:
    """
    FastAPI dependency that:
    1. Extracts the Bearer token from the Authorization header.
    2. Verifies the Firebase ID token.
    3. Looks up the user by firebase_uid.
    4. Auto-provisions a new tenant + user on first login.
    5. Returns a CurrentUser with id and tenant_id populated.
    """
    token = extract_bearer_token(authorization)
    claims = verify_firebase_token(token)

    user_repo = UserRepository(session)
    tenant_repo = TenantRepository(session)

    user = await user_repo.get_by_firebase_uid(claims.uid)

    if user is None:
        # First login — provision a dedicated tenant and user record
        tenant = await tenant_repo.create(name=claims.email or claims.uid)
        user = await user_repo.create_with_firebase(
            tenant_id=tenant.id,
            name=claims.name or claims.email or claims.uid,
            firebase_uid=claims.uid,
            email=claims.email,
            display_name=claims.name,
        )
        logger.info(
            "provisioned_new_user",
            extra={
                "uid": claims.uid,
                "user_id": str(user.id),
                "tenant_id": str(user.tenant_id),
            },
        )

    logger.info(
        "authenticated",
        extra={
            "uid": claims.uid,
            "user_id": str(user.id),
            "tenant_id": str(user.tenant_id),
        },
    )

    return CurrentUser(
        id=user.id,
        tenant_id=user.tenant_id,
        firebase_uid=user.firebase_uid,  # type: ignore[arg-type]
        email=user.email,
        display_name=user.display_name,
    )
