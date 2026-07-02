from __future__ import annotations

from fastapi import HTTPException


def extract_bearer_token(authorization: str | None) -> str:
    """
    Extract the raw token from an Authorization: Bearer <token> header.

    Pure utility — no FastAPI Request dependency, easily unit-testable.
    Raises HTTPException(401) if the header is missing or malformed.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header.")

    scheme, _, token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not token.strip():
        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization header. Expected format: Bearer <token>",
        )

    return token.strip()
