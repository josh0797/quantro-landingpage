"""Iteration 6: Tests for new email-field persistence, checkout-status idempotency,
emails.py module wiring, and welcome email HTML render."""
import os
import sys
import pytest
import requests
from pathlib import Path
from pymongo import MongoClient

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://decision-engine-61.preview.emergentagent.com",
).rstrip("/")
ORIGIN_URL = BASE_URL
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")

# Ensure we can import backend modules
sys.path.insert(0, str(Path("/app/backend")))


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def mongo():
    return MongoClient(MONGO_URL)[DB_NAME]


# ============ NEW: email field persisted on create-checkout ============
class TestCreateCheckoutWithEmail:
    def test_email_persisted_in_transaction(self, api, mongo):
        email = "TEST_iter6_email@example.com"
        payload = {
            "package_id": "trial_1usd",
            "origin_url": ORIGIN_URL,
            "email": email,
        }
        r = api.post(f"{BASE_URL}/api/stripe/create-checkout", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        sid = r.json()["session_id"]

        doc = mongo.payment_transactions.find_one({"session_id": sid})
        assert doc is not None
        assert doc.get("email") == email, f"email not persisted: {doc.get('email')}"
        # welcome_email_sent should be absent OR false for fresh pending tx
        assert not doc.get("welcome_email_sent", False), "welcome_email_sent should be False on fresh tx"
        pytest.saved_sid_email = sid


# ============ NEW: checkout-status idempotency ============
class TestCheckoutStatusIdempotency:
    def test_status_twice_no_duplicate(self, api, mongo):
        sid = getattr(pytest, "saved_sid_email", None)
        if not sid:
            r = api.post(
                f"{BASE_URL}/api/stripe/create-checkout",
                json={"package_id": "trial_1usd", "origin_url": ORIGIN_URL, "email": "TEST_iter6_idem@example.com"},
                timeout=30,
            )
            sid = r.json()["session_id"]

        # Call status twice
        r1 = api.get(f"{BASE_URL}/api/stripe/checkout-status/{sid}", timeout=30)
        r2 = api.get(f"{BASE_URL}/api/stripe/checkout-status/{sid}", timeout=30)
        assert r1.status_code == 200 and r2.status_code == 200
        # No crash, same payment_status expected (unpaid for fresh sessions)
        assert r1.json()["payment_status"] == r2.json()["payment_status"]

        # Exactly ONE document for this session_id in DB (no duplicates)
        count = mongo.payment_transactions.count_documents({"session_id": sid})
        assert count == 1, f"Duplicate tx records found: {count}"

        # Because payment is unpaid, no email should have been fired
        doc = mongo.payment_transactions.find_one({"session_id": sid})
        assert not doc.get("welcome_email_sent", False)


# ============ NEW: emails.py module imports & config ============
class TestEmailsModule:
    def test_env_vars_present(self):
        # Load backend .env
        from dotenv import dotenv_values
        env = dotenv_values("/app/backend/.env")
        assert env.get("RESEND_API_KEY"), "RESEND_API_KEY missing from backend/.env"
        assert env.get("SENDER_EMAIL"), "SENDER_EMAIL missing from backend/.env"
        assert "@" in env["SENDER_EMAIL"]

    def test_emails_module_imports(self):
        import emails as emails_mod
        assert hasattr(emails_mod, "_welcome_email_html")
        assert hasattr(emails_mod, "send_welcome_email")
        assert callable(emails_mod.send_welcome_email)

    def test_welcome_email_html_renders(self):
        import emails as emails_mod
        html = emails_mod._welcome_email_html(1.0)
        assert isinstance(html, str) and len(html) > 500
        assert html.lstrip().lower().startswith("<!doctype html>")
        assert "</html>" in html
        assert "Quantro" in html
        assert "$1.00 USD" in html  # amount formatting
        assert "ventas@quantroos.com" in html  # footer link
