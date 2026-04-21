import React from "react";
import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import QuantroMorningDemo from "../QuantroMorningDemo";

// Morning Snapshot Section - Interactive Demo
export const MorningSnapshotSection = () => {
  const { t } = useLanguage();

  return (
    <AnimatedSection id="morning-snapshot" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            {t("morning.title")}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t("morning.subtitle")}
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <QuantroMorningDemo mode="demo" />
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default MorningSnapshotSection;
