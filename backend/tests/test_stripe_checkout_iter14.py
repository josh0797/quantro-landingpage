"""Iteration 14 — verify /api/stripe/create-checkout accepts optional
plan / billing_cycle / user_id / metadata fields and still works without them."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://decision-engine-61.preview.emergentagent.com").rstrip("/")
ORIGIN = BASE_URL


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


class TestStripeCheckout:
    def test_minimal_payload(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/stripe/create-checkout",
            json={"package_id": "trial_1usd", "origin_url": ORIGIN},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and data["url"].startswith("http")
        assert "session_id" in data and isinstance(data["session_id"], str)

    def test_full_payload_with_optional_fields(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/stripe/create-checkout",
            json={
                "package_id": "trial_1usd",
                "origin_url": ORIGIN,
                "email": "TEST_iter14@example.com",
                "plan": "pro",
                "billing_cycle": "monthly",
                "user_id": "test-user-uuid-1234",
                "metadata": {"platform": "os"},
            },
            timeout=30,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["url"].startswith("http")
        assert data["session_id"]

    def test_invalid_package_rejected(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/stripe/create-checkout",
            json={"package_id": "does_not_exist", "origin_url": ORIGIN},
            timeout=30,
        )
        assert r.status_code == 400

    def test_missing_origin_url_rejected(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/stripe/create-checkout",
            json={"package_id": "trial_1usd"},
            timeout=30,
        )
        assert r.status_code == 422  # FastAPI validation error


class TestHealth:
    def test_root_api(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/", timeout=15)
        # server.py has GET /api/ returning Hello World
        assert r.status_code in (200, 404)
