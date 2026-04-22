import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  MessageCircle,
  Mail,
  Calendar,
  BarChart3,
  FileText,
  ClipboardList,
  Zap,
  Brain,
  Workflow,
  ArrowRight,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

/* Scattered external tools — the "before" layer. Positions are in % inside
   a relatively-positioned canvas. Kept deliberately muted and blurred. */
const EXTERNAL_TOOLS = (isEs) => [
  { label: "CRM", icon: Users, x: 6, y: 12 },
  { label: "WhatsApp", icon: MessageCircle, x: 78, y: 8 },
  { label: isEs ? "Email Marketing" : "Email Marketing", icon: Mail, x: 4, y: 82 },
  { label: "Calendar", icon: Calendar, x: 84, y: 78 },
  { label: "Analytics", icon: BarChart3, x: 12, y: 52 },
  { label: "Docs", icon: FileText, x: 82, y: 46 },
  { label: "Tasks", icon: ClipboardList, x: 36, y: 6 },
  { label: "Automation", icon: Zap, x: 60, y: 90 },
];

/* =========================================================================
   CoreCard — the two protagonist cards (Quantro OS + Quantro Flow)
   ========================================================================= */
const CoreCard = ({
  title,
  subtitle,
  icon: Icon,
  accent,
  tagLabel,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="relative"
    data-testid={`core-card-${tagLabel.toLowerCase()}`}
  >
    {/* Glow aura */}
    <motion.div
      aria-hidden
      className="absolute -inset-6 rounded-3xl blur-2xl pointer-events-none"
      style={{
        background: `radial-gradient(circle at center, ${accent}33, transparent 70%)`,
      }}
      animate={{ opacity: [0.55, 0.85, 0.55] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    />

    <div
      className="relative rounded-2xl p-5 flex items-center gap-4 backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(160deg, rgba(15, 23, 42, 0.92) 0%, rgba(3, 7, 18, 0.85) 100%)",
        border: `1px solid ${accent}4D`,
        boxShadow: `0 24px 60px -24px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${accent}33, ${accent}0D)`,
          border: `1px solid ${accent}66`,
          boxShadow: `0 0 18px -4px ${accent}88`,
        }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[9px] font-bold tracking-[0.22em] uppercase"
            style={{ color: accent }}
          >
            {tagLabel}
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
          />
        </div>
        <div className="font-satoshi font-bold text-[20px] text-white leading-none tracking-tight">
          {title}
        </div>
        <div className="text-[12px] text-slate-400 mt-1.5 leading-snug">{subtitle}</div>
      </div>
    </div>
  </motion.div>
);

/* =========================================================================
   UnifiedCanvas — external tools (back) + Quantro OS/Flow (front)
   ========================================================================= */
const UnifiedCanvas = ({ isEs }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const tools = EXTERNAL_TOOLS(isEs);

  return (
    <div
      ref={ref}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        minHeight: 520,
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(0,245,255,0.08), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(160,32,255,0.07), transparent 55%), #030712",
        border: "1px solid rgba(148, 163, 184, 0.08)",
      }}
      data-testid="unified-canvas"
    >
      {/* Grid background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(71,85,105,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,0.1) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      />

      {/* BEFORE / AHORA labels */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{
            background: "rgba(148, 163, 184, 0.06)",
            border: "1px solid rgba(148, 163, 184, 0.14)",
            color: "#64748B",
          }}
        >
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          {isEs ? "Antes · disperso" : "Before · fragmented"}
        </span>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <motion.span
          initial={{ opacity: 0, x: 6 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{
            background: "rgba(0, 245, 255, 0.08)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            color: "#00F5FF",
          }}
        >
          <span
            className="w-1 h-1 rounded-full bg-[#00F5FF]"
            style={{ boxShadow: "0 0 6px #00F5FF" }}
          />
          {isEs ? "Ahora · unificado" : "Now · unified"}
        </motion.span>
      </div>

      {/* External tool pills — floating back-layer */}
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 0.5, scale: 1 } : {}}
            transition={{
              delay: 0.15 + i * 0.08,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${tool.x}%`,
              top: `${tool.y}%`,
              filter: "blur(0.3px)",
            }}
            data-testid={`external-tool-${i}`}
          >
            <motion.div
              animate={{ y: [0, -4, 0, 3, 0] }}
              transition={{
                duration: 6 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.25,
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
              style={{
                background: "rgba(15, 23, 42, 0.55)",
                border: "1px solid rgba(148, 163, 184, 0.15)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 6px 16px -8px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Icon size={11} className="text-slate-500" />
              <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                {tool.label}
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Connector arc between OS and Flow */}
      <svg
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
        width="100%"
        height="120"
        viewBox="0 0 600 120"
        style={{ maxWidth: 600 }}
      >
        <defs>
          <linearGradient id="core-link" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.0" />
            <stop offset="35%" stopColor="#00F5FF" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#A020FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#A020FF" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 50 60 C 180 20, 420 20, 550 60"
          fill="none"
          stroke="url(#core-link)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ delay: 1.1, duration: 1, ease: "easeInOut" }}
        />
      </svg>

      {/* Core cards container */}
      <div className="absolute inset-0 flex items-center justify-center px-6 py-12 z-30">
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-7 w-full max-w-[640px]">
          <CoreCard
            title="Quantro OS"
            subtitle={isEs ? "Inteligencia del negocio" : "Business intelligence"}
            icon={Brain}
            accent="#00F5FF"
            tagLabel="CORE"
            delay={0.45}
          />
          <CoreCard
            title="Quantro Flow"
            subtitle={isEs ? "Ejecución automática" : "Automated execution"}
            icon={Workflow}
            accent="#A020FF"
            tagLabel="CORE"
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   Comparison card — Before (disperse / high cost) vs Now (Quantro / low cost)
   ========================================================================= */
const ComparisonCard = ({ isEs }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: 0.3, duration: 0.6 }}
    className="relative rounded-2xl p-6 overflow-hidden h-full flex flex-col"
    style={{
      background:
        "linear-gradient(160deg, rgba(15, 23, 42, 0.75) 0%, rgba(3, 7, 18, 0.85) 100%)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
      backdropFilter: "blur(12px)",
    }}
    data-testid="comparison-card"
  >
    {/* Ambient glow */}
    <div
      aria-hidden
      className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, rgba(0, 245, 255, 0.18), transparent 70%)",
        filter: "blur(24px)",
      }}
    />

    <div className="relative flex-1 flex flex-col">
      {/* BEFORE */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
            {isEs ? "Antes" : "Before"}
          </span>
        </div>
        <div className="text-[13px] text-slate-400 leading-snug mb-2">
          {isEs
            ? "Múltiples herramientas separadas"
            : "Multiple separate tools"}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[10px] text-slate-500">
            {isEs ? "Desde" : "From"}
          </span>
          <span className="font-satoshi font-bold text-2xl text-slate-400 line-through tabular-nums decoration-slate-600 decoration-1">
            $399
          </span>
          <span className="text-[11px] text-slate-500">/mes</span>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <ArrowRight size={12} className="text-slate-600" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      {/* AHORA */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-1 h-1 rounded-full bg-[#00F5FF]"
            style={{ boxShadow: "0 0 6px #00F5FF" }}
          />
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#00F5FF]">
            {isEs ? "Ahora con Quantro" : "Now with Quantro"}
          </span>
        </div>
        <div className="text-[13px] text-white font-medium leading-snug mb-2">
          {isEs ? "Un solo sistema conectado" : "One connected system"}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[10px] text-slate-500">
            {isEs ? "Desde" : "From"}
          </span>
          <span className="font-satoshi font-bold text-5xl bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent tabular-nums leading-none">
            $59
          </span>
          <span className="text-slate-500 text-sm">/mes</span>
        </div>
      </div>

      {/* Footer line */}
      <div
        className="mt-auto pt-5"
        style={{ borderTop: "1px solid rgba(148, 163, 184, 0.08)" }}
      >
        <p className="text-[12px] text-slate-400 leading-relaxed">
          {isEs
            ? "Menos herramientas que pagar. Más resultados en marcha."
            : "Fewer tools to pay for. More results in motion."}
        </p>
      </div>
    </div>
  </motion.div>
);

/* =========================================================================
   Main section
   ========================================================================= */
export const ValueStackSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <AnimatedSection
      id="value-stack"
      className="py-24 px-6"
      data-testid="value-stack-section"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-3xl mb-12">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#C084FC] mb-4 block">
            {isEs ? "Un solo sistema" : "One system"}
          </span>
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-5">
            {isEs ? (
              <>
                De múltiples herramientas
                <br />
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#A020FF] bg-clip-text text-transparent">
                  a un solo sistema.
                </span>
              </>
            ) : (
              <>
                From multiple tools
                <br />
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#A020FF] bg-clip-text text-transparent">
                  to one system.
                </span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-400 max-w-xl">
            {isEs
              ? "Todo tu negocio, en un solo lugar."
              : "Your entire business, in one place."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-stretch">
          <motion.div variants={fadeInUp}>
            <UnifiedCanvas isEs={isEs} />
          </motion.div>
          <ComparisonCard isEs={isEs} />
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ValueStackSection;
