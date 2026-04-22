/**
 * Central configuration for platform URLs, Stripe price IDs and pricing
 * tier ↔ internal plan mapping.
 * Single source of truth — never hardcode these values elsewhere.
 */

export const PLATFORMS = {
  os: {
    id: "os",
    name: "Quantro OS",
    tagline: {
      es: "Inteligencia del negocio",
      en: "Business intelligence",
    },
    description: {
      es: "Scorecard, Rocks, Agentes IA, decisiones claras y plan de acción diario.",
      en: "Scorecard, Rocks, AI Agents, clear decisions and daily action plan.",
    },
    url: "https://konta-seven.vercel.app",
    accent: "#00F5FF",
    available: true,
  },
  flow: {
    id: "flow",
    name: "Quantro Flow",
    tagline: {
      es: "Ejecución automática",
      en: "Automated execution",
    },
    description: {
      es: "Inbox unificado, CRM, seguimiento y automatización que ejecuta por ti.",
      en: "Unified inbox, CRM, follow-ups and automation that executes for you.",
    },
    url: "https://quantro-os.emergent.host/dashboard",
    accent: "#A020FF",
    available: true,
  },
};

/**
 * Stripe price IDs — consumed by the Supabase Edge Function
 * `create-checkout-session` which reads `priceId` from the request body.
 * The Edge Function + `stripe-webhook` are the sole authorities here.
 */
export const STRIPE_PRICE_IDS = {
  essential: {
    monthly: "price_1TL8xMLJrc96wcWHzaaHtUOL",
    annual: "price_1TL8xMLJrc96wcWHNYnS8VhY",
  },
  pro: {
    monthly: "price_1TL9BeLJrc96wcWHTspVOqBT",
    annual: "price_1TL9BeLJrc96wcWHi8ajKg7L",
  },
  enterprise: {
    monthly: "price_1TL9HOLJrc96wcWHvp7LTLS2",
    annual: "price_1TL9HOLJrc96wcWHxt5fDHWe",
  },
};

export const resolvePriceId = (plan, billingCycle = "monthly") => {
  const planPrices = STRIPE_PRICE_IDS[plan];
  if (!planPrices) return null;
  return planPrices[billingCycle] || planPrices.monthly || null;
};

/**
 * Visual Pricing tier → internal plan identifier stored in profiles.plan.
 * profiles.plan ∈ { 'essential' | 'pro' | 'enterprise' | null }
 */
export const PRICING_TIER_TO_PLAN = {
  starter: "essential",
  pro: "pro",
  scale: "enterprise",
};

export const PLAN_TO_PRICING_TIER = {
  essential: "starter",
  pro: "pro",
  enterprise: "scale",
};

export const VALID_PLANS = ["essential", "pro", "enterprise"];
export const VALID_BILLING_CYCLES = ["monthly", "annual"];

export const getPlatformRedirectUrl = (platformId) => {
  const platform = PLATFORMS[platformId];
  return platform?.url ?? null;
};

export const mapTierToPlan = (tierKey) => PRICING_TIER_TO_PLAN[tierKey] ?? null;
export const mapPlanToTier = (plan) => PLAN_TO_PRICING_TIER[plan] ?? null;
