import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUserBillingState } from "./useUserBillingState";

/**
 * usePlan — wraps useUserBillingState with per-plan feature limits AND
 * real-time monthly usage from Supabase `public.ai_usage`.
 *
 *   ai_usage (
 *     user_id uuid not null,
 *     month   text not null,     -- 'YYYY-MM'
 *     type    text not null,     -- e.g. 'agent_runs', 'ai_requests', 'automations'
 *     count   integer not null default 0
 *   )
 *
 * Usage rows are SUM'd by type — tolerant to multiple rows per tuple.
 * Limits come from PLAN_LIMITS; -1 means unlimited.
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
    ai_agents: -1,
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

const currentMonth = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

const EMPTY_USAGE = { agent_runs: 0, ai_requests: 0, automations: 0 };

export const usePlan = () => {
  const base = useUserBillingState();
  const userId = base?.user?.id ?? null;
  const [usage, setUsage] = useState(EMPTY_USAGE);
  const [usageLoading, setUsageLoading] = useState(false);
  const mounted = useRef(true);

  const fetchUsage = useCallback(async () => {
    if (!userId) {
      setUsage(EMPTY_USAGE);
      return;
    }
    setUsageLoading(true);
    try {
      const { data, error } = await supabase
        .from("ai_usage")
        .select("type, count")
        .eq("user_id", userId)
        .eq("month", currentMonth());

      if (error) {
        // eslint-disable-next-line no-console
        console.warn("[usePlan] ai_usage fetch error:", error.message);
        if (mounted.current) setUsage(EMPTY_USAGE);
        return;
      }

      const totals = { ...EMPTY_USAGE };
      for (const row of data || []) {
        const key = row?.type;
        const val = Number(row?.count) || 0;
        if (!key) continue;
        totals[key] = (totals[key] || 0) + val;
      }
      if (mounted.current) setUsage(totals);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[usePlan] ai_usage exception:", err);
      if (mounted.current) setUsage(EMPTY_USAGE);
    } finally {
      if (mounted.current) setUsageLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    mounted.current = true;
    fetchUsage();
    return () => {
      mounted.current = false;
    };
  }, [fetchUsage]);

  const limits = useMemo(
    () => (base.plan ? PLAN_LIMITS[base.plan] : null),
    [base.plan]
  );

  const remaining = useMemo(() => {
    if (!limits) return { ai_runs_monthly: 0, automations: 0, ai_agents: 0 };
    const rem = (limit, used) => (limit === -1 ? Infinity : Math.max(0, limit - used));
    return {
      ai_runs_monthly: rem(limits.ai_runs_monthly, usage.ai_requests),
      automations: rem(limits.automations, usage.automations),
      ai_agents: rem(limits.ai_agents, usage.agent_runs),
    };
  }, [limits, usage]);

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
      runMoreAgents: remaining.ai_agents > 0,
      runMoreAiRequests: remaining.ai_runs_monthly > 0,
      runMoreAutomations: remaining.automations > 0,
    }),
    [limits, remaining]
  );

  return {
    ...base,
    limits,
    usage,
    remaining,
    usageLoading,
    can,
    refreshUsage: fetchUsage,
    isAtLeast: (required) => isPlanAtLeast(base.plan, required),
  };
};
