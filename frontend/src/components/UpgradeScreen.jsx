import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { usePlan, PLAN_LIMITS, isPlanAtLeast } from "../hooks/usePlan";
import { usePlatformAccess } from "../hooks/usePlatformAccess";

/**
 * UpgradeScreen — premium modal shown when a feature is gated above the
 * user's current plan. Consumed via:
 *
 *   const [open, setOpen] = useState(false);
 *   <UpgradeScreen open={open} onClose={...} requiredPlan="pro" feature="..." />
 *
 * It compares current vs required plan, lists what unlocks, and drops the
 * user back into the PlatformAccessScreen so they can upgrade through the
 * existing auth + checkout flow.
 */

const TIER_ORDER = ["essential", "pro", "enterprise"];

const DiffPill = ({ current, required, lang }) => {
  const currentLabel = current ? PLAN_LIMITS[current]?.label : lang === "es" ? "Sin plan" : "No plan";
  const requiredLabel = PLAN_LIMITS[required]?.label || required;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span
        className="px-2 py-0.5 rounded-full border"
        style={{
          borderColor: "rgba(148,163,184,0.2)",
          color: "#94A3B8",
          background: "rgba(148,163,184,0.05)",
        }}
      >
        {currentLabel}
      </span>
      <ArrowUpRight size={12} className="text-slate-500" />
      <span
        className="px-2 py-0.5 rounded-full font-semibold"
        style={{
          background: "linear-gradient(90deg, #00F5FF, #22D3EE)",
          color: "#0A0F1C",
        }}
      >
        {requiredLabel}
      </span>
    </div>
  );
};

export const UpgradeScreen = ({ open, onClose, requiredPlan = "pro", feature = null }) => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const { plan } = usePlan();
  const { open: openPlatformAccess } = usePlatformAccess();

  if (!open) return null;

  const requiredLimits = PLAN_LIMITS[requiredPlan] || PLAN_LIMITS.pro;
  const currentLimits = plan ? PLAN_LIMITS[plan] : null;

  // Compute deltas to highlight what's new
  const rows = [
    {
      k: isEs ? "Asientos" : "Seats",
      cur: currentLimits?.seats ?? 0,
      next: requiredLimits.seats,
    },
    {
      k: isEs ? "Agentes IA" : "AI Agents",
      cur: currentLimits?.ai_agents ?? 0,
      next: requiredLimits.ai_agents,
    },
    {
      k: isEs ? "Automatizaciones" : "Automations",
      cur: currentLimits?.automations ?? 0,
      next: requiredLimits.automations,
    },
    {
      k: "Quantro Intelligence",
      cur: currentLimits?.has_intelligence ? "✓" : "—",
      next: requiredLimits.has_intelligence ? "✓" : "—",
    },
    {
      k: "Quantro Revenue",
      cur: currentLimits?.has_revenue ? "✓" : "—",
      next: requiredLimits.has_revenue ? "✓" : "—",
    },
  ];

  const fmt = (v) => (v === -1 ? (isEs ? "Ilimitado" : "Unlimited") : String(v));

  const alreadyUnlocked = isPlanAtLeast(plan, requiredPlan);

  const handleUpgrade = () => {
    onClose?.();
    openPlatformAccess();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        style={{
          background: "rgba(3, 7, 18, 0.88)",
          backdropFilter: "blur(10px)",
        }}
        data-testid="upgrade-screen"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #070D1C 0%, #050A18 100%)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
            boxShadow:
              "0 40px 80px -20px rgba(0, 0, 0, 0.8), 0 0 80px -10px rgba(0, 245, 255, 0.15)",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={isEs ? "Cerrar" : "Close"}
            data-testid="upgrade-close"
          >
            <X size={16} />
          </button>

          <div className="p-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/[0.06] mb-4">
              <Sparkles size={11} className="text-[#00F5FF]" />
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#00F5FF]">
                {isEs ? "Mejora tu plan" : "Upgrade"}
              </span>
            </div>

            <h3 className="font-satoshi font-bold text-2xl text-white leading-tight tracking-tight mb-1">
              {feature
                ? isEs
                  ? `Desbloquea ${feature}`
                  : `Unlock ${feature}`
                : isEs
                ? "Desbloquea más poder"
                : "Unlock more power"}
            </h3>
            <p className="text-[12px] text-slate-400 mb-4 max-w-sm">
              {alreadyUnlocked
                ? isEs
                  ? "Tu plan ya incluye esta función."
                  : "Your current plan already includes this."
                : isEs
                ? "Cambia a un plan superior y desbloquea estas capacidades."
                : "Move to a higher plan and unlock these capabilities."}
            </p>

            <div className="mb-4">
              <DiffPill current={plan} required={requiredPlan} lang={language} />
            </div>

            <div
              className="rounded-xl overflow-hidden mb-5"
              style={{
                background: "rgba(148,163,184,0.03)",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <div
                className="grid text-[9px] font-semibold tracking-wider uppercase text-slate-600 px-4 py-2"
                style={{
                  gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
                  borderBottom: "1px solid rgba(148,163,184,0.08)",
                }}
              >
                <span />
                <span>{isEs ? "Actual" : "Current"}</span>
                <span>{PLAN_LIMITS[requiredPlan]?.label}</span>
              </div>
              {rows.map((row, i) => (
                <div
                  key={row.k}
                  className="grid items-center px-4 py-2 text-[11px]"
                  style={{
                    gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
                    borderBottom:
                      i < rows.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none",
                  }}
                >
                  <span className="text-slate-400">{row.k}</span>
                  <span className="text-slate-500 tabular-nums">
                    {typeof row.cur === "number" ? fmt(row.cur) : row.cur}
                  </span>
                  <span className="text-white font-semibold tabular-nums flex items-center gap-1">
                    {typeof row.next === "number" ? fmt(row.next) : row.next}
                    {row.next !== row.cur && (
                      <Check size={11} className="text-[#00F5FF]" />
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg text-[12px] font-medium text-slate-300 transition-colors"
                style={{
                  background: "rgba(148,163,184,0.05)",
                  border: "1px solid rgba(148,163,184,0.15)",
                }}
                data-testid="upgrade-later"
              >
                {isEs ? "Más tarde" : "Maybe later"}
              </button>
              <button
                type="button"
                onClick={handleUpgrade}
                className="flex-[1.4] py-2.5 rounded-lg text-[12px] font-semibold bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all"
                data-testid="upgrade-cta"
              >
                {alreadyUnlocked
                  ? isEs
                    ? "Ir a Quantro OS"
                    : "Open Quantro OS"
                  : isEs
                  ? `Cambiar a ${requiredLimits.label}`
                  : `Upgrade to ${requiredLimits.label}`}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradeScreen;
