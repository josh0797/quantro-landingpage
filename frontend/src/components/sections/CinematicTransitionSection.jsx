import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";

// Cinematic transition — dark fade, two lines, generous space
export const CinematicTransitionSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <section
      className="relative py-32 sm:py-40 px-6 overflow-hidden"
      data-testid="cinematic-transition"
      style={{ background: "linear-gradient(180deg, #030712 0%, #000000 50%, #030712 100%)" }}
    >
      {/* Subtle glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#00F5FF]/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-satoshi font-semibold text-3xl sm:text-4xl lg:text-5xl text-white/90 tracking-tight mb-8"
        >
          {isEs ? "Esto no es teoría." : "This isn't theory."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
          className="font-satoshi text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent"
        >
          {isEs
            ? "Es tu negocio funcionando como debería."
            : "It's your business working as it should."}
        </motion.p>
      </div>
    </section>
  );
};

export default CinematicTransitionSection;
