import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileSpreadsheet,
  Sheet,
  Database,
  Users,
  PackageSearch,
  ShoppingCart,
  CheckSquare,
  UserRoundCheck,
  UploadCloud,
  Shield,
  Link2,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { usePlatformAccess } from "../../hooks/usePlatformAccess";
import { trackCTAClick } from "../../lib/analytics";

/**
 * SwitchToQuantroSection
 *
 * The "Switch to Quantro / Cámbiate a Quantro" onboarding story, inspired
 * by Apple's Switch to iPhone / Stripe onboarding / Notion import.
 *
 * Structure:
 *   Left column: 3 numbered steps (Elige origen → Sube/conecta → Quantro
 *                entiende tu negocio). Only 1 step active at a time,
 *                advances via autoplay (with IO gating) or user click.
 *   Right column: preview panel that morphs per step:
 *     - Step 1: source selector cards
 *     - Step 2: upload/connect card with animated file → structure morph
 *     - Step 3: "we detected X" panel with count-up numbers + accuracy ring
 */

const SOURCES = [
  { id: "excel", label: "Excel / CSV", Icon: FileSpreadsheet },
  { id: "sheets", label: "Google Sheets", Icon: Sheet },
  { id: "quickbooks", label: "QuickBooks", Icon: Database },
  { id: "zoho", label: "Zoho", Icon: Database },
  { id: "hubspot", label: "HubSpot", Icon: Database },
  { id: "monday", label: "Monday", Icon: Database },
  { id: "other", label: { es: "Otro sistema", en: "Other system" }, Icon: Database },
  { id: "help", label: { es: "No sé / necesito ayuda", en: "Not sure / need help" }, Icon: HelpCircle },
];

const DETECTED = [
  { id: "customers", value: 428, Icon: Users },
  { id: "sales", value: 1240, Icon: ShoppingCart },
  { id: "products", value: 86, Icon: PackageSearch },
  { id: "team", value: 12, Icon: UserRoundCheck },
  { id: "tasks", value: 312, Icon: CheckSquare },
];

const STEP_AUTOPLAY_MS = 5200;

// Soft count-up used by the "detected" panel.
const useCountUp = (target, deps = []) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setV(target);
      return;
    }
    setV(0);
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ...deps]);
  return v;
};

export const SwitchToQuantroSection = () => {
  const { language } = useLanguage();
  const { open: openPlatformAccess } = usePlatformAccess();
  const isEs = language === "es";
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);

  const steps = useMemo(
    () => [
      {
        key: "source",
        kicker: "01",
        title: isEs ? "Elige de dónde vienes" : "Choose where you're coming from",
        copy: isEs
          ? "Selecciona tu sistema actual. Quantro se adapta a tu forma de trabajar."
          : "Pick your current system. Quantro adapts to how you work.",
      },
      {
        key: "upload",
        kicker: "02",
        title: isEs ? "Sube o conecta tus datos" : "Upload or connect your data",
        copy: isEs
          ? "Sube tus archivos o conecta tu sistema. Quantro detecta automáticamente tu información."
          : "Upload files or connect your system. Quantro auto-detects your information.",
      },
      {
        key: "understand",
        kicker: "03",
        title: isEs ? "Quantro entiende tu negocio" : "Quantro understands your business",
        copy: isEs
          ? "Clientes, ventas, inventario, equipo. Quantro lo organiza, detecta duplicados y te da un nivel de confianza real."
          : "Customers, sales, inventory, team. Quantro organises, catches duplicates and gives you a real confidence score.",
      },
    ],
    [isEs]
  );

  // Autoplay gated by viewport and not paused.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let timer = null;
    let inView = false;
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        if (inView && !paused && !timer) {
          timer = setInterval(() => setStep((s) => (s + 1) % steps.length), STEP_AUTOPLAY_MS);
        }
        if ((!inView || paused) && timer) {
          clearInterval(timer);
          timer = null;
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [steps.length, paused]);

  const activate = (i) => {
    setStep(i);
    setPaused(true);
    trackCTAClick(`switch_step_${steps[i].key}`);
  };

  return (
    <AnimatedSection
      id="switch"
      className="relative py-28 px-6 overflow-hidden"
      data-testid="switch-to-quantro-section"
      data-section="switch-quantro"
      aria-label={isEs ? "Cámbiate a Quantro — migración asistida desde tu sistema actual" : "Switch to Quantro — assisted migration from your current system"}
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(0, 245, 255, 0.04) 0%, transparent 60%), #030712",
      }}
    >
      {/* ES-friendly anchor alias for direct deep-linking / SEO */}
      <span id="switch-quantro" className="absolute -top-24" aria-hidden />
      {/* ES slug alias used by some external links */}
      <span id="cambiate-a-quantro" className="absolute -top-24" aria-hidden />
      <div ref={sectionRef} className="relative max-w-6xl mx-auto">
        {/* Eyebrow */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.03] text-[10px] font-bold tracking-[0.22em] uppercase text-slate-300">
            <Sparkles size={11} className="text-[#00F5FF]" />
            {isEs ? "Cámbiate a Quantro" : "Switch to Quantro"}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeInUp}
          className="text-center font-satoshi font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl mx-auto"
          data-testid="switch-headline"
        >
          {isEs ? (
            <>
              Cámbiate a Quantro{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                sin empezar desde cero.
              </span>
            </>
          ) : (
            <>
              Switch to Quantro{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                without starting over.
              </span>
            </>
          )}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-center text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mt-5"
        >
          {isEs
            ? "Importa tus datos desde tu sistema actual. Quantro los organiza, los valida y los convierte en decisiones desde el primer día."
            : "Import your data from your current system. Quantro organises, validates and turns it into decisions from day one."}
        </motion.p>

        {/* Main grid */}
        <div
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 mt-14 items-start"
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left — numbered steps */}
          <div className="space-y-3" data-testid="switch-steps">
            {steps.map((s, i) => {
              const isActive = step === i;
              return (
                <motion.button
                  key={s.key}
                  type="button"
                  onMouseEnter={() => activate(i)}
                  onClick={() => activate(i)}
                  animate={{ opacity: isActive ? 1 : 0.55, scale: isActive ? 1 : 0.99 }}
                  transition={{ duration: 0.4 }}
                  className="w-full text-left rounded-2xl p-5 focus:outline-none"
                  style={{
                    background: isActive
                      ? "linear-gradient(160deg, rgba(0, 245, 255, 0.06), rgba(14, 22, 40, 0.9))"
                      : "rgba(15, 23, 42, 0.45)",
                    border: isActive
                      ? "1px solid rgba(0, 245, 255, 0.38)"
                      : "1px solid rgba(30, 41, 59, 1)",
                    boxShadow: isActive ? "0 24px 60px -24px rgba(0, 245, 255, 0.32)" : "none",
                  }}
                  data-testid={`switch-step-${i}`}
                  data-active={isActive}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 font-satoshi font-bold text-[20px] tabular-nums"
                      style={{
                        color: isActive ? "#7FF5FF" : "rgba(148,163,184,0.7)",
                      }}
                    >
                      {s.kicker}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-satoshi font-semibold text-white text-[17px] sm:text-[18px] leading-tight tracking-tight">
                        {s.title}
                      </h3>
                      <p className="text-[13px] text-slate-400 leading-relaxed mt-1.5">
                        {s.copy}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {/* CTA */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  trackCTAClick("switch_start");
                  openPlatformAccess();
                }}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[13.5px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all"
                data-testid="switch-cta-start"
              >
                {isEs ? "Comenzar migración" : "Start migrating"}
                <ArrowRight size={14} />
              </button>
              <a
                href="mailto:hello@quantroos.com?subject=Ayuda%20con%20migraci%C3%B3n%20a%20Quantro"
                onClick={() => trackCTAClick("switch_help")}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-600 text-white text-[13.5px] font-medium hover:border-slate-500 hover:bg-slate-800/30 transition-all"
                data-testid="switch-cta-help"
              >
                {isEs ? "Hablar con un experto" : "Talk to an expert"}
              </a>
            </div>

            <p className="text-[11.5px] text-slate-500 leading-relaxed flex items-center gap-2 pt-2">
              <Shield size={12} className="text-[#7FF5FF]/80" />
              {isEs
                ? "Migración asistida · sin perder datos · sin detener tu operación."
                : "Assisted migration · zero data loss · zero downtime."}
            </p>

            <MigrationTestimonial isEs={isEs} />
          </div>

          {/* Right — morphing preview panel */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(14, 22, 40, 0.85) 0%, rgba(3, 7, 18, 0.95) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              boxShadow: "0 40px 80px -30px rgba(0, 0, 0, 0.6)",
              minHeight: "420px",
            }}
            data-testid="switch-preview-panel"
          >
            {/* Chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/40" />
                <span className="w-2 h-2 rounded-full bg-amber-500/40" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/40" />
                <span className="ml-3 text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500">
                  Quantro · {isEs ? "Migración" : "Migration"}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-300 font-semibold">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                {isEs ? "En vivo" : "Live"}
              </span>
            </div>

            {/* Slides */}
            <div className="p-5 sm:p-6 relative">
              <AnimatePresence mode="wait" initial={false}>
                {step === 0 && <SourceSlide key="src" isEs={isEs} />}
                {step === 1 && <UploadSlide key="up" isEs={isEs} />}
                {step === 2 && <UnderstandSlide key="und" isEs={isEs} />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// ===========================================================================
// Step 1 — Source selector
// ===========================================================================
const SourceSlide = ({ isEs }) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(4px)", y: 6 }}
    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
    exit={{ opacity: 0, filter: "blur(4px)", y: -6 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
    data-testid="switch-slide-source"
  >
    {SOURCES.map((s, i) => {
      const label = typeof s.label === "string" ? s.label : s.label[isEs ? "es" : "en"];
      return (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#00F5FF]/30 hover:bg-[#00F5FF]/[0.03] transition-colors cursor-pointer"
        >
          <s.Icon size={22} className="text-slate-300" />
          <span className="text-[11px] text-slate-300 text-center leading-tight px-2">{label}</span>
        </motion.div>
      );
    })}
  </motion.div>
);

// ===========================================================================
// Step 2 — Upload / connect with file-to-structure morph
// ===========================================================================
const UploadSlide = ({ isEs }) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(4px)", y: 6 }}
    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
    exit={{ opacity: 0, filter: "blur(4px)", y: -6 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    className="space-y-4"
    data-testid="switch-slide-upload"
  >
    {/* Upload zone */}
    <div className="relative rounded-xl border-2 border-dashed border-[#00F5FF]/30 bg-[#00F5FF]/[0.03] p-8 flex flex-col items-center gap-3">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(0,245,255,0.18), rgba(0,245,255,0.04))",
          border: "1px solid rgba(0,245,255,0.35)",
        }}
      >
        <UploadCloud size={22} className="text-[#7FF5FF]" />
      </motion.div>
      <p className="text-[14px] font-semibold text-white tracking-tight">
        {isEs ? "Arrastra tus archivos o conecta tu sistema" : "Drop your files or connect your system"}
      </p>
      <p className="text-[11.5px] text-slate-500 text-center max-w-xs">
        {isEs
          ? "CSV, Excel, Google Sheets, APIs. Quantro se encarga del resto."
          : "CSV, Excel, Google Sheets, APIs. Quantro handles the rest."}
      </p>
      <div className="flex gap-2">
        <button className="text-[11px] font-semibold text-[#0A0F1C] px-3 py-1.5 rounded-md bg-gradient-to-r from-[#00F5FF] to-[#22D3EE]">
          {isEs ? "Subir archivo" : "Upload file"}
        </button>
        <button className="text-[11px] font-medium text-slate-300 px-3 py-1.5 rounded-md border border-slate-600 hover:border-slate-500 inline-flex items-center gap-1.5">
          <Link2 size={11} />
          {isEs ? "Conectar API" : "Connect API"}
        </button>
      </div>
    </div>

    {/* File → structure morph */}
    <div className="rounded-xl bg-white/[0.015] border border-white/[0.04] p-4">
      <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-3">
        {isEs ? "Detectando estructura" : "Detecting structure"}
      </p>
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        {[
          { label: isEs ? "ventas_2026.csv" : "sales_2026.csv", rows: "1,240" },
          { label: isEs ? "clientes.xlsx" : "customers.xlsx", rows: "428" },
          { label: isEs ? "productos.csv" : "products.csv", rows: "86" },
        ].map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.45 }}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05]"
          >
            <span className="text-slate-300 truncate mr-2">{f.label}</span>
            <span className="text-[10px] text-slate-500 tabular-nums">{f.rows}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// ===========================================================================
// Step 3 — "Quantro understood your business"
// ===========================================================================
const UnderstandSlide = ({ isEs }) => {
  const accuracy = useCountUp(97);
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)", y: 6 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(4px)", y: -6 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
      data-testid="switch-slide-understand"
    >
      {/* Accuracy header */}
      <div
        className="flex items-center justify-between rounded-xl p-4"
        style={{
          background: "linear-gradient(160deg, rgba(52, 211, 153, 0.06), rgba(14, 22, 40, 0.85))",
          border: "1px solid rgba(52, 211, 153, 0.25)",
        }}
      >
        <div>
          <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-emerald-300/90 mb-1">
            {isEs ? "Precisión del import" : "Import accuracy"}
          </p>
          <p className="font-satoshi font-bold text-white text-3xl tabular-nums">
            {Math.round(accuracy)}%
          </p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-[11px] text-emerald-300">
            {isEs ? "Duplicados detectados: 12" : "Duplicates detected: 12"}
          </p>
          <p className="text-[11px] text-amber-300">
            {isEs ? "Errores marcados: 4" : "Errors flagged: 4"}
          </p>
          <p className="text-[11px] text-slate-400">
            {isEs ? "Equivalencias sugeridas: 37" : "Suggested mappings: 37"}
          </p>
        </div>
      </div>

      {/* Detected entity grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {DETECTED.map((d, i) => (
          <DetectedTile key={d.id} d={d} i={i} isEs={isEs} />
        ))}
      </div>

      <p className="text-[11.5px] text-slate-500 leading-relaxed">
        {isEs
          ? "Quantro ya está listo para convertir esta información en decisiones."
          : "Quantro is ready to turn this information into decisions."}
      </p>
    </motion.div>
  );
};

const DetectedTile = ({ d, i, isEs }) => {
  const v = useCountUp(d.value);
  const labels = {
    customers: isEs ? "clientes" : "customers",
    sales: isEs ? "ventas" : "sales",
    products: isEs ? "productos" : "products",
    team: isEs ? "miembros del equipo" : "team members",
    tasks: isEs ? "tareas" : "tasks",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + i * 0.08, duration: 0.45 }}
      className="rounded-xl p-3.5 bg-white/[0.02] border border-white/[0.06]"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <d.Icon size={13} className="text-[#7FF5FF]" />
        <span className="text-[10px] font-medium tracking-wider uppercase text-slate-500">
          {labels[d.id]}
        </span>
      </div>
      <p className="font-satoshi font-bold text-white text-2xl tabular-nums leading-none">
        {Math.round(v).toLocaleString()}
      </p>
    </motion.div>
  );
};

export default SwitchToQuantroSection;

// =========================================================================
// MigrationTestimonial — single-line proof below the CTAs, answers the
// implicit "how long does this actually take?" objection.
// =========================================================================
const MigrationTestimonial = ({ isEs }) => (
  <motion.figure
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 bg-white/[0.02] border border-white/[0.06]"
    data-testid="switch-testimonial"
  >
    {/* Avatar — monogram in a glass tile, matching brand aesthetic */}
    <span
      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-satoshi font-bold text-[11px] tracking-wider"
      style={{
        background: "linear-gradient(135deg, rgba(0, 245, 255, 0.18), rgba(14, 22, 40, 0.9))",
        border: "1px solid rgba(0, 245, 255, 0.32)",
        color: "#7FF5FF",
      }}
      aria-hidden
    >
      DL
    </span>
    <figcaption className="min-w-0 flex-1">
      <blockquote className="text-[12.5px] text-white/90 leading-snug font-medium italic">
        {isEs
          ? "\u201CMigramos 1 año de Excel en 47 minutos.\u201D"
          : "\u201CWe migrated 1 year of Excel in 47 minutes.\u201D"}
      </blockquote>
      <span className="block text-[10.5px] tracking-[0.18em] uppercase text-slate-500 mt-0.5">
        — Distriglobal Logistics
      </span>
    </figcaption>
  </motion.figure>
);
