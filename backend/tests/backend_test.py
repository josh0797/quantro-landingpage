"""Backend tests for Quantro landing - Stripe checkout, early-access, social proof count."""
import os
import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://decision-engine-61.preview.emergentagent.com").rstrip("/")
ORIGIN_URL = BASE_URL

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def mongo():
    c = MongoClient(MONGO_URL)
    return c[DB_NAME]


# ======== Stripe create-checkout ========
class TestStripeCreateCheckout:
    def test_create_checkout_returns_url_and_session(self, api, mongo):
        payload = {"package_id": "trial_1usd", "origin_url": ORIGIN_URL}
        r = api.post(f"{BASE_URL}/api/stripe/create-checkout", json=payload, timeout=30)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
        data = r.json()
        assert "url" in data and "session_id" in data
        assert data["url"].startswith("https://checkout.stripe.com/"), f"Unexpected url: {data['url']}"
        assert isinstance(data["session_id"], str) and len(data["session_id"]) > 0

        # Verify pending record persisted
        doc = mongo.payment_transactions.find_one({"session_id": data["session_id"]})
        assert doc is not None, "payment_transactions record not created"
        assert doc["payment_status"] == "pending"
        assert doc["package_id"] == "trial_1usd"
        assert doc["amount"] == 1.00
        assert doc["currency"] == "usd"

        # Save for next tests
        pytest.saved_session_id = data["session_id"]

    def test_create_checkout_invalid_package(self, api):
        payload = {"package_id": "nonexistent_pkg", "origin_url": ORIGIN_URL}
        r = api.post(f"{BASE_URL}/api/stripe/create-checkout", json=payload, timeout=15)
        assert r.status_code == 400
        data = r.json()
        assert "Invalid package" in (data.get("detail") or "")


# ======== Stripe checkout-status ========
class TestStripeCheckoutStatus:
    def test_checkout_status_returns_expected_fields(self, api):
        session_id = getattr(pytest, "saved_session_id", None)
        if not session_id:
            # Fresh create if previous test didn't run
            r = api.post(f"{BASE_URL}/api/stripe/create-checkout",
                         json={"package_id": "trial_1usd", "origin_url": ORIGIN_URL}, timeout=30)
            assert r.status_code == 200
            session_id = r.json()["session_id"]

        r = api.get(f"{BASE_URL}/api/stripe/checkout-status/{session_id}", timeout=30)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
        data = r.json()
        for key in ("status", "payment_status", "amount_total", "currency"):
            assert key in data, f"Missing key: {key}"
        assert data["payment_status"] in ("unpaid", "no_payment_required", "paid")
        assert data["currency"].lower() == "usd"


# ======== Stripe payments count (live social proof) ========
class TestStripePaymentsCount:
    def test_payments_count_at_least_127(self, api):
        r = api.get(f"{BASE_URL}/api/stripe/payments/count", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "count" in data
        assert isinstance(data["count"], int)
        assert data["count"] >= 127, f"count={data['count']} expected >=127"


# ======== Early-access regression ========
class TestEarlyAccess:
    def test_early_access_success(self, api):
        email = "TEST_regress_earlyaccess@example.com"
        r = api.post(f"{BASE_URL}/api/early-access", json={"email": email}, timeout=15)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
        data = r.json()
        assert data["email"] == email
        assert "id" in data

    def test_early_access_invalid_email(self, api):
        r = api.post(f"{BASE_URL}/api/early-access", json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 400
