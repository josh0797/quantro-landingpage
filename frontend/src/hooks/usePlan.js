import { useMemo } from "react";
import { useUserBillingState } from "./useUserBillingState";

/**
 * usePlan — thin wrapper over useUserBillingState that also exposes per-plan
 * feature limits. Used by UpgradeScreen and any gate-able component.
 *
 * Limits are intentionally conservative MVP defaults. Tune as product matures.
 */

export const PLAN_LIMITS = {
  essential: {
    label: "Starter",
    tagline_es: "Ordena tu operación",
    tagline_en: "Organize your operation",
    seats: 1,
    ai_agents: 3,
    ai_runs_monthly: 200,
    automations: 5,
    has_revenue: false,
    has_intelligence: false,
  },
  pro: {
    label: "Pro",
    tagline_es: "Tu negocio avanza solo",
    tagline_en: "Your business moves on its own",
    seats: 3,
    ai_agents: 12,
    ai_runs_monthly: 2000,
    automations: 50,
    has_revenue: false,
    has_intelligence: true,
  },
  enterprise: {
    label: "Scale",
    tagline_es: "Optimización continua",
    tagline_en: "Continuous optimization",
    seats: 10,
    ai_agents: -1, // unlimited
    ai_runs_monthly: -1,
    automations: -1,
    has_revenue: true,
    has_intelligence: true,
  },
};

const RANK = { essential: 1, pro: 2, enterprise: 3 };

export const isPlanAtLeast = (plan, required) => {
  if (!plan || !required) return false;
  return (RANK[plan] ?? 0) >= (RANK[required] ?? 0);
};

export const usePlan = () => {
  const base = useUserBillingState();
  const limits = useMemo(
    () => (base.plan ? PLAN_LIMITS[base.plan] : null),
    [base.plan]
  );

  const can = useMemo(
    () => ({
      useIntelligence: !!limits?.has_intelligence,
      useRevenue: !!limits?.has_revenue,
      inviteSeats: limits ? (limits.seats === -1 ? Infinity : limits.seats) : 0,
      runAgents: limits
        ? limits.ai_agents === -1
          ? Infinity
          : limits.ai_agents
        : 0,
    }),
    [limits]
  );

  return {
    ...base,
    limits,
    can,
    isAtLeast: (required) => isPlanAtLeast(base.plan, required),
  };
};
