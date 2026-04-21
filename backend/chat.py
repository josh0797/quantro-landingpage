"""Chat support backend — GPT-4o-mini via emergentintegrations.

Endpoints:
  POST /api/chat/message  — receives user message, returns AI reply
Rate limits:
  - 20 messages per session
  - 50 messages per IP per day
"""
import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field

from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

MAX_MESSAGES_PER_SESSION = 20
MAX_MESSAGES_PER_IP_PER_DAY = 50

SYSTEM_PROMPT_ES = """Eres el asistente de soporte de Quantro, una plataforma SaaS premium que se describe como "Autonomous Business Operating System" — combina Quantro OS (inteligencia y claridad) con Quantro Flow (ejecución automática).

Tu rol:
- Responder preguntas sobre qué es Quantro, cómo funciona, precios, prueba, cancelación
- Ser amigable, humano, directo. Nada de jerga corporativa ni lenguaje técnico innecesario
- Respuestas CORTAS (máximo 3-4 oraciones). Si necesitas listar cosas, usa máximo 3 bullets
- Tono premium pero cálido (estilo Apple/Stripe)

Información clave del producto:
- Quantro OS: analiza tu negocio, detecta oportunidades, propone acciones claras cada mañana ("Morning Snapshot")
- Quantro Flow: ejecuta las acciones automáticamente (responde, organiza, da seguimiento)
- Prueba: $1 USD (cargo único, no reembolsable)
- Planes mensuales: Starter $89, Pro $199, Enterprise $499
- Planes anuales: Starter $74/mes, Pro $166/mes, Enterprise $416/mes (incluye 2 meses gratis)
- Cancelación: en cualquier momento, sin fricción
- Funciona especialmente bien para empresas pequeñas y medianas
- Para contacto comercial: ventas@quantroos.com | Soporte: soporte@quantroos.com

Si no sabes algo específico o técnico profundo (integraciones exactas, compliance legal, onboarding personalizado), sé honesto y dirige a ventas@quantroos.com."""

SYSTEM_PROMPT_EN = """You are Quantro's support assistant. Quantro is a premium SaaS described as an "Autonomous Business Operating System" — combining Quantro OS (intelligence and clarity) with Quantro Flow (automatic execution).

Your role:
- Answer questions about what Quantro is, how it works, pricing, trial, cancellation
- Be friendly, human, direct. No corporate jargon or unnecessary technical language
- SHORT answers (max 3-4 sentences). If listing, max 3 bullets
- Premium but warm tone (Apple/Stripe style)

Key product info:
- Quantro OS: analyzes your business, detects opportunities, proposes clear actions each morning ("Morning Snapshot")
- Quantro Flow: executes actions automatically (replies, organizes, follows up)
- Trial: $1 USD (one-time, non-refundable)
- Monthly plans: Starter $89, Pro $199, Enterprise $499
- Annual plans: Starter $74/mo, Pro $166/mo, Enterprise $416/mo (includes 2 months free)
- Cancel anytime, no friction
- Works especially well for small and mid-sized businesses
- Sales contact: ventas@quantroos.com | Support: soporte@quantroos.com

If you don't know something specific or deeply technical (exact integrations, legal compliance, custom onboarding), be honest and direct them to ventas@quantroos.com."""


class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    session_id: Optional[str] = None
    language: str = "es"  # 'es' | 'en'


class ChatMessageResponse(BaseModel):
    reply: str
    session_id: str
    limit_reached: bool = False
    messages_remaining: int


def _client_ip(request: Request) -> str:
    # Trust x-forwarded-for since we're behind ingress
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def register_chat_routes(api_router: APIRouter, db):
    """Register chat routes on the given FastAPI router. Takes the Motor db instance."""

    @api_router.post("/chat/message", response_model=ChatMessageResponse)
    async def send_chat_message(body: ChatMessageRequest, request: Request):
        api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="LLM key not configured")

        session_id = body.session_id or str(uuid.uuid4())
        ip = _client_ip(request)
        now = datetime.now(timezone.utc)

        # --- Rate limit per IP per day ---
        today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
        ip_count = await db.chat_messages.count_documents({
            "ip": ip,
            "role": "user",
            "created_at": {"$gte": today_start.isoformat()},
        })
        if ip_count >= MAX_MESSAGES_PER_IP_PER_DAY:
            raise HTTPException(
                status_code=429,
                detail="Daily message limit reached. Please try again tomorrow or email soporte@quantroos.com.",
            )

        # --- Rate limit per session ---
        session_doc = await db.chat_sessions.find_one({"session_id": session_id}, {"_id": 0})
        session_count = session_doc.get("user_message_count", 0) if session_doc else 0
        if session_count >= MAX_MESSAGES_PER_SESSION:
            return ChatMessageResponse(
                reply=(
                    "Has alcanzado el límite de esta conversación. Para seguir, escríbenos a soporte@quantroos.com."
                    if body.language == "es"
                    else "You've reached the limit for this conversation. To continue, please email soporte@quantroos.com."
                ),
                session_id=session_id,
                limit_reached=True,
                messages_remaining=0,
            )

        # --- Send to LLM ---
        system_prompt = SYSTEM_PROMPT_EN if body.language == "en" else SYSTEM_PROMPT_ES
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=system_prompt,
        ).with_model("openai", "gpt-4o-mini")

        try:
            reply = await chat.send_message(UserMessage(text=body.message))
        except Exception as e:
            logger.error(f"LLM call failed (session={session_id}): {e}")
            raise HTTPException(status_code=502, detail="Chat service temporarily unavailable")

        # --- Persist user + assistant messages ---
        created_at = now.isoformat()
        await db.chat_messages.insert_many([
            {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "role": "user",
                "content": body.message,
                "ip": ip,
                "language": body.language,
                "created_at": created_at,
            },
            {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "role": "assistant",
                "content": reply,
                "ip": ip,
                "language": body.language,
                "created_at": created_at,
            },
        ])

        # --- Update session counter ---
        await db.chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$inc": {"user_message_count": 1},
                "$set": {"last_activity": created_at, "language": body.language, "ip": ip},
                "$setOnInsert": {"created_at": created_at},
            },
            upsert=True,
        )

        messages_remaining = MAX_MESSAGES_PER_SESSION - (session_count + 1)
        return ChatMessageResponse(
            reply=reply,
            session_id=session_id,
            limit_reached=False,
            messages_remaining=max(messages_remaining, 0),
        )
