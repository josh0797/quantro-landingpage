import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Grid3X3, Scissors, Bot } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";

// Star Features Section
export const StarFeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="text-blue-400" size={24} />,
      name: "Smart Yield",
      tagline: "Know where your money actually comes from.",
      description:
        "Quintile Matrix classifies every customer and product by revenue and margin — showing exactly which to grow, re-price, or cut.",
      accentColor: "blue"
    },
    {
      icon: <Grid3X3 className="text-emerald-400" size={24} />,
      name: "Quintile Matrix",
      tagline: "Your 5×5 value map.",
      description:
        "An interactive heatmap that reveals where 80% of your business value lives — and where the complexity is killing your margins.",
      accentColor: "green"
    },
    {
      icon: <Scissors className="text-blue-400" size={24} />,
      name: "Dirty Dozen",
      tagline: "12 tactics. One click.",
      description:
        "Apply proven simplification actions — eliminate low-margin products, set minimum orders, stop discounting B customers — directly to your workflow.",
      accentColor: "blue"
    },
    {
      icon: <Bot className="text-emerald-400" size={24} />,
      name: "EMS Coach AI",
      tagline: "Your 24/7 strategic consultant.",
      description:
        'Ask "What should I eliminate this month?" or "How do I improve Quad 2 margins?" — and get answers grounded in your actual business data.',
      accentColor: "green"
    }
  ];

  return (
    <AnimatedSection id="features" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Star Features
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Tools that drive real decisions.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 card-hover"
              data-testid={`star-feature-${i}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    feature.accentColor === "blue" ? "bg-blue-500/10" : "bg-emerald-500/10"
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">{feature.name}</h3>
                  <p
                    className={`text-sm font-medium mb-2 ${
                      feature.accentColor === "blue" ? "text-blue-400" : "text-emerald-400"
                    }`}
                  >
                    {feature.tagline}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default StarFeaturesSection;
