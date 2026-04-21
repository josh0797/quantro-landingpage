import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Differentiation Section
export const DifferentiationSection = () => {
  const { t } = useLanguage();

  const features = [
    t("diff.f1"),
    t("diff.f2"),
    t("diff.f3"),
    t("diff.f4"),
    t("diff.f5"),
    t("diff.f6"),
  ];

  const comparisons = {
    traditional: [true, false, false, false, false, false],
    point: [true, true, true, false, false, false],
    quantro: [true, true, true, true, true, true],
  };

  return (
    <AnimatedSection className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {t("diff.label")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            {t("diff.title")}
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp} className="overflow-x-auto" data-testid="comparison-table">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div />
              <div className="text-center text-sm text-slate-400 font-medium p-4">
                {t("diff.traditional")}
              </div>
              <div className="text-center text-sm text-slate-400 font-medium p-4">
                {t("diff.point")}
              </div>
              <div className="comparison-highlight text-center text-sm text-blue-400 font-medium p-4 rounded-t-lg">
                {t("diff.quantro")}
              </div>
            </div>

            {features.map((feature, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 border-b border-slate-800/50 py-4">
                <div className="text-sm text-slate-300 px-4">{feature}</div>
                <div className="text-center">
                  {comparisons.traditional[i] ? (
                    <Check className="inline text-slate-600" size={18} />
                  ) : (
                    <X className="inline text-slate-700" size={18} />
                  )}
                </div>
                <div className="text-center">
                  {comparisons.point[i] ? (
                    <Check className="inline text-slate-600" size={18} />
                  ) : (
                    <X className="inline text-slate-700" size={18} />
                  )}
                </div>
                <div className="comparison-highlight text-center">
                  <Check className="inline text-emerald-400" size={18} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default DifferentiationSection;
