import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";

const tiers = [
  {
    name: "Starter",
    price: "$59",
    period: "",
    description: "For solo operators and small teams.",
    features: [
      "Scorecard",
      "Rocks (90-day priorities)",
      "Issues Tracker",
      "To-Dos",
      "Full Accounting Integration"
    ],
    highlighted: false
  },
  {
    name: "Pro",
    price: "$299",
    period: "",
    description: "For growing teams.",
    features: [
      "Everything in Starter",
      "Org Chart",
      "AI Meeting Extractor",
      "AI Agents",
      "Priority Support"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "$599+",
    period: "",
    description: "For scaling businesses.",
    features: [
      "Everything in Pro",
      "Smart Yield",
      "Lean Analysis",
      "Multi-user (5 seats)",
      "Dedicated Success Manager"
    ],
    highlighted: false
  }
];

// Pricing Section
export const PricingSection = () => {
  return (
    <AnimatedSection id="pricing" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Pricing
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Invest in outcomes, not tools.
          </h2>
          <p className="text-lg text-slate-400">
            Simple, transparent pricing that scales with your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
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
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-medium text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-mono text-4xl text-white">{tier.price}</span>
                <span className="text-slate-500">{tier.period}</span>
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
                className={`w-full py-3 rounded-full font-medium transition-colors ${
                  tier.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                data-testid={`pricing-cta-${i}`}
              >
                {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PricingSection;
