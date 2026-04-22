"""
Supabase admin client using the service role key.
ONLY import this from trusted server-side contexts (webhooks, admin APIs).

Never expose the service role key to the frontend or any public endpoint.
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import Optional

from supabase import Client, create_client

logger = logging.getLogger(__name__)

_SUPABASE_URL = os.environ.get("SUPABASE_URL")
_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

_client: Optional[Client] = None


def get_admin_client() -> Optional[Client]:
    """Return a singleton Supabase admin client, or None if env vars missing."""
    global _client
    if _client is not None:
        return _client
    if not _SUPABASE_URL or not _SERVICE_ROLE_KEY:
        logger.warning(
            "[supabase_admin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — admin ops will be skipped."
        )
        return None
    _client = create_client(_SUPABASE_URL, _SERVICE_ROLE_KEY)
    return _client


VALID_PLANS = {"essential", "pro", "enterprise"}
VALID_BILLING_CYCLES = {"monthly", "annual"}


def update_profile_plan(
    user_id: Optional[str],
    *,
    plan: Optional[str],
    billing_cycle: Optional[str] = None,
    stripe_subscription_id: Optional[str] = None,
    stripe_customer_id: Optional[str] = None,
) -> bool:
    """
    Update profiles row for the given Supabase user.
    Idempotent: re-runs produce the same final state.

    Returns True on success, False on any validation or transport failure.
    """
    if not user_id:
        logger.info("[supabase_admin] update_profile_plan skipped — no user_id")
        return False
    client = get_admin_client()
    if client is None:
        return False

    update: dict = {}
    if plan in VALID_PLANS:
        update["plan"] = plan
    if billing_cycle in VALID_BILLING_CYCLES:
        update["billing_cycle"] = billing_cycle
    if stripe_subscription_id:
        update["stripe_subscription_id"] = stripe_subscription_id
    if stripe_customer_id:
        update["stripe_customer_id"] = stripe_customer_id
    if not update:
        logger.info(
            "[supabase_admin] update_profile_plan skipped — nothing to update for %s",
            user_id,
        )
        return False

    update["plan_updated_at"] = datetime.now(timezone.utc).isoformat()

    try:
        resp = (
            client.table("profiles")
            .update(update)
            .eq("id", user_id)
            .execute()
        )
        if not resp.data:
            logger.warning(
                "[supabase_admin] update_profile_plan: no row matched id=%s — skipping upsert (profile should already exist via trigger).",
                user_id,
            )
            return False
        logger.info(
            "[supabase_admin] profile %s updated → plan=%s billing=%s",
            user_id,
            update.get("plan"),
            update.get("billing_cycle"),
        )
        return True
    except Exception as exc:  # noqa: BLE001
        logger.exception("[supabase_admin] update_profile_plan failed: %s", exc)
        return False


def clear_profile_plan(user_id: Optional[str]) -> bool:
    """Revoke plan (e.g. subscription cancelled / expired)."""
    if not user_id:
        return False
    client = get_admin_client()
    if client is None:
        return False
    try:
        client.table("profiles").update(
            {
                "plan": None,
                "stripe_subscription_id": None,
                "plan_updated_at": datetime.now(timezone.utc).isoformat(),
            }
        ).eq("id", user_id).execute()
        logger.info("[supabase_admin] profile %s plan cleared", user_id)
        return True
    except Exception as exc:  # noqa: BLE001
        logger.exception("[supabase_admin] clear_profile_plan failed: %s", exc)
        return False
