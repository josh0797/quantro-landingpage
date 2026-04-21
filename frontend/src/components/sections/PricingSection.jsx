import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { startStripeCheckout } from "../../lib/stripe";
import { trackCTAClick, trackCheckoutStarted } from "../../lib/analytics";

// Pricing Section
export const PricingSection = () => {
  const { t } = useLanguage();

  const tiers = [
    {
      key: "starter",
      name: t("pricing.starter.name"),
      price: "$59",
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
      price: "$299",
      description: t("pricing.pro.description"),
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
      price: "$599+",
      description: t("pricing.enterprise.description"),
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
    trackCTAClick(`pricing_${tier.key}`);
    if (tier.key === "enterprise") {
      document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Starter/Pro both route to the $1 trial for now
    trackCheckoutStarted({ packageId: "trial_1usd", source: `pricing_${tier.key}` });
    try {
      await startStripeCheckout({ packageId: "trial_1usd" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatedSection id="pricing" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {t("pricing.label")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-slate-400">{t("pricing.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.key}
              variants={fadeInUp}
              className={`rounded-xl p-8 ${
                tier.highlighted
                  ? "pricing-highlight bg-slate-900 border-2 border-blue-500/30"
                  : "bg-slate-900/50 border border-slate-800"
              }`}
              data-testid={`pricing-tier-${i}`}
            >
              {tier.highlighted && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full mb-4">
                  {t("pricing.popular")}
                </span>
              )}
              <h3 className="text-xl font-medium text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-mono text-4xl text-white">{tier.price}</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">{tier.description}</p>

              <ul className="space-y-3 mb-8">
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
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                data-testid={`pricing-cta-${i}`}
              >
                {tier.key === "enterprise" ? t("pricing.contact") : t("pricing.cta")}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PricingSection;
