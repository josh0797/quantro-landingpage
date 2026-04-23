import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { useUserBillingState } from "../../hooks/useUserBillingState";
import { getCTACopy } from "../../lib/billingGuards";
import { usePlatformAccess } from "../../hooks/usePlatformAccess";
import { saveIntent } from "../../lib/checkoutResume";
import { trackCTAClick } from "../../lib/analytics";

const AnimatedPrice = ({ value, size = "md" }) => (
  <AnimatePresence mode="wait">
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`font-satoshi font-bold text-white tabular-nums ${
        size === "lg" ? "text-6xl" : "text-5xl"
      }`}
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
  const { billingState, plan: currentPlan, hasPaidPlan } = useUserBillingState();
  const { open: openPlatformAccess } = usePlatformAccess();

  const tiers = [
    {
      key: "essential",
      name: "Essential",
      tagline: isEs ? "Empieza con claridad y control" : "Start with clarity and control",
      prices: { monthly: "$59", annual: "$590" },
      periodSuffix: { monthly: isEs ? "/mes" : "/mo", annual: isEs ? "/año" : "/yr" },
      description: isEs
        ? "Para emprendedores que quieren dejar el caos y empezar a operar como sistema."
        : "For founders who want to leave chaos behind and start operating as a system.",
      features: [
        isEs ? "Quantro OS + Flow + Intelligence incluidos" : "Quantro OS + Flow + Intelligence included",
        isEs ? "Dashboard y scorecard en tiempo real" : "Real-time dashboard and scorecard",
        isEs ? "Inbox + CRM con seguimiento básico" : "Inbox + CRM with basic follow-up",
        isEs ? "Agentes IA (consultas mensuales limitadas)" : "AI Agents (limited monthly queries)",
        isEs ? "Automatizaciones esenciales" : "Essential automations",
        isEs ? "Contabilidad y facturación integrada" : "Integrated accounting and invoicing",
      ],
      highlighted: false,
      accent: "#94A3B8",
      microcopy: {
        type: "coupon",
        label: { es: "Utiliza el cupón QUANTRO1", en: "Use coupon QUANTRO1" },
      },
    },
    {
      key: "pro",
      name: "Pro",
      tagline: isEs ? "Escala con inteligencia, no con esfuerzo" : "Scale with intelligence, not effort",
      prices: { monthly: "$209", annual: "$2,090" },
      periodSuffix: { monthly: isEs ? "/mes" : "/mo", annual: isEs ? "/año" : "/yr" },
      description: isEs
        ? "Para negocios que buscan crecer con decisiones claras y ejecución constante."
        : "For businesses that want to grow with clear decisions and constant execution.",
      features: [
        isEs ? "Todo en Essential" : "Everything in Essential",
        isEs ? "Automatización avanzada de procesos" : "Advanced process automation",
        isEs ? "Flow + CRM + Inbox con ejecución automatizada" : "Flow + CRM + Inbox with automated execution",
        isEs ? "Quantro Intelligence activo (análisis continuo)" : "Quantro Intelligence active (continuous analysis)",
        isEs ? "Agentes IA ejecutando tareas" : "AI Agents executing tasks",
        isEs ? "Decisiones inteligentes + plan de acción" : "Smart decisions + action plan",
        isEs ? "Multiusuario (3 asientos)" : "Multi-user (3 seats)",
      ],
      highlighted: true,
      accent: "#00F5FF",
      microcopy: {
        type: "text",
        label: {
          es: "El punto donde tu negocio empieza a escalar",
          en: "Where your business starts to scale",
        },
      },
    },
    {
      key: "enterprise",
      name: "Enterprise",
      tagline: isEs
        ? "Automatización y control en su máxima expresión"
        : "Automation and control at their peak",
      prices: { monthly: "$499", annual: "$4,990" },
      periodSuffix: { monthly: isEs ? "/mes" : "/mo", annual: isEs ? "/año" : "/yr" },
      description: isEs
        ? "Para negocios que buscan optimización continua y ventaja competitiva."
        : "For businesses seeking continuous optimization and competitive edge.",
      features: [
        isEs ? "Todo en Pro" : "Everything in Pro",
        isEs ? "Inteligencia más profunda y frecuente" : "Deeper, more frequent intelligence",
        isEs ? "Quantro Revenue (optimización de ingresos)" : "Quantro Revenue (revenue optimization)",
        isEs ? "Automatizaciones personalizadas" : "Custom automations",
        isEs ? "Lean Management module" : "Lean Management module",
        isEs ? "Multiusuario (10 asientos)" : "Multi-user (10 seats)",
        isEs ? "Mayor capacidad de agentes IA" : "Higher AI agent capacity",
        isEs ? "Soporte prioritario" : "Priority support",
        isEs ? "Acceso anticipado a nuevas funciones" : "Early access to new features",
      ],
      highlighted: false,
      accent: "#C084FC",
      microcopy: {
        type: "text",
        label: {
          es: "Diseñado para operación avanzada",
          en: "Built for advanced operations",
        },
      },
    },
  ];

  const handleCtaClick = (tier) => {
    // tier.key is now the internal plan identifier directly ('essential' | 'pro' | 'enterprise')
    const plan = tier.key;
    const source = `pricing_${tier.key}_${billing}`;
    trackCTAClick(`${source}_open_platform_access`);
    saveIntent({
      platform: null, // user still needs to pick OS or Flow
      tier: tier.key,
      plan,
      billing_cycle: billing,
    });
    openPlatformAccess();
  };

  // All CTAs on this section read "Comenzar" per spec (state-aware copy for
  // logged-in users keeps the smart CTA semantics from getCTACopy).
  const ctaLabel = billingState === "not_logged"
    ? (isEs ? "Comenzar" : "Get Started")
    : getCTACopy(billingState, language);

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
          className="flex items-start sm:items-center justify-center gap-2 mb-10 text-sm text-slate-400 max-w-2xl mx-auto text-center px-4"
          data-testid="pricing-inclusion-strip"
        >
          <Sparkles size={14} className="text-[#00F5FF] flex-shrink-0 mt-1 sm:mt-0" />
          <span>
            {isEs
              ? "Todo el sistema Quantro desde el primer plan. Escala en automatización, profundidad y capacidad."
              : "The full Quantro system from day one. Scale on automation, depth and capacity."}
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

        {/* Cards — on mobile Pro is shown first per UX spec */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, i) => {
            const isCurrentPlan = hasPaidPlan && currentPlan === tier.key;
            // Mobile order: Pro (1) → Essential (2) → Enterprise (3). Desktop keeps natural order.
            const mobileOrderClass = tier.highlighted
              ? "order-1 lg:order-none"
              : tier.key === "essential"
              ? "order-2 lg:order-none"
              : "order-3 lg:order-none";

            const cardClass = isCurrentPlan
              ? "bg-gradient-to-br from-[#00F5FF]/[0.10] via-slate-900/70 to-[#22D3EE]/[0.06] border-2 border-[#00F5FF]/80 shadow-2xl shadow-[#00F5FF]/30 lg:scale-[1.05] lg:-translate-y-3"
              : tier.highlighted
              ? "bg-gradient-to-br from-[#00F5FF]/[0.06] via-slate-900/60 to-[#A020FF]/[0.05] border-2 border-[#00F5FF]/45 lg:scale-[1.05] lg:-translate-y-3 shadow-2xl shadow-[#00F5FF]/15"
              : tier.key === "enterprise"
              ? "bg-white/[0.02] border border-[#A020FF]/18 hover:border-[#A020FF]/32 lg:scale-[0.985]"
              : "bg-white/[0.015] border border-white/[0.06] hover:border-white/[0.12] lg:scale-[0.97]";

            return (
            <motion.div
              key={tier.key}
              variants={fadeInUp}
              className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${mobileOrderClass} ${cardClass}`}
              style={
                tier.highlighted || isCurrentPlan
                  ? { backdropFilter: "blur(14px)" }
                  : { backdropFilter: "blur(6px)" }
              }
              data-testid={`pricing-tier-${i}`}
              data-tier={tier.key}
              data-current-plan={isCurrentPlan || undefined}
            >
              {/* Current plan badge — takes precedence over Popular */}
              {isCurrentPlan ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full text-[#0A0F1C]"
                    style={{
                      background: "linear-gradient(90deg, #00F5FF, #22D3EE)",
                      boxShadow: "0 0 24px -2px rgba(0, 245, 255, 0.75)",
                    }}
                    data-testid={`pricing-current-plan-${tier.key}`}
                  >
                    <Check size={12} strokeWidth={3} />
                    {isEs ? "Tu plan actual" : "Your current plan"}
                  </span>
                </div>
              ) : (
                tier.highlighted && (
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
                )
              )}

              {/* Name + tagline */}
              <div className="mb-4">
                <h3
                  className={`font-satoshi font-bold tracking-tight text-white ${
                    tier.highlighted ? "text-2xl" : "text-xl"
                  }`}
                >
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
                <AnimatedPrice value={tier.prices[billing]} size={tier.highlighted ? "lg" : "md"} />
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

              {/* CTA — label + style depend on whether this is the user's current plan */}
              {(() => {
                let tierCta;
                let tierCtaClass;
                let tierCtaDisabled = false;
                if (isCurrentPlan) {
                  tierCta = isEs ? "Plan actual" : "Current plan";
                  tierCtaClass =
                    "bg-white/[0.05] border border-[#00F5FF]/30 text-[#7FF5FF] cursor-default";
                  tierCtaDisabled = true;
                } else if (hasPaidPlan) {
                  tierCta = isEs ? "Mejorar plan" : "Upgrade";
                  tierCtaClass = tier.highlighted
                    ? "bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#00F5FF]/30"
                    : tier.key === "enterprise"
                    ? "bg-white/[0.04] border border-[#A020FF]/30 text-white hover:bg-[#A020FF]/10 hover:border-[#A020FF]/50"
                    : "bg-slate-800 text-white hover:bg-slate-700";
                } else {
                  tierCta = ctaLabel;
                  tierCtaClass = tier.highlighted
                    ? billingState === "expired"
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#0A0F1C] hover:shadow-lg hover:shadow-amber-400/30"
                      : "bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#00F5FF]/30"
                    : tier.key === "enterprise"
                    ? "bg-white/[0.04] border border-[#A020FF]/30 text-white hover:bg-[#A020FF]/10 hover:border-[#A020FF]/50"
                    : "bg-slate-800 text-white hover:bg-slate-700";
                }
                return (
                  <button
                    onClick={() => !tierCtaDisabled && handleCtaClick(tier)}
                    disabled={tierCtaDisabled}
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all ${tierCtaClass}`}
                    data-testid={`pricing-cta-${i}`}
                    data-cta-state={billingState}
                    data-current-plan={isCurrentPlan || undefined}
                  >
                    {tierCta}
                  </button>
                );
              })()}

              {/* Per-tier microcopy under the CTA */}
              {tier.microcopy?.type === "coupon" ? (
                <div className="flex justify-center mt-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                    style={{
                      background: "rgba(0, 245, 255, 0.06)",
                      borderColor: "rgba(0, 245, 255, 0.22)",
                      color: "#67E8F9",
                    }}
                    data-testid={`pricing-promo-${i}`}
                  >
                    <span aria-hidden className="text-[10px]">🎟</span>
                    {tier.microcopy.label[isEs ? "es" : "en"]}
                  </span>
                </div>
              ) : (
                <p
                  className="text-center text-[11px] text-slate-500 mt-2.5 leading-snug"
                  data-testid={`pricing-promo-${i}`}
                >
                  {tier.microcopy.label[isEs ? "es" : "en"]}
                </p>
              )}
            </motion.div>
            );
          })}
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
