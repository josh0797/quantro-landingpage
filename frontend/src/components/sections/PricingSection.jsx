import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { startStripeCheckout } from "../../lib/stripe";
import { trackCTAClick, trackCheckoutStarted } from "../../lib/analytics";

const AnimatedPrice = ({ value }) => (
  <AnimatePresence mode="wait">
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="font-satoshi font-bold text-5xl text-white tabular-nums"
    >
      {value}
    </motion.span>
  </AnimatePresence>
);

export const PricingSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [billing, setBilling] = useState("monthly"); // 'monthly' | 'annual'
  const isAnnual = billing === "annual";

  const tiers = [
    {
      key: "starter",
      name: "Starter",
      tagline: isEs ? "Ordena tu operación" : "Organize your operation",
      prices: { monthly: "$59", annual: "$590" },
      periodSuffix: { monthly: isEs ? "/mes" : "/mo", annual: isEs ? "/año" : "/yr" },
      description: isEs
        ? "Para emprendedores que quieren dejar el caos y empezar a operar con claridad."
        : "For entrepreneurs who want to leave chaos behind and operate with clarity.",
      features: [
        isEs ? "Automatizaciones básicas" : "Basic automations",
        isEs ? "Dashboard esencial" : "Essential dashboard",
        isEs ? "Agentes IA (consultas al mes)" : "AI Agents (monthly queries)",
        isEs ? "Contabilidad · facturas timbradas" : "Accounting · stamped invoices",
      ],
      highlighted: false,
      accent: "#94A3B8",
    },
    {
      key: "pro",
      name: "Pro",
      tagline: isEs ? "Tu negocio empieza a avanzar solo" : "Your business starts moving on its own",
      prices: { monthly: "$209", annual: "$2,090" },
      periodSuffix: { monthly: isEs ? "/mes" : "/mo", annual: isEs ? "/año" : "/yr" },
      description: isEs
        ? "Para negocios o empresas que quieren crecer con decisiones claras y ejecución constante."
        : "For businesses that want to grow with clear decisions and constant execution.",
      features: [
        isEs ? "Todo en Starter" : "Everything in Starter",
        isEs ? "Flow · CRM + Inbox + seguimiento" : "Flow · CRM + Inbox + follow-up",
        isEs ? "Quantro OS completo · Scorecard, Rocks, decisiones" : "Full Quantro OS · Scorecard, Rocks, decisions",
        isEs ? "Quantro Intelligence activo" : "Quantro Intelligence active",
        isEs ? "Agentes IA ejecutando tareas" : "AI Agents executing tasks",
        isEs ? "Automatización avanzada" : "Advanced automation",
        isEs ? "Multiusuario · 3 asientos" : "Multi-user · 3 seats",
      ],
      highlighted: true,
      accent: "#00F5FF",
    },
    {
      key: "scale",
      name: "Scale",
      tagline: isEs ? "Un sistema que optimiza todo" : "A system that optimizes everything",
      prices: { monthly: "$499", annual: "$4,990" },
      periodSuffix: { monthly: isEs ? "/mes" : "/mo", annual: isEs ? "/año" : "/yr" },
      description: isEs
        ? "Para negocios que buscan optimización continua y ventaja competitiva."
        : "For businesses seeking continuous optimization and competitive edge.",
      features: [
        isEs ? "Todo en Pro" : "Everything in Pro",
        isEs ? "Inteligencia más frecuente y profunda" : "Deeper, more frequent intelligence",
        isEs ? "Quantro Revenue" : "Quantro Revenue",
        isEs ? "Automatizaciones personalizadas" : "Custom automations",
        isEs ? "Lean Management module" : "Lean Management module",
        isEs ? "Multiusuario · 10 asientos" : "Multi-user · 10 seats",
        isEs ? "Mayor capacidad de agentes" : "Higher agent capacity",
        isEs ? "Soporte prioritario" : "Priority support",
        isEs ? "Acceso prioritario a nuevas funciones" : "Early access to new features",
      ],
      highlighted: false,
      accent: "#C084FC",
    },
  ];

  const handleCtaClick = async (tier) => {
    trackCTAClick(`pricing_${tier.key}_${billing}`);
    trackCheckoutStarted({
      packageId: "trial_1usd",
      source: `pricing_${tier.key}_${billing}`,
    });
    try {
      await startStripeCheckout({ packageId: "trial_1usd" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatedSection
      id="pricing"
      className="py-28 px-6"
      data-testid="pricing-section"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(0,245,255,0.04) 0%, transparent 50%), #030712",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-4">
            {isEs ? "Activa Quantro en tu negocio." : "Turn Quantro on in your business."}
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
            {isEs
              ? "Empieza a operar como un sistema. Escala con inteligencia."
              : "Start operating as a system. Scale with intelligence."}
          </p>
        </motion.div>

        {/* Inclusion context strip */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center gap-2 mb-10 text-sm text-slate-400"
        >
          <Sparkles size={14} className="text-[#00F5FF]" />
          <span>
            {isEs
              ? "Quantro Flow + Intelligence disponible a partir del plan Pro."
              : "Quantro Flow + Intelligence available from the Pro plan."}
          </span>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          data-testid="pricing-billing-toggle"
        >
          <div className="relative inline-flex items-center bg-slate-900/60 border border-slate-800 rounded-full p-1">
            {[
              { key: "monthly", label: isEs ? "Mensual" : "Monthly" },
              { key: "annual", label: isEs ? "Anual" : "Annual" },
            ].map((option) => {
              const active = billing === option.key;
              return (
                <button
                  key={option.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setBilling(option.key)}
                  className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                    active ? "text-[#0A0F1C]" : "text-slate-300 hover:text-white"
                  }`}
                  data-testid={`billing-toggle-${option.key}`}
                >
                  {active && (
                    <motion.span
                      layoutId="billing-pill"
                      transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] rounded-full shadow-lg shadow-[#00F5FF]/20"
                    />
                  )}
                  <span className="relative">{option.label}</span>
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {isAnnual && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A020FF]/10 border border-[#A020FF]/30 text-[#C084FC] text-xs font-medium"
                data-testid="pricing-annual-badge"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
                {isEs ? "2 meses gratis" : "2 months free"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.key}
              variants={fadeInUp}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                tier.highlighted
                  ? "bg-gradient-to-br from-[#00F5FF]/[0.04] via-slate-900/60 to-[#A020FF]/[0.04] border-2 border-[#00F5FF]/40 lg:scale-[1.04] lg:-translate-y-2 shadow-2xl shadow-[#00F5FF]/10"
                  : "bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15]"
              }`}
              style={
                tier.highlighted
                  ? { backdropFilter: "blur(12px)" }
                  : { backdropFilter: "blur(6px)" }
              }
              data-testid={`pricing-tier-${i}`}
            >
              {/* Popular badge */}
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full text-[#0A0F1C]"
                    style={{
                      background: "linear-gradient(90deg, #00F5FF, #22D3EE)",
                      boxShadow: "0 0 20px -3px rgba(0, 245, 255, 0.6)",
                    }}
                  >
                    ⭐ {isEs ? "Más popular" : "Most popular"}
                  </span>
                </div>
              )}

              {/* Name + tagline */}
              <div className="mb-4">
                <h3 className="font-satoshi font-bold text-xl text-white tracking-tight">
                  {tier.name}
                </h3>
                <p
                  className="text-sm font-medium mt-1"
                  style={{ color: tier.accent }}
                >
                  {tier.tagline}
                </p>
              </div>

              {/* Price */}
              <div
                className="flex items-baseline gap-2 mb-5"
                data-testid={`pricing-price-${tier.key}`}
              >
                <AnimatedPrice value={tier.prices[billing]} />
                <span className="text-slate-500 text-sm">{tier.periodSuffix[billing]}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-6 min-h-[52px]">
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300 leading-snug">
                    <Check
                      size={15}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: tier.accent }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleCtaClick(tier)}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#00F5FF]/30"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                data-testid={`pricing-cta-${i}`}
              >
                {isEs ? "Empezar" : "Get started"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Key phrase */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <p className="font-satoshi font-medium text-xl sm:text-2xl text-slate-400 leading-tight">
            {isEs ? "No eliges más herramientas." : "You're not choosing more tools."}
          </p>
          <p className="font-satoshi font-semibold text-xl sm:text-2xl text-white leading-tight mt-1">
            {isEs
              ? "Eliges cómo quieres que funcione tu negocio."
              : "You're choosing how you want your business to work."}
          </p>
        </motion.div>

        {/* Global microcopy */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          {isEs
            ? "Sin configuración compleja. Empiezas en minutos."
            : "No complex setup. You start in minutes."}
        </motion.p>
      </div>
    </AnimatedSection>
  );
};

export default PricingSection;
