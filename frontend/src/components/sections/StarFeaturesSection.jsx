import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Grid3X3, Scissors, Bot } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Star Features Section
export const StarFeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Sparkles className="text-blue-400" size={24} />,
      name: t("starfeatures.smart_yield.name"),
      tagline: t("starfeatures.smart_yield.tagline"),
      description: t("starfeatures.smart_yield.description"),
      accentColor: "blue",
    },
    {
      icon: <Grid3X3 className="text-emerald-400" size={24} />,
      name: t("starfeatures.quintile.name"),
      tagline: t("starfeatures.quintile.tagline"),
      description: t("starfeatures.quintile.description"),
      accentColor: "green",
    },
    {
      icon: <Scissors className="text-blue-400" size={24} />,
      name: t("starfeatures.dirty.name"),
      tagline: t("starfeatures.dirty.tagline"),
      description: t("starfeatures.dirty.description"),
      accentColor: "blue",
    },
    {
      icon: <Bot className="text-emerald-400" size={24} />,
      name: t("starfeatures.coach.name"),
      tagline: t("starfeatures.coach.tagline"),
      description: t("starfeatures.coach.description"),
      accentColor: "green",
    },
  ];

  return (
    <AnimatedSection id="features" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {t("starfeatures.label")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            {t("starfeatures.title")}
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
