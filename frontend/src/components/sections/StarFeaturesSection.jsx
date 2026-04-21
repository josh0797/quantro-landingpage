import React from "react";
import { motion } from "framer-motion";
import { Sun, Brain, Workflow, Layers } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Features Section — redesigned for clarity + conversion
export const StarFeaturesSection = () => {
  const { language } = useLanguage();

  const isEs = language === "es";

  const header = {
    eyebrow: isEs ? "Qué hace Quantro" : "What Quantro does",
    title: isEs
      ? "Decisiones claras. Acciones automáticas."
      : "Clear decisions. Automatic actions.",
    subtitle: isEs
      ? "Todo en Quantro convierte datos en decisiones — y decisiones en ejecución."
      : "Everything in Quantro turns data into decisions — and decisions into execution.",
  };

  const features = [
    {
      icon: <Sun size={22} />,
      title: isEs ? "Claridad cada mañana" : "Clarity every morning",
      body: isEs
        ? "Empiezas el día sabiendo exactamente qué mover primero."
        : "Start the day knowing exactly what to move first.",
      accent: "cyan",
    },
    {
      icon: <Brain size={22} />,
      title: isEs ? "Decisiones asistidas por IA" : "AI-assisted decisions",
      body: isEs
        ? "Tu coach estratégico siempre disponible, en tu contexto."
        : "Your strategic coach, always on, always in context.",
      accent: "violet",
    },
    {
      icon: <Workflow size={22} />,
      title: isEs ? "Ejecución automática" : "Automatic execution",
      body: isEs
        ? "Quantro Flow mueve las piezas para que tú no tengas que hacerlo."
        : "Quantro Flow moves the pieces so you don't have to.",
      accent: "emerald",
    },
    {
      icon: <Layers size={22} />,
      title: isEs ? "Un sistema, no herramientas" : "One system, not tools",
      body: isEs
        ? "Una plataforma conectada, no siete dashboards sueltos."
        : "One connected platform, not seven scattered dashboards.",
      accent: "cyan",
    },
  ];

  const accentClasses = {
    cyan: {
      ring: "group-hover:border-[#00F5FF]/40",
      iconBg: "bg-[#00F5FF]/10 border-[#00F5FF]/20 text-[#00F5FF]",
      glow: "group-hover:shadow-[0_0_40px_-10px_rgba(0,245,255,0.35)]",
    },
    violet: {
      ring: "group-hover:border-[#A020FF]/40",
      iconBg: "bg-[#A020FF]/10 border-[#A020FF]/20 text-[#C084FC]",
      glow: "group-hover:shadow-[0_0_40px_-10px_rgba(160,32,255,0.35)]",
    },
    emerald: {
      ring: "group-hover:border-emerald-400/40",
      iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      glow: "group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.35)]",
    },
  };

  return (
    <AnimatedSection id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-3xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#00F5FF] mb-4 block">
            {header.eyebrow}
          </span>
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-5">
            {header.title}
          </h2>
          <p className="text-lg text-slate-400 max-w-xl">{header.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature, i) => {
            const a = accentClasses[feature.accent];
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-8 transition-all duration-300 ${a.ring} ${a.glow}`}
                data-testid={`feature-card-${i}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${a.iconBg}`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-satoshi font-semibold text-2xl text-white mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  {feature.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default StarFeaturesSection;
