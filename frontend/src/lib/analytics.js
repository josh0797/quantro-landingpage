// GA4 Event Tracking
// Safe wrappers — no-op gracefully if gtag isn't loaded yet (ad-blocker, preview env, etc.)

const gtag = (...args) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

// Generic CTA click (existing)
export const trackCTAClick = (ctaLocation) => {
  gtag("event", "cta_click", {
    event_category: "engagement",
    event_label: ctaLocation,
    cta_text: "Start Free Trial",
  });
};

// Stripe checkout funnel
// Fires right before we redirect the user to Stripe Checkout
export const trackCheckoutStarted = ({ packageId, source, amount = 1.0, currency = "usd" } = {}) => {
  gtag("event", "checkout_started", {
    event_category: "ecommerce",
    package_id: packageId,
    source,
    value: amount,
    currency: currency.toUpperCase(),
  });

  // Also emit the GA4 standard `begin_checkout` for better out-of-the-box funnel reports
  gtag("event", "begin_checkout", {
    currency: currency.toUpperCase(),
    value: amount,
    items: [
      {
        item_id: packageId,
        item_name: packageId,
        price: amount,
        quantity: 1,
      },
    ],
  });
};

// Fires after we verify Stripe marked the session as paid (from PaymentReturnModal polling)
export const trackCheckoutPaid = ({ sessionId, amount = 1.0, currency = "usd" } = {}) => {
  gtag("event", "checkout_paid", {
    event_category: "ecommerce",
    session_id: sessionId,
    value: amount,
    currency: currency.toUpperCase(),
  });

  gtag("event", "purchase", {
    transaction_id: sessionId,
    value: amount,
    currency: currency.toUpperCase(),
    items: [
      {
        item_id: "trial_1usd",
        item_name: "Quantro Trial Access",
        price: amount,
        quantity: 1,
      },
    ],
  });
};

// Fires when user lands back with ?payment=cancel
export const trackCheckoutCancelled = ({ sessionId } = {}) => {
  gtag("event", "checkout_cancelled", {
    event_category: "ecommerce",
    session_id: sessionId,
  });
};
