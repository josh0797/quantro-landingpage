import React from "react";
import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { trackCTAClick } from "../../lib/analytics";

// Hero Transition Section (Two Systems)
export const HeroTransitionSection = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatedSection className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00F5FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#A020FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2
          variants={fadeInUp}
          className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-8"
        >
          Un sistema para entender tu negocio.
          <br />
          <span className="text-[#00F5FF]">Otro para operarlo.</span>
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          <span className="text-white">Quantro OS</span> analiza tu negocio, detecta oportunidades y propone acciones.
          <span className="text-[#A020FF]"> Quantro Flow</span> responde y da seguimiento automáticamente en tu operación diaria, liberando tu carga de trabajo.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              trackCTAClick("explore_quantro");
              scrollToSection("product-comparison");
            }}
            className="btn-cyan"
            data-testid="cta-explore"
          >
            Explorar Quantro
          </button>
          <button
            onClick={() => scrollToSection("morning-snapshot")}
            className="px-8 py-4 rounded-xl border border-slate-600 text-white font-medium hover:border-[#00F5FF]/50 hover:bg-[#00F5FF]/5 transition-all"
            data-testid="cta-how-it-works"
          >
            Ver cómo funciona
          </button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default HeroTransitionSection;
