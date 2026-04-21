import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  Users,
  TrendingUp,
  FileSpreadsheet,
  MessageSquare,
  Mail,
  ClipboardList,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Tool positions around the center (percentages) — scattered premium layout
const TOOLS = [
  { label: "CRM", icon: Users, x: 8, y: 15, cost: 79 },
  { label: "BI Tool", icon: BarChart3, x: 80, y: 10, cost: 89 },
  { label: "Forecasts", icon: TrendingUp, x: 72, y: 78, cost: 59 },
  { label: "Spreadsheets", icon: FileSpreadsheet, x: 3, y: 72, cost: 25 },
  { label: "Chat Ops", icon: MessageSquare, x: 88, y: 45, cost: 39 },
  { label: "Email Mgmt", icon: Mail, x: 15, y: 48, cost: 19 },
  { label: "Task Tracker", icon: ClipboardList, x: 55, y: 88, cost: 29 },
];

const TOTAL_COST = TOOLS.reduce((sum, t) => sum + t.cost, 0);

// Animated counter — tweens from `from` to `to` once in view
const useInViewTween = (target, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
};

const ValueStackCanvas = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [collapsed, setCollapsed] = useState(false);

  // Kick off the collapse animation ~600ms after enter-in
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setCollapsed(true), 600);
    return () => clearTimeout(id);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative w-full h-[440px] sm:h-[480px] rounded-2xl overflow-hidden"
      data-testid="value-stack-canvas"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,245,255,0.06), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(160,32,255,0.05), transparent 55%)",
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(71,85,105,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Center Quantro core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        {/* Outer glow */}
        <motion.div
          animate={collapsed ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00F5FF]/20 to-[#A020FF]/20 blur-2xl scale-150"
        />
        <div className="relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#030712] border border-[#00F5FF]/40 shadow-2xl shadow-[#00F5FF]/20">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] flex items-center justify-center text-[#0A0F1C] font-satoshi font-bold text-lg">
            Q
          </div>
          <div className="text-left">
            <div className="font-satoshi font-bold text-white text-lg leading-none">Quantro OS</div>
            <div className="text-xs text-slate-400 mt-1">Un sistema</div>
          </div>
        </div>
      </motion.div>

      {/* Connector lines from each tool to center (fade as tools collapse) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        {TOOLS.map((tool, i) => (
          <motion.line
            key={i}
            x1={`${tool.x}%`}
            y1={`${tool.y}%`}
            x2="50%"
            y2="50%"
            stroke="url(#connectorGrad)"
            strokeWidth="1"
            strokeDasharray="3 4"
            initial={{ opacity: 0 }}
            animate={
              inView && !collapsed
                ? { opacity: [0, 0.5, 0.3] }
                : collapsed
                ? { opacity: 0 }
                : {}
            }
            transition={{ delay: 0.3 + i * 0.06, duration: 1, ease: "easeInOut" }}
          />
        ))}
        <defs>
          <linearGradient id="connectorGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#A020FF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Tool pills — start scattered, then collapse to center */}
      {TOOLS.map((tool, i) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.label}
            initial={{ opacity: 0, scale: 0.7, x: "-50%", y: "-50%" }}
            animate={
              inView
                ? collapsed
                  ? {
                      opacity: 0,
                      scale: 0.3,
                      x: "-50%",
                      y: "-50%",
                      left: "50%",
                      top: "50%",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      x: "-50%",
                      y: "-50%",
                      left: `${tool.x}%`,
                      top: `${tool.y}%`,
                    }
                : {}
            }
            transition={{
              delay: 0.15 + i * 0.07,
              duration: 1.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="absolute flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-sm"
            style={{ left: `${tool.x}%`, top: `${tool.y}%` }}
            data-testid={`value-stack-pill-${i}`}
          >
            <Icon size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
              {tool.label}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">${tool.cost}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

const SavingsCard = ({ isEs }) => {
  const savings = useInViewTween(TOTAL_COST);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: 2.2, duration: 0.5 }}
      className="relative rounded-2xl p-8 bg-gradient-to-br from-[#00F5FF]/[0.04] via-slate-900/60 to-[#A020FF]/[0.04] border border-slate-800/70 overflow-hidden"
      data-testid="value-stack-savings"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F5FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-emerald-400 mb-4 block">
          {isEs ? "Ahorro mensual estimado" : "Estimated monthly savings"}
        </span>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-satoshi font-bold text-6xl text-white tabular-nums">
            ${savings}
          </span>
          <span className="text-slate-500 text-lg">/mes</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          {isEs
            ? "vs. el costo promedio de mantener 7 herramientas por separado."
            : "vs. the average cost of maintaining 7 separate tools."}
        </p>
      </div>
    </motion.div>
  );
};

// Value Stack Section — "Un sistema. No 7 herramientas."
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
            {isEs ? "Value stack" : "Value stack"}
          </span>
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-5">
            {isEs ? (
              <>
                Un sistema.{" "}
                <span className="text-slate-500">No 7 herramientas.</span>
              </>
            ) : (
              <>
                One system.{" "}
                <span className="text-slate-500">Not 7 tools.</span>
              </>
            )}
          </h2>
          <p className="text-lg text-slate-400 max-w-xl">
            {isEs
              ? "Menos herramientas que pagar. Más progreso y resultados."
              : "Fewer tools to pay for. More progress and results."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <motion.div variants={fadeInUp}>
            <ValueStackCanvas />
          </motion.div>
          <SavingsCard isEs={isEs} />
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ValueStackSection;
