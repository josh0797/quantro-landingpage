"""Iteration 16 — Verify Stripe billing routes removed + remaining endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://decision-engine-61.preview.emergentagent.com").rstrip("/")
ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "quantro-admin-2026")


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Removed Stripe routes ---
class TestStripeRoutesRemoved:
    def test_create_checkout_removed(self, api):
        r = api.post(f"{BASE_URL}/api/stripe/create-checkout", json={"package_id": "quantro_trial"})
        assert r.status_code in (404, 405), f"Expected 404/405, got {r.status_code}: {r.text[:300]}"

    def test_webhook_stripe_removed(self, api):
        r = api.post(f"{BASE_URL}/api/webhook/stripe", data="{}", headers={"Content-Type": "application/json"})
        assert r.status_code in (404, 405), f"Expected 404/405, got {r.status_code}: {r.text[:300]}"

    def test_checkout_status_removed(self, api):
        r = api.get(f"{BASE_URL}/api/stripe/checkout-status/some-session-id-abc")
        assert r.status_code == 404, f"Expected 404, got {r.status_code}: {r.text[:300]}"


# --- Kept route: payments count ---
class TestPaymentsCount:
    def test_payments_count_ok(self, api):
        r = api.get(f"{BASE_URL}/api/stripe/payments/count")
        assert r.status_code == 200
        data = r.json()
        assert "count" in data
        assert isinstance(data["count"], int)
        assert data["count"] >= 127, f"Expected count >= 127 baseline, got {data['count']}"


# --- Chat route ---
class TestChat:
    def test_chat_basic(self, api):
        payload = {
            "message": "Hola, ¿qué es Quantro?",
            "session_id": "TEST_iter16_sess_001",
            "language": "es",
        }
        r = api.post(f"{BASE_URL}/api/chat/message", json=payload, timeout=60)
        assert r.status_code == 200, f"chat failed: {r.status_code} {r.text[:300]}"
        data = r.json()
        # Accept common reply field names
        reply = data.get("reply") or data.get("message") or data.get("response") or data.get("text")
        assert reply and isinstance(reply, str) and len(reply) > 0, f"Empty reply: {data}"


# --- Admin chat insights ---
class TestAdminInsights:
    def test_insights_requires_auth(self, api):
        r = api.get(f"{BASE_URL}/api/admin/chat/insights")
        assert r.status_code == 401, f"Expected 401, got {r.status_code}"

    def test_insights_with_auth(self, api):
        r = api.get(f"{BASE_URL}/api/admin/chat/insights", auth=(ADMIN_USER, ADMIN_PASS), timeout=30)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:300]}"
        data = r.json()
        assert isinstance(data, dict)
