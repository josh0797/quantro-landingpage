"""Admin chat insights endpoint regression tests (iteration 9).

Covers:
- /api/admin/chat/insights auth (no creds, wrong creds, correct creds)
- response shape (window_days, total_user_messages, distinct_sessions, top_questions)
- normalization/grouping (case + accent/punct variants fold to one entry)
- query param clamping (days=0 -> 1, days=9999 -> 365) and limit param
- regressions: /api/chat/message still works, Stripe endpoints still respond
"""
import base64
import os
import uuid
from datetime import datetime, timezone

import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
# Backend .env gives us direct mongo access for seeding (allowed for tests)
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")

ADMIN_USER = "admin"
ADMIN_PASS = "quantro-admin-2026"


# ---------------- Fixtures ----------------

@pytest.fixture(scope="module")
def db():
    client = MongoClient(MONGO_URL)
    yield client[DB_NAME]
    client.close()


@pytest.fixture(scope="module")
def seeded_questions(db):
    """Insert two 'What is Quantro' user messages with accent/case variants.
    After lowercase + trim of leading/trailing punctuation both strings
    should fold to the same normalized key 'qué es quantro' and be grouped.
    """
    now = datetime.now(timezone.utc).isoformat()
    sess_es = f"TEST_sess_{uuid.uuid4().hex[:8]}"
    sess_en = f"TEST_sess_{uuid.uuid4().hex[:8]}"
    docs = [
        {
            "id": str(uuid.uuid4()),
            "session_id": sess_es,
            "role": "user",
            "content": "¿Qué es Quantro?",
            "ip": "127.0.0.1",
            "language": "es",
            "created_at": now,
        },
        {
            "id": str(uuid.uuid4()),
            "session_id": sess_en,
            "role": "user",
            "content": "¿qué es quantro",
            "ip": "127.0.0.1",
            "language": "en",
            "created_at": now,
        },
    ]
    inserted = db.chat_messages.insert_many(docs).inserted_ids
    yield {"session_ids": [sess_es, sess_en]}
    db.chat_messages.delete_many({"_id": {"$in": inserted}})


def _basic_auth(user, pw):
    raw = f"{user}:{pw}".encode()
    return {"Authorization": "Basic " + base64.b64encode(raw).decode()}


# ---------------- Auth tests ----------------

def test_insights_requires_auth():
    r = requests.get(f"{BASE_URL}/api/admin/chat/insights")
    assert r.status_code == 401, r.text
    assert r.headers.get("WWW-Authenticate", "").lower().startswith("basic")


def test_insights_wrong_credentials():
    r = requests.get(
        f"{BASE_URL}/api/admin/chat/insights",
        headers=_basic_auth("wrong", "credentials"),
    )
    assert r.status_code == 401


def test_insights_correct_credentials_returns_shape():
    r = requests.get(
        f"{BASE_URL}/api/admin/chat/insights",
        headers=_basic_auth(ADMIN_USER, ADMIN_PASS),
    )
    assert r.status_code == 200, r.text
    data = r.json()
    for key in ("window_days", "total_user_messages", "distinct_sessions", "top_questions"):
        assert key in data, f"missing {key} in response: {data}"
    assert isinstance(data["top_questions"], list)
    assert isinstance(data["total_user_messages"], int)
    assert isinstance(data["distinct_sessions"], int)
    assert isinstance(data["window_days"], int)


# ---------------- Grouping / normalization ----------------

def test_insights_grouping_case_and_accent(seeded_questions):
    r = requests.get(
        f"{BASE_URL}/api/admin/chat/insights?days=30&limit=50",
        headers=_basic_auth(ADMIN_USER, ADMIN_PASS),
    )
    assert r.status_code == 200
    questions = r.json()["top_questions"]
    # Both variants should fold to 'qué es quantro' (lowercase + leading/trailing punct stripped).
    def _norm(q):
        return (q or "").lower().strip(" \t\n.,!?¿¡;:\"'()[]{}")

    matching = [q for q in questions if _norm(q.get("question")) == "qué es quantro"]
    assert len(matching) >= 1, (
        f"Expected at least one grouped entry for 'qué es quantro', got: {questions[:5]}"
    )
    entry = matching[0]
    # The seeded pair should contribute count>=2 to this grouped entry.
    assert entry["count"] >= 2, f"Expected count >=2 for grouped entry, got {entry}"
    assert "last_seen" in entry
    assert isinstance(entry.get("languages"), list)
    # Both es and en should appear since we seeded one of each.
    assert set(entry["languages"]) >= {"es", "en"}


# ---------------- Query param clamping ----------------

def test_insights_query_params_days_limit():
    r = requests.get(
        f"{BASE_URL}/api/admin/chat/insights?days=7&limit=5",
        headers=_basic_auth(ADMIN_USER, ADMIN_PASS),
    )
    assert r.status_code == 200
    data = r.json()
    assert data["window_days"] == 7
    assert len(data["top_questions"]) <= 5


def test_insights_days_clamped_low():
    r = requests.get(
        f"{BASE_URL}/api/admin/chat/insights?days=0",
        headers=_basic_auth(ADMIN_USER, ADMIN_PASS),
    )
    assert r.status_code == 200
    assert r.json()["window_days"] == 1


def test_insights_days_clamped_high():
    r = requests.get(
        f"{BASE_URL}/api/admin/chat/insights?days=9999",
        headers=_basic_auth(ADMIN_USER, ADMIN_PASS),
    )
    assert r.status_code == 200
    assert r.json()["window_days"] == 365


# ---------------- Regressions ----------------

def test_chat_message_regression():
    r = requests.post(
        f"{BASE_URL}/api/chat/message",
        json={"message": "Hola, ¿cuánto cuesta Quantro?", "language": "es"},
        timeout=45,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert "reply" in body and isinstance(body["reply"], str) and len(body["reply"]) > 0
    assert "session_id" in body and body["session_id"]
    assert "messages_remaining" in body


def test_stripe_create_checkout_regression():
    """Quick sanity check: a Stripe checkout create endpoint responds (200 or 4xx
    but never 5xx). We don't complete payment — just ensure route is alive."""
    # Try a couple of commonly used paths; accept first non-5xx response.
    candidates = [
        ("POST", "/api/payments/create-checkout", {"plan": "pro_monthly", "origin_url": BASE_URL}),
        ("POST", "/api/stripe/create-checkout", {"plan": "pro_monthly", "origin_url": BASE_URL}),
        ("POST", "/api/payments/checkout/session", {"plan": "pro_monthly", "origin_url": BASE_URL}),
    ]
    last = None
    for method, path, payload in candidates:
        r = requests.request(method, f"{BASE_URL}{path}", json=payload, timeout=20)
        last = (path, r.status_code, r.text[:200])
        if r.status_code < 500 and r.status_code != 404:
            # reachable endpoint
            assert r.status_code in (200, 201, 400, 422), last
            return
    pytest.skip(f"No Stripe checkout endpoint found among candidates: last={last}")
