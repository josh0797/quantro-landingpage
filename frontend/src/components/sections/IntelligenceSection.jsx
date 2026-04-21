import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Bot, Rocket, Sparkles } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Organic data → decision → action flow visualization
const FlowVisualization = ({ isEs }) => {
  const nodes = [
    { x: 5, y: 50, label: isEs ? "Datos" : "Data" },
    { x: 35, y: 25, label: isEs ? "Análisis" : "Analysis" },
    { x: 65, y: 75, label: isEs ? "Decisión" : "Decision" },
    { x: 95, y: 50, label: isEs ? "Acción" : "Action" },
  ];

  return (
    <div className="relative w-full h-32 sm:h-40 mb-16 overflow-hidden">
      {/* Connector lines with flowing glow */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="flowLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A020FF" stopOpacity="0.2" />
          </linearGradient>
          <filter id="flowGlow">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        {/* Animated curved path through all nodes */}
        <motion.path
          d="M 5,50 Q 20,10 35,25 T 65,75 Q 80,95 95,50"
          fill="none"
          stroke="url(#flowLineGrad)"
          strokeWidth="0.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Pulsing dot that travels along the path */}
        <motion.circle
          r="1"
          fill="#00F5FF"
          filter="url(#flowGlow)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 3, delay: 0.8, ease: "linear" }}
        >
          <animateMotion dur="3s" begin="0.8s" fill="freeze" path="M 5,50 Q 20,10 35,25 T 65,75 Q 80,95 95,50" />
        </motion.circle>
      </svg>

      {/* Node dots + labels */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.4, duration: 0.5 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <motion.div
            className="relative w-3 h-3 rounded-full bg-[#00F5FF]"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(0, 245, 255, 0.5)",
                "0 0 0 12px rgba(0, 245, 255, 0)",
                "0 0 0 0 rgba(0, 245, 255, 0.5)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
          />
          <span className="absolute left-1/2 -translate-x-1/2 top-5 text-[10px] font-medium text-slate-400 whitespace-nowrap uppercase tracking-widest">
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// Floating particle background for "IA viva" feeling
const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => {
      const size = 1 + Math.random() * 2;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = 10 + Math.random() * 10;
      const delay = Math.random() * 5;
      return (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#00F5FF]"
          style={{ width: size, height: size, top: `${top}%`, left: `${left}%` }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -40, -80],
          }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
        />
      );
    })}
  </div>
);

export const IntelligenceSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const cards = [
    {
      icon: <Brain size={22} />,
      title: isEs ? "Detecta lo que otros no ven" : "Detects what others miss",
      body: isEs
        ? "Analiza tu negocio, tu mercado y tu competencia constantemente."
        : "Analyzes your business, market and competition continuously.",
      accent: "#00F5FF",
    },
    {
      icon: <Zap size={22} />,
      title: isEs ? "Se adelanta a los problemas" : "Stays ahead of problems",
      body: isEs
        ? "Identifica riesgos y oportunidades antes de que impacten tu negocio."
        : "Identifies risks and opportunities before they impact your business.",
      accent: "#22D3EE",
    },
    {
      icon: <Bot size={22} />,
      title: isEs ? "No solo informa. Decide." : "Doesn't just inform. Decides.",
      body: isEs
        ? "Te dice exactamente qué hacer, con acciones claras y ejecutables."
        : "Tells you exactly what to do, with clear executable actions.",
      accent: "#C084FC",
    },
    {
      icon: <Rocket size={22} />,
      title: isEs ? "Convierte decisiones en acción" : "Turns decisions into action",
      body: isEs
        ? "Los agentes ejecutan tareas, crean seguimiento y mueven tu negocio."
        : "Agents execute tasks, create follow-ups and move your business forward.",
      accent: "#A020FF",
    },
  ];

  return (
    <section
      id="intelligence"
      className="relative py-32 px-6 overflow-hidden"
      data-testid="intelligence-section"
      style={{
        background:
          "radial-gradient(ellipse at center top, rgba(0, 245, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse at center bottom, rgba(160, 32, 255, 0.04) 0%, transparent 50%), #030712",
      }}
    >
      <ParticleField />

      <div className="relative max-w-6xl mx-auto">
        {/* Reveal intro */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className="text-center text-base sm:text-lg text-slate-500 italic mb-4"
        >
          {isEs ? "Y esto no sucede por casualidad." : "And this doesn't happen by chance."}
        </motion.p>

        {/* Title */}
        <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-5"
          >
            {isEs
              ? "Un sistema que piensa en tu negocio."
              : "A system that thinks about your business."}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl text-slate-400 leading-relaxed"
          >
            {isEs
              ? "Mientras operas, Quantro analiza, aprende y mejora cada decisión."
              : "While you operate, Quantro analyzes, learns and improves every decision."}
          </motion.p>
        </motion.div>

        {/* Flow visualization */}
        <FlowVisualization isEs={isEs} />

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.18, duration: 0.55, ease: "easeOut" }}
              className="group relative rounded-2xl p-7 bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.15]"
              style={{
                boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
              }}
              data-testid={`intelligence-card-${i}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${card.accent}15, transparent 60%)`,
                }}
              />

              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  backgroundColor: `${card.accent}15`,
                  border: `1px solid ${card.accent}30`,
                  color: card.accent,
                }}
              >
                {card.icon}
              </div>
              <h3 className="relative font-satoshi font-semibold text-lg text-white leading-snug tracking-tight mb-2">
                {card.title}
              </h3>
              <p className="relative text-sm text-slate-400 leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Brand reveal (subtle) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-20"
        >
          <div className="inline-flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#00F5FF]" />
            </div>
            <p className="font-satoshi font-semibold text-2xl sm:text-3xl bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent tracking-tight">
              {isEs ? "Esto es Quantro Intelligence." : "This is Quantro Intelligence."}
            </p>
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-slate-500 mt-1">
              {isEs ? "Impulsado por AOS" : "Powered by AOS"}
            </p>
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="font-satoshi font-medium text-xl sm:text-2xl text-slate-400 leading-snug">
            {isEs ? "No solo ves lo que pasa." : "You don't just see what's happening."}
          </p>
          <p className="font-satoshi font-semibold text-xl sm:text-2xl text-white leading-snug mt-1">
            {isEs ? "Entiendes qué hacer después." : "You understand what to do next."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntelligenceSection;
