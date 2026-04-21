import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Users,
  Clock,
  Zap,
  GitBranch,
  LayoutDashboard,
  Target,
  Trophy,
  Brain,
  Bot,
  DollarSign,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Preview "real" content shown on click — styled as mini dashboard frames
const PreviewFrame = ({ icon, title, rows, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3 }}
    className="bg-[#0A0F1C] border border-slate-800/70 rounded-xl p-5 min-h-[200px]"
  >
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}40`, color: accent }}
      >
        {icon}
      </div>
      <span className="text-sm text-white font-medium">{title}</span>
      <div className="ml-auto flex items-center gap-1.5">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[10px] text-slate-500">live</span>
      </div>
    </div>
    <div className="space-y-2.5">
      {rows.map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/50"
        >
          {row.leading && (
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: accent }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-300 font-medium truncate">{row.title}</div>
            {row.subtitle && (
              <div className="text-[10px] text-slate-500 truncate mt-0.5">{row.subtitle}</div>
            )}
          </div>
          {row.trailing && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              {row.trailing}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Flow demo content
const flowContent = (isEs) => ({
  inbox: {
    icon: <Inbox size={14} />,
    title: isEs ? "Inbox unificado" : "Unified inbox",
    rows: [
      { leading: true, title: isEs ? "Luis R. · WhatsApp" : "Luis R. · WhatsApp", subtitle: isEs ? "Hola, ¿tienen disponibilidad…" : "Hi, do you have availability…", trailing: isEs ? "auto" : "auto" },
      { leading: true, title: isEs ? "Mariana · Email" : "Mariana · Email", subtitle: isEs ? "Gracias por la propuesta" : "Thanks for the proposal", trailing: "1h" },
      { leading: true, title: isEs ? "Carlos · IG DM" : "Carlos · IG DM", subtitle: isEs ? "Respuesta enviada" : "Reply sent", trailing: "✓" },
    ],
  },
  crm: {
    icon: <Users size={14} />,
    title: "CRM",
    rows: [
      { leading: true, title: "Grupo Nexo", subtitle: isEs ? "Pipeline · Propuesta" : "Pipeline · Proposal", trailing: "$42K" },
      { leading: true, title: "AuroMex", subtitle: isEs ? "Cliente activo" : "Active client", trailing: "MRR" },
      { leading: true, title: "TechBuild", subtitle: isEs ? "Nuevo lead" : "New lead", trailing: "hot" },
    ],
  },
  followup: {
    icon: <Clock size={14} />,
    title: isEs ? "Seguimiento" : "Follow-up",
    rows: [
      { leading: true, title: isEs ? "Enviar propuesta · hoy" : "Send proposal · today", subtitle: "Grupo Nexo", trailing: "auto" },
      { leading: true, title: isEs ? "Llamada · mañana 10am" : "Call · tomorrow 10am", subtitle: "AuroMex", trailing: "cal" },
    ],
  },
  automation: {
    icon: <Zap size={14} />,
    title: isEs ? "Automatización" : "Automation",
    rows: [
      { leading: true, title: isEs ? "Responder en 2 min" : "Reply within 2 min", subtitle: isEs ? "si horario laboral" : "if business hours", trailing: "ON" },
      { leading: true, title: isEs ? "Crear lead si > 3 mensajes" : "Create lead if > 3 messages", subtitle: isEs ? "en el mismo día" : "same day", trailing: "ON" },
    ],
  },
  pipeline: {
    icon: <GitBranch size={14} />,
    title: "Pipeline",
    rows: [
      { leading: true, title: isEs ? "Prospección · 14" : "Prospecting · 14", trailing: "—" },
      { leading: true, title: isEs ? "Propuesta · 6" : "Proposal · 6", trailing: "+2" },
      { leading: true, title: isEs ? "Cerrado · $128K" : "Closed · $128K", trailing: "MTD" },
    ],
  },
});

// OS demo content
const osContent = (isEs) => ({
  dashboard: {
    icon: <LayoutDashboard size={14} />,
    title: "Dashboard",
    rows: [
      { leading: true, title: isEs ? "Ingresos · $847K" : "Revenue · $847K", trailing: "+12%" },
      { leading: true, title: isEs ? "Margen · 67%" : "Margin · 67%", trailing: "+2%" },
      { leading: true, title: isEs ? "CAC · $312" : "CAC · $312", trailing: "-8%" },
    ],
  },
  scorecard: {
    icon: <Target size={14} />,
    title: "Scorecard",
    rows: [
      { leading: true, title: isEs ? "Ventas semanales" : "Weekly sales", trailing: "✓" },
      { leading: true, title: isEs ? "NPS · 62" : "NPS · 62", trailing: "✓" },
      { leading: true, title: isEs ? "Churn · 2.1%" : "Churn · 2.1%", trailing: "!" },
    ],
  },
  rocks: {
    icon: <Trophy size={14} />,
    title: "Rocks",
    rows: [
      { leading: true, title: isEs ? "Lanzar México Norte" : "Launch North Mexico", subtitle: "Q2", trailing: "75%" },
      { leading: true, title: isEs ? "Reducir churn < 2%" : "Reduce churn < 2%", subtitle: "Q2", trailing: "50%" },
    ],
  },
  intelligence: {
    icon: <Brain size={14} />,
    title: "Intelligence",
    rows: [
      { leading: true, title: isEs ? "Oportunidad: Enterprise +23%" : "Opportunity: Enterprise +23%", trailing: isEs ? "hoy" : "today" },
      { leading: true, title: isEs ? "Riesgo: 3 clientes top sin contacto" : "Risk: 3 top clients no contact", trailing: "!" },
    ],
  },
  agents: {
    icon: <Bot size={14} />,
    title: isEs ? "Agentes" : "Agents",
    rows: [
      { leading: true, title: isEs ? "Agente de propuestas" : "Proposals agent", subtitle: isEs ? "4 enviadas hoy" : "4 sent today", trailing: "ON" },
      { leading: true, title: isEs ? "Agente de cobranza" : "Collections agent", subtitle: isEs ? "$12K recuperado" : "$12K recovered", trailing: "ON" },
    ],
  },
  finance: {
    icon: <DollarSign size={14} />,
    title: isEs ? "Finanzas" : "Finance",
    rows: [
      { leading: true, title: isEs ? "Cash runway · 14 meses" : "Cash runway · 14 months", trailing: "✓" },
      { leading: true, title: isEs ? "Burn rate · $68K/mes" : "Burn rate · $68K/mo", trailing: "—" },
    ],
  },
});

const DemoBlock = ({ title, subtitle, message, pills, content, accent, defaultPill, testIdPrefix }) => {
  const [active, setActive] = useState(defaultPill);
  const activeData = content[active];

  return (
    <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 md:gap-10 items-start">
      {/* Left: Copy + pills */}
      <div>
        <h3 className="font-satoshi font-bold text-2xl sm:text-3xl text-white leading-tight mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-base text-slate-400 leading-relaxed mb-6">{subtitle}</p>

        <div className="flex flex-wrap gap-2 mb-5" data-testid={`${testIdPrefix}-pills`}>
          {pills.map((pill) => {
            const isActive = active === pill.key;
            return (
              <button
                key={pill.key}
                onClick={() => setActive(pill.key)}
                className={`px-3.5 py-2 text-xs font-medium rounded-full border transition-all ${
                  isActive
                    ? "text-[#0A0F1C] shadow-lg"
                    : "text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: accent,
                        borderColor: accent,
                        boxShadow: `0 0 20px -5px ${accent}80`,
                      }
                    : undefined
                }
                data-testid={`${testIdPrefix}-pill-${pill.key}`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed italic">
          <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: accent }} />
          <span>{message}</span>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="relative">
        <div className="absolute -inset-3 rounded-2xl opacity-40 blur-2xl" style={{ backgroundColor: `${accent}20` }} />
        <div className="relative">
          <AnimatePresence mode="wait">
            <PreviewFrame
              key={active}
              icon={activeData.icon}
              title={activeData.title}
              rows={activeData.rows}
              accent={accent}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Interactive Demo — Flow (top) + OS (bottom)
export const InteractiveDemoSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const flow = flowContent(isEs);
  const os = osContent(isEs);

  const flowPills = [
    { key: "inbox", label: "Inbox" },
    { key: "crm", label: "CRM" },
    { key: "followup", label: isEs ? "Seguimiento" : "Follow-up" },
    { key: "automation", label: isEs ? "Automatización" : "Automation" },
    { key: "pipeline", label: "Pipeline" },
  ];

  const osPills = [
    { key: "dashboard", label: "Dashboard" },
    { key: "scorecard", label: "Scorecard" },
    { key: "rocks", label: "Rocks" },
    { key: "intelligence", label: "Intelligence" },
    { key: "agents", label: isEs ? "Agentes" : "Agents" },
    { key: "finance", label: isEs ? "Finanzas" : "Finance" },
  ];

  return (
    <AnimatedSection
      id="interactive-demo"
      className="py-28 px-6 relative"
      data-testid="interactive-demo-section"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-3 block">
            {isEs ? "El producto, en vivo" : "The product, live"}
          </span>
        </motion.div>

        {/* Flow block */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-8 md:p-12 bg-gradient-to-br from-[#A020FF]/[0.04] via-slate-900/40 to-transparent border border-[#A020FF]/15 mb-10"
          data-testid="demo-flow-block"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#C084FC]">
              Quantro Flow
            </span>
          </div>
          <DemoBlock
            title={
              isEs
                ? "Aumenta la fidelización de tus clientes."
                : "Increase customer retention."
            }
            subtitle={
              isEs
                ? "Cada mensaje, cliente y proceso fluye sin perderse."
                : "Every message, customer and process flows without being lost."
            }
            message={
              isEs
                ? "Flow asegura que tus clientes reciban la atención que merecen."
                : "Flow ensures your customers get the attention they deserve."
            }
            pills={flowPills}
            content={flow}
            accent="#C084FC"
            defaultPill="inbox"
            testIdPrefix="flow"
          />
        </motion.div>

        {/* Transition */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-satoshi font-medium text-lg sm:text-xl text-slate-300">
            {isEs
              ? "Primero todo funciona. Luego todo mejora."
              : "First everything works. Then everything improves."}
          </p>
        </motion.div>

        {/* OS block */}
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl p-8 md:p-12 bg-gradient-to-br from-[#00F5FF]/[0.04] via-slate-900/40 to-transparent border border-[#00F5FF]/15"
          data-testid="demo-os-block"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00F5FF]" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#00F5FF]">
              Quantro OS
            </span>
          </div>
          <DemoBlock
            title={
              isEs
                ? "Tu negocio deja de reaccionar. Empieza a decidir."
                : "Your business stops reacting. It starts deciding."
            }
            subtitle={
              isEs
                ? "Decisiones claras, antes de que tengas que preguntarte qué hacer."
                : "Clear decisions, before you have to ask yourself what to do."
            }
            message={
              isEs
                ? "Quantro OS te dice qué hacer. No solo qué está pasando."
                : "Quantro OS tells you what to do. Not just what's happening."
            }
            pills={osPills}
            content={os}
            accent="#00F5FF"
            defaultPill="dashboard"
            testIdPrefix="os"
          />
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default InteractiveDemoSection;
