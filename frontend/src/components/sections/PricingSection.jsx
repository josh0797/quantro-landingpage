import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { startStripeCheckout } from "../../lib/stripe";
import { trackCTAClick, trackCheckoutStarted } from "../../lib/analytics";

// Animated price number — fades and slides slightly on change
const AnimatedPrice = ({ value }) => (
  <AnimatePresence mode="wait">
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="font-mono text-5xl text-white tabular-nums"
    >
      {value}
    </motion.span>
  </AnimatePresence>
);

// Pricing Section with Monthly/Annual toggle
export const PricingSection = () => {
  const { t } = useLanguage();
  const [billing, setBilling] = useState("annual"); // 'monthly' | 'annual'
  const isAnnual = billing === "annual";

  const tiers = [
    {
      key: "starter",
      name: t("pricing.starter.name"),
      prices: { monthly: "$89", annual: "$74" },
      description: t("pricing.starter.description"),
      features: [
        t("pricing.starter.f1"),
        t("pricing.starter.f2"),
        t("pricing.starter.f3"),
        t("pricing.starter.f4"),
        t("pricing.starter.f5"),
      ],
      highlighted: false,
    },
    {
      key: "pro",
      name: t("pricing.pro.name"),
      prices: { monthly: "$199", annual: "$166" },
      description: isAnnual
        ? t("pricing.pro.descriptionAnnual")
        : t("pricing.pro.description"),
      features: [
        t("pricing.pro.f1"),
        t("pricing.pro.f2"),
        t("pricing.pro.f3"),
        t("pricing.pro.f4"),
        t("pricing.pro.f5"),
      ],
      highlighted: true,
    },
    {
      key: "enterprise",
      name: t("pricing.enterprise.name"),
      prices: { monthly: "$499", annual: "$416" },
      description: isAnnual
        ? t("pricing.enterprise.descriptionAnnual")
        : t("pricing.enterprise.description"),
      features: [
        t("pricing.enterprise.f1"),
        t("pricing.enterprise.f2"),
        t("pricing.enterprise.f3"),
        t("pricing.enterprise.f4"),
        t("pricing.enterprise.f5"),
      ],
      highlighted: false,
    },
  ];

  const handleCtaClick = async (tier) => {
    trackCTAClick(`pricing_${tier.key}_${billing}`);
    if (tier.key === "enterprise") {
      window.location.href = "mailto:ventas@quantroos.com?subject=Quantro%20Enterprise%20-%20Demo";
      return;
    }
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
    <AnimatedSection id="pricing" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {t("pricing.label")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-slate-400">{t("pricing.subtitle")}</p>
        </motion.div>

        {/* Monthly / Annual Toggle */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          data-testid="pricing-billing-toggle"
        >
          <div
            className="relative inline-flex items-center bg-slate-900/60 border border-slate-800 rounded-full p-1"
            role="tablist"
          >
            {[
              { key: "monthly", label: t("pricing.billing.monthly") },
              { key: "annual", label: t("pricing.billing.annual") },
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

          {/* "2 months free" badge — animates in when annual is active */}
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
                {t("pricing.billing.badge")}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pricing Cards — min-h keeps heights consistent when descriptions swap */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.key}
              variants={fadeInUp}
              className={`rounded-xl p-8 min-h-[540px] flex flex-col ${
                tier.highlighted
                  ? "pricing-highlight bg-slate-900 border-2 border-blue-500/30"
                  : "bg-slate-900/50 border border-slate-800"
              }`}
              data-testid={`pricing-tier-${i}`}
            >
              {tier.highlighted && (
                <span className="inline-block self-start px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full mb-4">
                  {t("pricing.popular")}
                </span>
              )}

              <h3 className="text-xl font-medium text-white mb-2">{tier.name}</h3>

              {/* Price row */}
              <div className="flex items-baseline gap-2 mb-1" data-testid={`pricing-price-${tier.key}`}>
                <AnimatedPrice value={tier.prices[billing]} />
                <span className="text-slate-500 text-sm">{t("pricing.perMonth")}</span>
              </div>

              {/* Annual context line */}
              <div className="min-h-[20px] mb-4">
                <AnimatePresence mode="wait">
                  {isAnnual && (
                    <motion.div
                      key="annual-line"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-slate-500"
                    >
                      {t("pricing.billedAnnually")}
                      <span className="mx-1.5 text-slate-600">·</span>
                      <span className="text-[#C084FC]">{t("pricing.twoMonthsFree")}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Description (can swap with annual) */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={tier.description}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-slate-400 mb-6 min-h-[40px]"
                >
                  {tier.description}
                </motion.p>
              </AnimatePresence>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="text-emerald-400 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCtaClick(tier)}
                className={`w-full py-3 rounded-full font-medium transition-colors ${
                  tier.highlighted
                    ? "bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#00F5FF]/20"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                data-testid={`pricing-cta-${i}`}
              >
                {tier.key === "enterprise" ? t("pricing.cta.sales") : t("pricing.cta.trial")}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PricingSection;
