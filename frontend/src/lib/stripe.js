import { supabase } from "./supabase";
import { resolvePriceId } from "./platformRoutes";

/**
 * Checkout flow for Quantro.
 *
 * Architecture:
 *   Frontend → Supabase Edge Function `create-checkout-session`
 *              → Stripe Checkout
 *              → Stripe → Supabase Edge Function `stripe-webhook`
 *              → Supabase `profiles.plan` is updated (source of truth)
 *              → Frontend refreshes `profiles` on return
 *
 * The frontend NEVER implements billing logic — it only kicks off the
 * checkout and reads `profiles` afterwards.
 */

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const CHECKOUT_ENDPOINT = `${SUPABASE_URL}/functions/v1/create-checkout-session`;

/**
 * Start a Stripe checkout through the Supabase Edge Function.
 *
 * @param {Object}  opts
 * @param {string}  opts.plan           - 'essential' | 'pro' | 'enterprise'
 * @param {string}  opts.billingCycle   - 'monthly' | 'annual'
 * @param {string}  opts.email          - optional customer email
 * @param {string}  opts.language       - 'es' | 'en' — forwarded as locale
 * @param {string}  opts.origin         - override for success/cancel URL origin
 *
 * @throws Error if the plan/billing combo is invalid or the function errors.
 * Redirects the browser to Stripe on success. Never returns on the happy path.
 */
export async function startStripeCheckout({
  plan,
  billingCycle = "monthly",
  email = null,
  language = "es",
  origin = null,
} = {}) {
  const priceId = resolvePriceId(plan, billingCycle);
  if (!priceId) {
    throw new Error(
      `[stripe] No priceId configured for plan=${plan} cycle=${billingCycle}`
    );
  }

  const baseOrigin = origin || window.location.origin;
  const successUrl = `${baseOrigin}/?checkout=success`;
  const cancelUrl = `${baseOrigin}/?checkout=cancel`;

  // Forward the user's session token so the Edge Function can (optionally)
  // resolve auth.uid() on its end. We always include the anon key for
  // Supabase-authenticated routing through the gateway.
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;

  const headers = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
  };

  const body = {
    priceId,
    successUrl,
    cancelUrl,
    locale: language === "en" ? "en" : "es",
    customerEmail: email || sessionData?.session?.user?.email || undefined,
  };

  const response = await fetch(CHECKOUT_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      /* ignore */
    }
    throw new Error(
      `Failed to create checkout session (${response.status}): ${detail || response.statusText}`
    );
  }

  const data = await response.json();
  if (!data?.url) {
    throw new Error("No checkout URL received from create-checkout-session");
  }

  window.location.href = data.url;
}
