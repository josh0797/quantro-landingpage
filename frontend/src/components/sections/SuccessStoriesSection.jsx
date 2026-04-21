import React from "react";
import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";

// Success Stories Section
export const SuccessStoriesSection = () => {
  const stories = [
    {
      title: "De caos operativo a control total",
      quote: "Ahora cada lead tiene seguimiento automático y el equipo sabe qué hacer cada día.",
      metric: "+40%",
      metricLabel: "conversión"
    },
    {
      title: "Decisiones más rápidas, sin juntas eternas",
      quote: "Pasaron de analizar datos manualmente a recibir acciones claras cada mañana.",
      metric: "4x",
      metricLabel: "más rápido"
    },
    {
      title: "Su operación sigue, incluso cuando no están",
      quote:
        "Por primera vez siento que mi empresa trabaja para mí, no al revés. Identifiqué que el 30% de mis proyectos consumían el 70% del tiempo y además no generaban utilidad.",
      metric: "30%",
      metricLabel: "ahorro de tiempo"
    }
  ];

  return (
    <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-[#0A0F1C]/50 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Casos de éxito
          </span>
          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
            Lo que ya están logrando nuestros clientes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="success-card"
              data-testid={`success-story-${i}`}
            >
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-[#00F5FF]">{story.metric}</span>
                <span className="text-sm text-slate-500">{story.metricLabel}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{story.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">"{story.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default SuccessStoriesSection;
