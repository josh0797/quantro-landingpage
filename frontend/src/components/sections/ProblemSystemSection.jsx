import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquareWarning,
  CalendarX,
  Database,
  ClipboardList,
  Brain,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Each problem -> solution block with a mini animated visual
const problems = (isEs) => [
  {
    icon: <MessageSquareWarning size={22} />,
    problem: isEs
      ? "Mensajes sin responder que se convierten en clientes perdidos."
      : "Unanswered messages that become lost customers.",
    solution: isEs
      ? "Quantro Flow captura cada oportunidad, responde automáticamente y asegura seguimiento."
      : "Quantro Flow captures every opportunity, replies automatically and ensures follow-up.",
    before: isEs ? "sin responder" : "unanswered",
    after: isEs ? "respondido · lead creado" : "replied · lead created",
  },
  {
    icon: <CalendarX size={22} />,
    problem: isEs
      ? "Agenda desorganizada, seguimientos olvidados."
      : "Disorganized calendar, forgotten follow-ups.",
    solution: isEs
      ? "Flow organiza tus operaciones y las convierte en prioridades claras."
      : "Flow organizes your operations into clear priorities.",
    before: isEs ? "caos" : "chaos",
    after: isEs ? "orden automático" : "automatic order",
  },
  {
    icon: <Database size={22} />,
    problem: isEs
      ? "CRM confuso o duplicado."
      : "Confusing or duplicated CRM.",
    solution: isEs
      ? "Flow mantiene tu información limpia y en movimiento."
      : "Flow keeps your data clean and moving.",
    before: isEs ? "duplicados" : "duplicates",
    after: isEs ? "CRM limpio" : "clean CRM",
  },
  {
    icon: <ClipboardList size={22} />,
    problem: isEs
      ? "Tiempo perdido en tareas administrativas."
      : "Time lost on admin tasks.",
    solution: isEs
      ? "Quantro Intelligence automatiza ejecución para que te enfoques en decisiones."
      : "Quantro Intelligence automates execution so you focus on decisions.",
    before: isEs ? "manual" : "manual",
    after: isEs ? "agentes IA activos" : "AI agents active",
  },
];

const ProblemCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.1, duration: 0.55, ease: "easeOut" }}
    className="grid md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-8 items-stretch py-8 border-b border-slate-800/50 last:border-b-0"
    data-testid={`problem-card-${index}`}
  >
    {/* Left: Problem state */}
    <div className="relative">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 flex-shrink-0">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          {/* Status title pill — hierarchy as heading */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/90 animate-pulse" />
            <span
              className="text-[10px] font-semibold text-red-300/90 tracking-[0.18em] uppercase"
              data-testid={`problem-status-${index}`}
            >
              {item.before}
            </span>
          </div>
          <p className="text-base sm:text-lg text-slate-300 leading-snug font-medium">
            {item.problem}
          </p>
        </div>
      </div>
    </div>

    {/* Middle: Arrow animation */}
    <div className="hidden md:flex items-center justify-center pt-4">
      <motion.div
        initial={{ x: -8, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: index * 0.1 + 0.25, duration: 0.5 }}
      >
        <ArrowRight className="text-[#00F5FF]" size={22} />
      </motion.div>
    </div>

    {/* Right: Solution state */}
    <div className="relative md:pl-4 pl-13">
      <p className="text-base sm:text-lg text-slate-200 leading-snug font-medium mb-3">
        {item.solution}
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
        <CheckCircle2 size={12} className="text-emerald-400" />
        <span className="text-xs text-emerald-300 font-medium">{item.after}</span>
      </div>
    </div>
  </motion.div>
);

// Problem → System narrative section
export const ProblemSystemSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const items = problems(isEs);

  return (
    <AnimatedSection
      className="py-28 px-6 relative overflow-hidden"
      data-testid="problem-system-section"
    >
      {/* Background orbs */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#00F5FF]/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A020FF]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Headline */}
        <motion.div variants={fadeInUp} className="max-w-3xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {isEs ? "El sistema" : "The system"}
          </span>
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-4">
            {isEs
              ? "El problema no es falta de herramientas."
              : "The problem isn't missing tools."}
          </h2>
          <p className="text-xl sm:text-2xl text-slate-400 leading-tight">
            {isEs
              ? "Es que tu negocio no está operando como un sistema."
              : "It's that your business isn't operating as a system."}
          </p>
        </motion.div>

        {/* Problem → Solution blocks */}
        <div className="mb-20">
          {items.map((item, i) => (
            <ProblemCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Transition text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-satoshi font-semibold text-2xl sm:text-3xl text-white tracking-tight">
            {isEs
              ? "Aquí es donde Quantro cambia el juego."
              : "This is where Quantro changes the game."}
          </p>
        </motion.div>

        {/* OS + Flow mini blocks */}
        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {/* Quantro OS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="relative rounded-2xl p-8 bg-gradient-to-br from-[#00F5FF]/[0.06] via-slate-900/60 to-transparent border border-[#00F5FF]/20"
            data-testid="os-block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center">
                <Brain className="text-[#00F5FF]" size={20} />
              </div>
              <div>
                <div className="font-satoshi font-bold text-white text-lg">Quantro OS</div>
                <div className="text-xs text-[#00F5FF] font-medium">
                  {isEs ? "Tu negocio ahora sabe qué hacer." : "Your business now knows what to do."}
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {(isEs
                ? ["Analiza datos", "Detecta oportunidades", "Propone decisiones", "Ejecuta con agentes"]
                : ["Analyzes data", "Detects opportunities", "Proposes decisions", "Executes with agents"]
              ).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles size={12} className="text-[#00F5FF]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quantro Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="relative rounded-2xl p-8 bg-gradient-to-br from-[#A020FF]/[0.06] via-slate-900/60 to-transparent border border-[#A020FF]/20"
            data-testid="flow-block"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#A020FF]/10 border border-[#A020FF]/30 flex items-center justify-center">
                <Workflow className="text-[#C084FC]" size={20} />
              </div>
              <div>
                <div className="font-satoshi font-bold text-white text-lg">Quantro Flow</div>
                <div className="text-xs text-[#C084FC] font-medium">
                  {isEs ? "Nada se pierde. Todo fluye y progresa." : "Nothing gets lost. Everything flows forward."}
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {(isEs
                ? ["Captura leads", "Da seguimiento", "Organiza operación", "Mantiene clientes activos"]
                : ["Captures leads", "Follows up", "Organizes operations", "Keeps customers active"]
              ).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles size={12} className="text-[#C084FC]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-2">
            {isEs
              ? "No necesitas más herramientas. Necesitas que todo funcione como un sistema."
              : "You don't need more tools. You need everything to work as a system."}
          </p>
          <p className="font-satoshi font-semibold text-xl sm:text-2xl bg-gradient-to-r from-[#00F5FF] to-[#A020FF] bg-clip-text text-transparent">
            {isEs ? "Primero entiendes. Luego ejecutas." : "First understand. Then execute."}
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default ProblemSystemSection;
