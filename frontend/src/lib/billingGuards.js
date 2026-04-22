import { VALID_PLANS } from "./platformRoutes";

/**
 * Pure, deterministic business rules. No side effects. No React.
 * Consumed by useUserBillingState, PlatformAccessScreen, Navbar, PricingSection.
 *
 * Sources of truth are provided by the caller (typically from Supabase profiles).
 */

export const hasActivePlan = (profile) => {
  if (!profile) return false;
  return VALID_PLANS.includes(profile.plan);
};

export const needsOnboarding = (profile) => {
  // Onboarding lives in Quantro OS itself (per product decision).
  // Here we only flag it so Flow can route accordingly when relevant.
  if (!profile) return false;
  return !profile.company_name || !profile.industry;
};

/**
 * Decide the next step the user should see given (session, profile, intent).
 * Intent is an object like { platform: 'os' | 'flow' | null } optionally set
 * when the user chose a platform before auth.
 *
 * Possible outputs:
 *   'choose_platform' — show platform picker
 *   'auth'            — user must log in / sign up
 *   'choose_plan'     — authenticated but no plan yet
 *   'onboarding'      — authenticated + plan, but missing company/industry (OS will handle it)
 *   'redirect'        — fully ready, send to the platform URL
 */
export const resolveNextStep = ({ session, profile, intent }) => {
  if (!intent?.platform) return "choose_platform";
  if (!session) return "auth";
  if (!hasActivePlan(profile)) return "choose_plan";
  if (needsOnboarding(profile)) return "onboarding";
  return "redirect";
};

export const canEnterPlatform = ({ session, profile, platformId }) => {
  if (!session || !profile) return false;
  if (!hasActivePlan(profile)) return false;
  if (!platformId) return false;
  return true;
};

export const getCTACopy = (state, lang = "es") => {
  const isEs = lang === "es";
  switch (state) {
    case "active_subscription":
    case "trial_active":
      return isEs ? "Ir al sistema" : "Open app";
    case "expired":
      return isEs ? "Actualizar pago" : "Update payment";
    case "not_logged":
    default:
      return isEs ? "Comenzar" : "Get Started";
  }
};

/**
 * Simplified billing state label for Navbar / Pricing consumers.
 * Purely derived from the profile shape — no URL params involved.
 */
export const deriveBillingState = ({ session, profile }) => {
  if (!session) return "not_logged";
  if (!hasActivePlan(profile)) return "not_logged";
  // Flag explicit expiration if stripe_subscription_id is null but plan exists
  if (profile?.plan && !profile?.stripe_subscription_id) return "expired";
  return "active_subscription";
};
