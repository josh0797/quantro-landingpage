import React from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

/**
 * Plan picker panel — only used when the flow was triggered from Pricing
 * (intent.tier set) and the user needs to confirm a tier before Stripe.
 */

const buildTiers = (isEs) => [
  {
    key: "essential",
    plan: "essential",
    name: "Essential",
    price: "$59",
    period: isEs ? "/mes" : "/mo",
    tagline: isEs ? "Deja el caos atrás y gana claridad" : "Leave the chaos behind",
    features: isEs
      ? ["Automatizaciones básicas", "Dashboard esencial", "Agentes IA básicos"]
      : ["Basic automations", "Essential dashboard", "Basic AI agents"],
    highlighted: false,
    accent: "#94A3B8",
  },
  {
    key: "pro",
    plan: "pro",
    name: "Pro",
    price: "$209",
    period: isEs ? "/mes" : "/mo",
    tagline: isEs ? "Escala con inteligencia, no con esfuerzo" : "Scale with intelligence",
    features: isEs
      ? ["Quantro OS + Flow completos", "Quantro Intelligence activo", "Multiusuario · 3 asientos"]
      : ["Full Quantro OS + Flow", "Quantro Intelligence active", "Multi-user · 3 seats"],
    highlighted: true,
    accent: "#00F5FF",
  },
  {
    key: "enterprise",
    plan: "enterprise",
    name: "Enterprise",
    price: "$499",
    period: isEs ? "/mes" : "/mo",
    tagline: isEs
      ? "Automatización y control en su máxima expresión"
      : "Automation and control at their peak",
    features: isEs
      ? ["Todo en Pro", "Quantro Revenue", "Multiusuario · 10 asientos"]
      : ["Everything in Pro", "Quantro Revenue", "Multi-user · 10 seats"],
    highlighted: false,
    accent: "#C084FC",
  },
];

export const ChoosePlanPanel = ({ isEs, onPickTier, loading }) => {
  const tiers = buildTiers(isEs);

  return (
    <div className="grid sm:grid-cols-3 gap-3" data-testid="platform-choose-plan-panel">
      {tiers.map((tier) => (
        <motion.button
          key={tier.key}
          type="button"
          onClick={() => onPickTier(tier)}
          disabled={loading}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className={`relative rounded-xl p-4 text-left transition-all disabled:opacity-60 ${
            tier.highlighted ? "ring-1" : ""
          }`}
          style={{
            background:
              "linear-gradient(160deg, rgba(12,18,34,0.88), rgba(5,10,24,0.78))",
            border: `1px solid ${tier.accent}${tier.highlighted ? "55" : "28"}`,
            boxShadow: tier.highlighted ? `0 16px 40px -18px ${tier.accent}88` : "none",
          }}
          data-testid={`platform-plan-${tier.plan}`}
        >
          {tier.highlighted && (
            <span
              className="absolute -top-2 left-4 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase"
              style={{
                background: "linear-gradient(90deg, #00F5FF, #22D3EE)",
                color: "#0A0F1C",
              }}
            >
              {isEs ? "Recomendado" : "Recommended"}
            </span>
          )}
          <div
            className="text-[10px] font-semibold tracking-wider uppercase mb-0.5"
            style={{ color: tier.accent }}
          >
            {tier.name}
          </div>
          <div className="text-[11px] text-slate-400 leading-snug mb-3">{tier.tagline}</div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="font-satoshi font-bold text-2xl text-white tabular-nums">
              {tier.price}
            </span>
            <span className="text-[10px] text-slate-500">{tier.period}</span>
          </div>
          <ul className="space-y-1.5 mb-3">
            {tier.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-snug"
              >
                <Check
                  size={11}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: tier.accent }}
                />
                {f}
              </li>
            ))}
          </ul>
          <div
            className="text-[11px] font-medium text-center py-1.5 rounded-md"
            style={{
              background: tier.highlighted
                ? "linear-gradient(90deg, #00F5FF, #22D3EE)"
                : "rgba(148,163,184,0.06)",
              color: tier.highlighted ? "#0A0F1C" : "#E2E8F0",
              border: tier.highlighted ? "none" : "1px solid rgba(148,163,184,0.12)",
            }}
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin inline" />
            ) : isEs ? (
              "Empezar por $1"
            ) : (
              "Start for $1"
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ChoosePlanPanel;
