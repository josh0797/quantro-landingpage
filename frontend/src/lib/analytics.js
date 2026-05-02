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

// ─────────────────────────────────────────────────────────────────────────
// Section-depth tracking
// Fires `section_view` the first time each landing section comes into view,
// plus `scroll_depth_section` with the deepest section reached (dispatched
// once when the tab is hidden / unloaded). Reading `section_view` as a
// funnel in GA4 shows exactly what % of visitors reach each stage
// (hero → problem → pricing → faq).
// ─────────────────────────────────────────────────────────────────────────
export const trackSectionView = ({ section, index, total }) => {
  gtag("event", "section_view", {
    event_category: "engagement",
    section_id: section,
    section_index: index,
    section_total: total,
    section_pct: total ? Math.round(((index + 1) / total) * 100) : undefined,
  });
};

export const trackMaxSectionDepth = ({ section, index, total }) => {
  gtag("event", "scroll_depth_section", {
    event_category: "engagement",
    section_id: section,
    section_index: index,
    section_total: total,
    section_pct: total ? Math.round(((index + 1) / total) * 100) : undefined,
  });
};
