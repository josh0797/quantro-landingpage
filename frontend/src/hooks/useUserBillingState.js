import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Valid billing/auth states.
 * This is currently MOCKED via URL param (?userState=...) or localStorage
 * until Supabase auth is wired. Centralising the contract here means the
 * switchover later is a single-file change inside this hook.
 */
export const VALID_STATES = [
  "not_logged",        // default: anonymous visitor
  "trial_active",      // paid $1 trial, trial window open
  "active_subscription", // active recurring plan
  "expired",           // payment failed / card expired / subscription lapsed
];

const STORAGE_KEY = "quantro_user_state";

/**
 * Returns the current billing state.
 * Precedence: URL param > localStorage > default ("not_logged")
 */
export const useUserBillingState = () => {
  const location = useLocation();

  return useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      const fromUrl = params.get("userState");
      if (fromUrl && VALID_STATES.includes(fromUrl)) {
        try {
          localStorage.setItem(STORAGE_KEY, fromUrl);
        } catch {
          /* storage may be unavailable */
        }
        return fromUrl;
      }
      const fromStorage = localStorage.getItem(STORAGE_KEY);
      if (fromStorage && VALID_STATES.includes(fromStorage)) return fromStorage;
    } catch {
      /* SSR / locked storage — fall through */
    }
    return "not_logged";
  }, [location.search]);
};

/**
 * Resolves the CTA definition for a given state + language.
 * type is a hint for the caller:
 *   - "stripe": trigger the Stripe checkout flow
 *   - "app"   : open the app (external URL)
 *   - "billing": (future) open customer portal — currently routes to Stripe too
 */
export const getCTAForState = (state, lang = "es", { source = "cta" } = {}) => {
  const isEs = lang === "es";
  const APP_URL = "https://app.quantroos.com";

  switch (state) {
    case "active_subscription":
      return {
        label: isEs ? "Ir al sistema" : "Open app",
        short: isEs ? "Ir al sistema" : "Open app",
        type: "app",
        href: APP_URL,
        source: `${source}_app`,
        variant: "primary",
      };
    case "trial_active":
      return {
        label: isEs ? "Ir al sistema" : "Open app",
        short: isEs ? "Ir al sistema" : "Open app",
        type: "app",
        href: APP_URL,
        source: `${source}_trial`,
        variant: "primary",
      };
    case "expired":
      return {
        label: isEs ? "Actualizar pago" : "Update payment",
        short: isEs ? "Actualizar pago" : "Update payment",
        type: "billing",
        source: `${source}_expired`,
        variant: "warning",
      };
    case "not_logged":
    default:
      return {
        label: isEs ? "Comenzar" : "Get Started",
        short: isEs ? "Comenzar" : "Get Started",
        type: "stripe",
        source,
        variant: "primary",
      };
  }
};
