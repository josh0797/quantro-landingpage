"""Backend tests for iteration 8 — chat endpoint + regression on Stripe."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://decision-engine-61.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ====== Chat endpoint tests ======
class TestChat:
    def test_chat_basic_es(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/chat/message",
            json={"message": "¿Qué es Quantro?", "language": "es"},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "reply" in data and isinstance(data["reply"], str) and len(data["reply"]) > 5
        assert "session_id" in data and len(data["session_id"]) >= 10
        assert data["limit_reached"] is False
        assert isinstance(data["messages_remaining"], int)
        assert data["messages_remaining"] == 19  # 20 - 1
        # Must mention Quantro in some form
        assert "quantro" in data["reply"].lower()
        # Save session for multi-turn test
        TestChat.session_id = data["session_id"]
        TestChat.first_reply = data["reply"]

    def test_chat_multiturn_context(self, api_client):
        # Initial pricing ask
        r1 = api_client.post(
            f"{BASE_URL}/api/chat/message",
            json={"message": "Cuéntame sobre los precios", "language": "es"},
            timeout=60,
        )
        assert r1.status_code == 200
        sid = r1.json()["session_id"]
        # Follow-up referring to prior context
        r2 = api_client.post(
            f"{BASE_URL}/api/chat/message",
            json={"message": "Y el más caro de esos", "session_id": sid, "language": "es"},
            timeout=60,
        )
        assert r2.status_code == 200, r2.text
        reply2 = r2.json()["reply"].lower()
        # Should reference pricing context — expect plan name / price / dollars
        assert any(k in reply2 for k in ["enterprise", "499", "$", "plan", "caro"]), f"No pricing context in: {reply2}"

    def test_chat_english(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/chat/message",
            json={"message": "What is Quantro?", "language": "en"},
            timeout=60,
        )
        assert r.status_code == 200, r.text
        reply = r.json()["reply"]
        assert len(reply) > 5
        # Heuristic: English reply should contain common English words
        lowered = reply.lower()
        english_markers = [" is ", " the ", " you ", " we ", " and ", " your "]
        assert any(m in lowered for m in english_markers), f"Reply not clearly English: {reply}"

    def test_chat_validation_empty(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/chat/message",
            json={"message": "", "language": "es"},
            timeout=30,
        )
        assert r.status_code == 422

    def test_chat_validation_too_long(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/chat/message",
            json={"message": "a" * 1001, "language": "es"},
            timeout=30,
        )
        assert r.status_code == 422

    def test_chat_session_limit_codepath(self, api_client):
        """Verify the 20-msg/session limit code-path by seeding session doc directly via Mongo.

        We simulate by calling the API with a fresh session_id after pre-populating
        count=20 in db.chat_sessions through a helper script. Since we don't have
        direct DB access from test, instead: send 1 real msg, then bump the count
        via an admin helper. No such endpoint exists → use motor directly.
        """
        import asyncio
        from motor.motor_asyncio import AsyncIOMotorClient
        mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        db_name = os.environ.get("DB_NAME", "test_database")

        async def seed_and_check():
            client = AsyncIOMotorClient(mongo_url)
            db = client[db_name]
            sid = "TEST_limit_session_iter8"
            await db.chat_sessions.update_one(
                {"session_id": sid},
                {"$set": {"session_id": sid, "user_message_count": 20}},
                upsert=True,
            )
            client.close()
            return sid

        sid = asyncio.get_event_loop().run_until_complete(seed_and_check())
        r = api_client.post(
            f"{BASE_URL}/api/chat/message",
            json={"message": "hola", "session_id": sid, "language": "es"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["limit_reached"] is True
        assert data["messages_remaining"] == 0
        assert "soporte@quantroos.com" in data["reply"] or "soporte" in data["reply"].lower()

        # cleanup
        async def cleanup():
            client = AsyncIOMotorClient(mongo_url)
            db = client[db_name]
            await db.chat_sessions.delete_one({"session_id": "TEST_limit_session_iter8"})
            client.close()
        asyncio.get_event_loop().run_until_complete(cleanup())


# ====== Stripe regression ======
class TestStripeRegression:
    def test_create_checkout(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/stripe/create-checkout",
            json={"package_id": "trial_1usd", "origin_url": "https://decision-engine-61.preview.emergentagent.com"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "url" in data and data["url"].startswith("http")
        assert "session_id" in data and len(data["session_id"]) > 0

    def test_payments_count(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/stripe/payments/count", timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "count" in data
        assert isinstance(data["count"], int)
        assert data["count"] >= 127
