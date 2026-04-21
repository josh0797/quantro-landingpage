import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";

// Better Together Section
export const BetterTogetherSection = () => {
  const benefits = [
    { trigger: "Detectas oportunidades", result: "se ejecutan automáticamente" },
    { trigger: "Defines prioridades", result: "se convierten en seguimiento real" },
    { trigger: "Tomas decisiones", result: "impactan la operación sin fricción" }
  ];

  return (
    <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-transparent via-[#0A0F1C]/50 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          variants={fadeInUp}
          className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6"
        >
          Mejor juntos
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-lg text-slate-400 max-w-2xl mx-auto mb-12"
        >
          <span className="text-[#00F5FF]">Quantro OS</span> te da claridad y dirección.
          <span className="text-[#A020FF]"> Quantro Flow</span> convierte esas decisiones en acciones reales dentro de tu operación diaria.
        </motion.p>

        <motion.div variants={fadeInUp} className="space-y-4">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-4 text-left bg-slate-900/30 border border-slate-800 rounded-xl px-6 py-4 max-w-xl mx-auto"
            >
              <span className="text-[#00F5FF] font-medium">{item.trigger}</span>
              <ArrowRight className="text-slate-600 flex-shrink-0" size={20} />
              <span className="text-[#A020FF]">{item.result}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default BetterTogetherSection;
