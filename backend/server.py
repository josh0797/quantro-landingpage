from fastapi import FastAPI, APIRouter, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
)
from emails import send_welcome_email


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

from email_validator import validate_email, EmailNotValidError
from fastapi import HTTPException

class EarlyAccessRequest(BaseModel):
    email: str
    
    @classmethod
    def validate_email_format(cls, email: str) -> str:
        try:
            validate_email(email, check_deliverability=False)
            return email
        except EmailNotValidError:
            raise ValueError("Invalid email format")

class EarlyAccessResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/early-access", response_model=EarlyAccessResponse)
async def submit_early_access(request: EarlyAccessRequest):
    # Validate email format
    try:
        EarlyAccessRequest.validate_email_format(request.email)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    response_obj = EarlyAccessResponse(email=request.email)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = response_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.early_access.insert_one(doc)
    return response_obj

@api_router.get("/early-access", response_model=List[EarlyAccessResponse])
async def get_early_access_signups():
    signups = await db.early_access.find({}, {"_id": 0}).to_list(1000)
    
    for signup in signups:
        if isinstance(signup.get('created_at'), str):
            signup['created_at'] = datetime.fromisoformat(signup['created_at'])
    
    return signups


# ============ STRIPE CHECKOUT ============

# Fixed packages defined on backend (SECURITY: never accept amount from frontend)
STRIPE_PACKAGES = {
    "trial_1usd": {"amount": 1.00, "currency": "usd", "description": "Quantro Trial Access"},
}

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY")


class CheckoutSessionRequestBody(BaseModel):
    package_id: str = "trial_1usd"
    origin_url: str
    email: Optional[str] = None


class CheckoutSessionResponseBody(BaseModel):
    url: str
    session_id: str


class CheckoutStatusResponseBody(BaseModel):
    status: str
    payment_status: str
    amount_total: int
    currency: str


def _get_stripe_checkout(request: Request) -> StripeCheckout:
    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    return StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)


@api_router.post("/stripe/create-checkout", response_model=CheckoutSessionResponseBody)
async def create_stripe_checkout(body: CheckoutSessionRequestBody, request: Request):
    if body.package_id not in STRIPE_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package")

    package = STRIPE_PACKAGES[body.package_id]
    origin = body.origin_url.rstrip("/")
    success_url = f"{origin}/?payment=success&session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/?payment=cancel"

    metadata = {
        "package_id": body.package_id,
        "source": "landing_hero_cta",
    }
    if body.email:
        metadata["email"] = body.email

    stripe_checkout = _get_stripe_checkout(request)
    checkout_request = CheckoutSessionRequest(
        amount=package["amount"],
        currency=package["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)

    # Create pending transaction record BEFORE redirect (mandatory)
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "package_id": body.package_id,
        "amount": package["amount"],
        "currency": package["currency"],
        "email": body.email,
        "metadata": metadata,
        "payment_status": "pending",
        "status": "initiated",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.payment_transactions.insert_one(transaction)

    return CheckoutSessionResponseBody(url=session.url, session_id=session.session_id)


@api_router.get("/stripe/checkout-status/{session_id}", response_model=CheckoutStatusResponseBody)
async def stripe_checkout_status(session_id: str, request: Request):
    stripe_checkout = _get_stripe_checkout(request)
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

    # Idempotent update: only mark paid once + send welcome email only once
    existing = await db.payment_transactions.find_one(
        {"session_id": session_id}, {"_id": 0}
    )
    if existing and existing.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "status": status.status,
                "payment_status": status.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }}
        )

        # Fire welcome email on first paid transition
        if (
            status.payment_status == "paid"
            and existing.get("email")
            and not existing.get("welcome_email_sent")
        ):
            email_id = await send_welcome_email(
                to_email=existing["email"],
                amount_usd=existing.get("amount", 1.0),
            )
            if email_id:
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {
                        "welcome_email_sent": True,
                        "welcome_email_id": email_id,
                        "welcome_email_sent_at": datetime.now(timezone.utc).isoformat(),
                    }}
                )

    return CheckoutStatusResponseBody(
        status=status.status,
        payment_status=status.payment_status,
        amount_total=status.amount_total,
        currency=status.currency,
    )


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")

    stripe_checkout = _get_stripe_checkout(request)
    webhook_response = await stripe_checkout.handle_webhook(body, signature)

    # Idempotent: only update if not already paid
    existing = await db.payment_transactions.find_one(
        {"session_id": webhook_response.session_id}, {"_id": 0}
    )
    if existing and existing.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": webhook_response.session_id},
            {"$set": {
                "payment_status": webhook_response.payment_status,
                "status": "completed" if webhook_response.payment_status == "paid" else existing.get("status", "pending"),
                "webhook_event_id": webhook_response.event_id,
                "webhook_event_type": webhook_response.event_type,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }}
        )

        # Fire welcome email on first paid transition
        if (
            webhook_response.payment_status == "paid"
            and existing.get("email")
            and not existing.get("welcome_email_sent")
        ):
            email_id = await send_welcome_email(
                to_email=existing["email"],
                amount_usd=existing.get("amount", 1.0),
            )
            if email_id:
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {"$set": {
                        "welcome_email_sent": True,
                        "welcome_email_id": email_id,
                        "welcome_email_sent_at": datetime.now(timezone.utc).isoformat(),
                    }}
                )

    return {"received": True}


@api_router.get("/stripe/payments/count")
async def stripe_payments_count():
    """Public count of successful Quantro trial payments — for live social proof."""
    count = await db.payment_transactions.count_documents({"payment_status": "paid"})
    # Add a baseline so the counter looks populated early on
    return {"count": count + 127}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()