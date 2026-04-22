import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { deriveBillingState, hasActivePlan, needsOnboarding } from "../lib/billingGuards";
import { VALID_PLANS } from "../lib/platformRoutes";

/**
 * Real Supabase-backed billing/auth state hook.
 *
 * Reads from auth.session + profiles table and derives everything the rest
 * of the app needs. No URL params. No mocks.
 *
 * Shape returned:
 *   session, user, profile, plan, billingCycle,
 *   isAuthenticated, hasPaidPlan, needsOnboarding,
 *   isLoading, error, billingState, refresh()
 *
 * Secondary contract: this hook ALSO exports legacy CTA helpers so existing
 * consumers (Navbar, Pricing) keep working without touching their imports.
 */

const PROFILE_COLUMNS =
  "id, email, company_name, industry, language, plan, billing_cycle, stripe_customer_id, stripe_subscription_id, plan_updated_at";

const fetchProfile = async (userId) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("[useUserBillingState] fetchProfile error:", error.message);
    return null;
  }
  // Normalise plan to lowercase and validate
  if (data && data.plan && !VALID_PLANS.includes(data.plan)) {
    return { ...data, plan: null };
  }
  return data;
};

export const useUserBillingState = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const applySession = useCallback(async (nextSession) => {
    if (!mounted.current) return;
    setSession(nextSession || null);
    if (!nextSession?.user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    try {
      const p = await fetchProfile(nextSession.user.id);
      if (!mounted.current) return;
      setProfile(p);
    } catch (err) {
      if (!mounted.current) return;
      setError(err);
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await applySession(data?.session || null);
  }, [applySession]);

  useEffect(() => {
    mounted.current = true;

    // Bootstrap session on mount
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        await applySession(data?.session || null);
      } catch (err) {
        if (mounted.current) {
          setError(err);
          setIsLoading(false);
        }
      }
    })();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession || null);
    });

    return () => {
      mounted.current = false;
      subscription?.unsubscribe?.();
    };
  }, [applySession]);

  const user = session?.user ?? null;
  const isAuthenticated = !!session && !!user;
  const paid = hasActivePlan(profile);
  const billingState = deriveBillingState({ session, profile });

  return {
    session,
    user,
    profile,
    plan: profile?.plan ?? null,
    billingCycle: profile?.billing_cycle ?? null,
    isAuthenticated,
    hasPaidPlan: paid,
    needsOnboarding: isAuthenticated && needsOnboarding(profile),
    isLoading,
    error,
    billingState, // 'not_logged' | 'active_subscription' | 'expired'
    refresh,
  };
};

/**
 * Backwards-compatible CTA label resolver.
 * Kept here so legacy imports (`getCTAForState`) keep working unchanged.
 */
export const getCTAForState = (state, lang = "es", { source = "cta" } = {}) => {
  const isEs = lang === "es";
  switch (state) {
    case "active_subscription":
    case "trial_active":
      return {
        label: isEs ? "Ir al sistema" : "Open app",
        type: "platform_access",
        source: `${source}_logged_in`,
        variant: "primary",
      };
    case "expired":
      return {
        label: isEs ? "Actualizar pago" : "Update payment",
        type: "platform_access",
        source: `${source}_expired`,
        variant: "warning",
      };
    case "not_logged":
    default:
      return {
        label: isEs ? "Comenzar" : "Get Started",
        type: "platform_access",
        source,
        variant: "primary",
      };
  }
};
