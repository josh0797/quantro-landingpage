import React from "react";
import { motion } from "framer-motion";
import { Eye, Lightbulb, Compass, Zap, ArrowRight } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Differentiation Section — emotional flow: ver → entender → actuar → ejecutar
export const DifferentiationSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const steps = [
    {
      icon: <Eye size={22} />,
      label: isEs ? "Ver" : "See",
      description: isEs
        ? "Todo tu negocio en un solo lugar, sin ruido."
        : "Your whole business in one place, no noise.",
      accent: "rgba(0, 245, 255, 0.85)",
    },
    {
      icon: <Lightbulb size={22} />,
      label: isEs ? "Entender" : "Understand",
      description: isEs
        ? "Patrones y oportunidades, sin interpretar reportes."
        : "Patterns and opportunities, no reports to interpret.",
      accent: "rgba(34, 211, 238, 0.85)",
    },
    {
      icon: <Compass size={22} />,
      label: isEs ? "Actuar" : "Act",
      description: isEs
        ? "Decisiones priorizadas listas cada mañana."
        : "Prioritized decisions ready every morning.",
      accent: "rgba(192, 132, 252, 0.85)",
    },
    {
      icon: <Zap size={22} />,
      label: isEs ? "Ejecutar" : "Execute",
      description: isEs
        ? "Quantro Flow las lleva adelante automáticamente."
        : "Quantro Flow carries them out automatically.",
      accent: "rgba(160, 32, 255, 0.85)",
    },
  ];

  return (
    <AnimatedSection
      className="py-24 px-6 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent"
      data-testid="differentiation-section"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-3xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {isEs ? "Por qué Quantro" : "Why Quantro"}
          </span>
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-5">
            {isEs ? (
              <>
                No es un dashboard.
                <br />
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#A020FF] bg-clip-text text-transparent">
                  Es un sistema que decide.
                </span>
              </>
            ) : (
              <>
                Not a dashboard.
                <br />
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#A020FF] bg-clip-text text-transparent">
                  A system that decides.
                </span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-400 max-w-xl">
            {isEs
              ? "Donde otros se detienen en mostrar datos, Quantro conecta el ciclo completo."
              : "Where others stop at showing data, Quantro closes the full loop."}
          </p>
        </motion.div>

        {/* Desktop: horizontal 4-step flow with arrows */}
        <motion.div
          variants={fadeInUp}
          className="hidden lg:grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-start"
        >
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <FlowStep step={step} index={i} />
              {i < steps.length - 1 && (
                <FlowConnector fromAccent={step.accent} toAccent={steps[i + 1].accent} index={i} />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Mobile/Tablet: vertical stack with down arrows */}
        <motion.div variants={fadeInUp} className="lg:hidden space-y-3">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <FlowStep step={step} index={i} mobile />
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="text-slate-600 rotate-90" size={18} />
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

const FlowStep = ({ step, index, mobile = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
    className={`relative rounded-2xl p-6 bg-slate-900/50 border border-slate-800 transition-all duration-300 hover:border-slate-700 ${
      mobile ? "flex items-start gap-4" : ""
    }`}
    data-testid={`diff-step-${index}`}
  >
    <div
      className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-4"
      style={{
        backgroundColor: `${step.accent.replace("0.85", "0.1")}`,
        border: `1px solid ${step.accent.replace("0.85", "0.3")}`,
        color: step.accent,
        marginBottom: mobile ? 0 : undefined,
      }}
    >
      {step.icon}
    </div>
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[10px] font-mono text-slate-600 tabular-nums">
          0{index + 1}
        </span>
        <h3 className="font-satoshi font-semibold text-xl text-white tracking-tight">
          {step.label}
        </h3>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
    </div>
  </motion.div>
);

const FlowConnector = ({ fromAccent, toAccent, index }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.12 + 0.25, duration: 0.5, ease: "easeOut" }}
    className="flex items-center pt-7 origin-left"
    aria-hidden
  >
    <svg width="36" height="12" viewBox="0 0 36 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad-${index}`} x1="0" y1="6" x2="36" y2="6">
          <stop offset="0%" stopColor={fromAccent} />
          <stop offset="100%" stopColor={toAccent} />
        </linearGradient>
      </defs>
      <path d="M0 6 H28" stroke={`url(#grad-${index})`} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M26 2 L32 6 L26 10"
        stroke={toAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </motion.div>
);

export default DifferentiationSection;
