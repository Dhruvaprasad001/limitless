from __future__ import annotations

import logging
from datetime import datetime, timedelta
from uuid import UUID

from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.firebase import verify_firebase_token
from app.auth.middleware import extract_bearer_token
from app.auth.schemas import CurrentUser
from app.db.session import get_session
from app.repositories.tenant_repository import TenantRepository
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)

# In-process cache: firebase_uid → (CurrentUser, expires_at)
# Avoids a DB round-trip on every request for already-known users.
_USER_CACHE: dict[str, tuple[CurrentUser, datetime]] = {}
_CACHE_TTL = timedelta(minutes=10)


def _get_cached(uid: str) -> CurrentUser | None:
    entry = _USER_CACHE.get(uid)
    if entry and datetime.utcnow() < entry[1]:
        return entry[0]
    _USER_CACHE.pop(uid, None)
    return None


def _set_cached(uid: str, user: CurrentUser) -> None:
    _USER_CACHE[uid] = (user, datetime.utcnow() + _CACHE_TTL)


async def get_db_session() -> AsyncSession:
    async for session in get_session():
        yield session


async def get_current_user(
    authorization: str | None = Header(None),
    session: AsyncSession = Depends(get_db_session),
) -> CurrentUser:
    token = extract_bearer_token(authorization)
    claims = verify_firebase_token(token)

    cached = _get_cached(claims.uid)
    if cached:
        return cached

    user_repo = UserRepository(session)
    tenant_repo = TenantRepository(session)

    user = await user_repo.get_by_firebase_uid(claims.uid)

    if user is None:
        tenant = await tenant_repo.create(name=claims.email or claims.uid)
        user = await user_repo.create_with_firebase(
            tenant_id=tenant.id,
            name=claims.name or claims.email or claims.uid,
            firebase_uid=claims.uid,
            email=claims.email,
            display_name=claims.name,
        )
        logger.info("provisioned_new_user uid=%s user_id=%s", claims.uid, user.id)

    current_user = CurrentUser(
        id=user.id,
        tenant_id=user.tenant_id,
        firebase_uid=user.firebase_uid,  # type: ignore[arg-type]
        email=user.email,
        display_name=user.display_name,
    )
    _set_cached(claims.uid, current_user)
    return current_user
