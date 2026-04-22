/**
 * Central configuration for platform redirect URLs and pricing tier mapping.
 * Keep this as the single source of truth — never hardcode these elsewhere.
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
    url: "https://quantro-os.emergent.host/dashboard",
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
    // TODO: replace with the real Flow dashboard URL once deployed
    url: null,
    accent: "#A020FF",
    available: false,
  },
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
