// Stripe checkout helper — calls backend to create session and redirects
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export async function startStripeCheckout({ packageId = "trial_1usd", email = null } = {}) {
  const response = await fetch(`${BACKEND_URL}/api/stripe/create-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: packageId,
      origin_url: window.location.origin,
      email,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  const data = await response.json();
  if (!data.url) throw new Error("No checkout URL received");

  // Redirect user to Stripe Checkout
  window.location.href = data.url;
}

export async function getCheckoutStatus(sessionId) {
  const response = await fetch(
    `${BACKEND_URL}/api/stripe/checkout-status/${encodeURIComponent(sessionId)}`
  );
  if (!response.ok) throw new Error("Failed to fetch checkout status");
  return response.json();
}

// Poll for payment status (max 5 attempts, 2s apart)
export async function pollCheckoutStatus(sessionId, onUpdate, maxAttempts = 5) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const data = await getCheckoutStatus(sessionId);
      if (data.payment_status === "paid") {
        onUpdate({ state: "paid", data });
        return;
      }
      if (data.status === "expired") {
        onUpdate({ state: "expired", data });
        return;
      }
      onUpdate({ state: "pending", data });
    } catch (err) {
      onUpdate({ state: "error", error: err.message });
      return;
    }
    attempts += 1;
    await new Promise((r) => setTimeout(r, 2000));
  }
  onUpdate({ state: "timeout" });
}
