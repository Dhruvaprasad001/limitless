from __future__ import annotations

import json
import logging

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException

from app.auth.schemas import FirebaseClaims
from app.config import settings

logger = logging.getLogger(__name__)

_firebase_app: firebase_admin.App | None = None


def initialize_firebase_app() -> None:
    """Initialize the Firebase Admin SDK singleton. Call once during application startup."""
    global _firebase_app

    if _firebase_app is not None:
        return

    cred: credentials.Base

    if settings.FIREBASE_CREDENTIALS_JSON:
        cred_dict = json.loads(settings.FIREBASE_CREDENTIALS_JSON)
        cred = credentials.Certificate(cred_dict)
    elif settings.FIREBASE_CREDENTIALS_PATH:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    else:
        raise RuntimeError(
            "Firebase credentials not configured. "
            "Set FIREBASE_CREDENTIALS_JSON or FIREBASE_CREDENTIALS_PATH in your environment."
        )

    _firebase_app = firebase_admin.initialize_app(cred)
    logger.info("firebase_initialized", extra={"project": _firebase_app.project_id})


def verify_firebase_token(token: str) -> FirebaseClaims:
    """
    Verify a Firebase ID token and return decoded claims.

    Raises HTTPException(401) for any verification failure.
    Never logs the raw token.
    """
    if _firebase_app is None:
        raise RuntimeError("Firebase app is not initialized. Call initialize_firebase_app() first.")

    try:
        decoded = auth.verify_id_token(token, app=_firebase_app, check_revoked=True)
    except auth.RevokedIdTokenError:
        raise HTTPException(status_code=401, detail="Token has been revoked.")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except auth.InvalidIdTokenError as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")
    except Exception as exc:
        logger.warning("firebase_token_verification_failed", extra={"error": str(exc)})
        raise HTTPException(status_code=401, detail="Token verification failed.")

    return FirebaseClaims(
        uid=decoded["uid"],
        email=decoded.get("email"),
        name=decoded.get("name"),
        picture=decoded.get("picture"),
    )
