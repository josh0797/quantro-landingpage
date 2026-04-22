/**
 * Persist the user's multi-step intent across page reloads / Stripe checkout
 * redirects so we can resume the flow after they return from Stripe.
 *
 * Storage key: sessionStorage.quantro_checkout_intent
 * Shape:
 *   {
 *     platform: 'os' | 'flow' | null,  // platform they were trying to enter
 *     tier: 'starter' | 'pro' | 'scale' | null,
 *     plan: 'essential' | 'pro' | 'enterprise' | null,
 *     billing_cycle: 'monthly' | 'annual' | null,
 *     createdAt: ISO string
 *   }
 */

const KEY = "quantro_checkout_intent";

export const saveIntent = (intent) => {
  try {
    const payload = { ...intent, createdAt: new Date().toISOString() };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* sessionStorage unavailable (private mode) — no-op */
  }
};

export const loadIntent = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Expire after 1h — stale intents should not hijack the UX
    const age = Date.now() - new Date(parsed.createdAt).getTime();
    if (Number.isFinite(age) && age > 60 * 60 * 1000) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearIntent = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
};

export const patchIntent = (patch) => {
  const current = loadIntent() || {};
  saveIntent({ ...current, ...patch });
};
