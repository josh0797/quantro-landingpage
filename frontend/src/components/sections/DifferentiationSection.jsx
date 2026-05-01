import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Eye, Lightbulb, Compass, Zap, ArrowRight, Check, TrendingUp, TrendingDown, Sparkles, CircleDot, Activity } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { usePlatformAccess } from "../../hooks/usePlatformAccess";
import { trackCTAClick } from "../../lib/analytics";

/**
 * DifferentiationSection — "Por qué Quantro".
 *
 * Same 4-card flow (Ver → Entender → Actuar → Ejecutar), now alive:
 *   - 1 active card at a time, hover or tap switches it, autoplay every 3.5s
 *   - preview panel under the cards reacts to the active step
 *   - flow dots show progress
 *   - preamble + final CTA reinforce the "every day, without asking" narrative
 *
 * Visual language (glass, glow, cyan → violet) is unchanged.
 */

const AUTOPLAY_MS = 3500;

// =========================================================================
// Preview panels (one per step)
// =========================================================================

const fadeSlide = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

/** Count-up number used by "Ver" KPIs. */
const CountUp = ({ to, prefix = "", suffix = "", duration = 0.9 }) => {
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, reduce]);
  const display =
    to % 1 === 0 ? Math.round(val).toLocaleString() : val.toFixed(1);
  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

const VerPreview = ({ isEs }) => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="show"
    exit="exit"
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className="grid grid-cols-3 gap-3"
    data-testid="diff-preview-ver"
  >
    {[
      { label: isEs ? "Revenue" : "Revenue", to: 184300, prefix: "$", delta: "+12.4%", up: true },
      { label: isEs ? "Margen" : "Margin", to: 38.6, suffix: "%", delta: "+1.8%", up: true },
      { label: isEs ? "Leads" : "Leads", to: 427, delta: "-3.1%", up: false },
    ].map((k) => (
      <div
        key={k.label}
        className="relative rounded-xl p-4 bg-white/[0.02] border border-white/[0.06] overflow-hidden"
      >
        {/* shimmer */}
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(110deg, transparent 35%, rgba(0,245,255,0.06) 50%, transparent 65%)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "150%" }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.4, repeat: Infinity, repeatDelay: 3 }}
        />
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-1.5">
          {k.label}
        </p>
        <p className="font-satoshi font-bold text-xl sm:text-2xl text-white leading-none">
          <CountUp to={k.to} prefix={k.prefix} suffix={k.suffix} />
        </p>
        <div
          className={`inline-flex items-center gap-1 mt-2 text-[11px] font-semibold ${
            k.up ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {k.delta}
        </div>
      </div>
    ))}
  </motion.div>
);

const EntenderPreview = ({ isEs }) => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="show"
    exit="exit"
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className="space-y-2.5"
    data-testid="diff-preview-entender"
  >
    {[
      {
        label: isEs ? "Leads bajaron 18% esta semana" : "Leads dropped 18% this week",
        sub: isEs ? "Canal afectado: paid search" : "Affected channel: paid search",
        tone: "rose",
      },
      {
        label: isEs
          ? "Tienes $82K atrapados en inventario"
          : "You have $82K trapped in inventory",
        sub: isEs ? "SKU: bodega central · 45 días sin movimiento" : "SKU: central warehouse · 45 days idle",
        tone: "amber",
      },
    ].map((i, idx) => (
      <motion.div
        key={i.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.15 }}
        className="relative rounded-xl p-4 border overflow-hidden"
        style={{
          background:
            i.tone === "rose"
              ? "linear-gradient(160deg, rgba(244,63,94,0.08), rgba(12,18,34,0.88))"
              : "linear-gradient(160deg, rgba(250,204,21,0.08), rgba(12,18,34,0.88))",
          borderColor:
            i.tone === "rose" ? "rgba(244,63,94,0.28)" : "rgba(250,204,21,0.28)",
        }}
      >
        {/* pulse highlight */}
        <motion.span
          aria-hidden
          className="absolute -inset-[1px] rounded-xl pointer-events-none"
          style={{
            boxShadow:
              i.tone === "rose"
                ? "inset 0 0 0 1px rgba(244,63,94,0.35)"
                : "inset 0 0 0 1px rgba(250,204,21,0.35)",
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background:
                i.tone === "rose" ? "rgba(244,63,94,0.14)" : "rgba(250,204,21,0.14)",
              border:
                i.tone === "rose"
                  ? "1px solid rgba(244,63,94,0.35)"
                  : "1px solid rgba(250,204,21,0.35)",
            }}
          >
            <Activity size={12} className={i.tone === "rose" ? "text-rose-300" : "text-amber-300"} />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] text-white font-medium leading-snug">{i.label}</p>
            <p className="text-[11.5px] text-slate-400 leading-snug mt-0.5">{i.sub}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const ActuarPreview = ({ isEs }) => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="show"
    exit="exit"
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className="space-y-2.5"
    data-testid="diff-preview-actuar"
  >
    {[
      {
        label: isEs ? "Ajustar pricing en segmento Pro" : "Adjust pricing in Pro segment",
        impact: isEs ? "Impacto estimado: +$14K / mes" : "Estimated impact: +$14K / mo",
      },
      {
        label: isEs ? "Reducir gasto en canal Meta Ads" : "Cut spend in Meta Ads channel",
        impact: isEs ? "ROI proyectado: +22%" : "Projected ROI: +22%",
      },
    ].map((i, idx) => (
      <motion.div
        key={i.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.15 }}
        className="relative rounded-xl p-4 border overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(192,132,252,0.1), rgba(12,18,34,0.9))",
          borderColor: "rgba(192,132,252,0.35)",
          boxShadow: "0 18px 50px -22px rgba(192,132,252,0.4)",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 w-6 h-6 rounded-md bg-[#C084FC]/15 border border-[#C084FC]/40 flex items-center justify-center flex-shrink-0">
            <Sparkles size={11} className="text-[#E9D5FF]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <p className="text-[13.5px] text-white font-medium leading-snug">{i.label}</p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider uppercase bg-[#A020FF]/15 text-[#E9D5FF] border border-[#A020FF]/40">
                {isEs ? "Recomendado" : "Recommended"}
              </span>
            </div>
            <p className="text-[11.5px] text-slate-400 leading-snug">{i.impact}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const EjecutarPreview = ({ isEs }) => (
  <motion.div
    variants={fadeSlide}
    initial="hidden"
    animate="show"
    exit="exit"
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className="space-y-2.5"
    data-testid="diff-preview-ejecutar"
  >
    {[
      { label: isEs ? "Tarea asignada a ventas" : "Task assigned to sales", progress: 100 },
      { label: isEs ? "Pausar reabasto de SKU-287" : "Pause SKU-287 replenishment", progress: 68 },
      { label: isEs ? "Oferta enviada a segmento Pro" : "Offer sent to Pro segment", progress: 42 },
    ].map((i, idx) => (
      <motion.div
        key={i.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.12 }}
        className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06]"
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                background: i.progress === 100 ? "rgba(52, 211, 153, 0.14)" : "rgba(160, 32, 255, 0.12)",
                border:
                  i.progress === 100
                    ? "1px solid rgba(52, 211, 153, 0.4)"
                    : "1px solid rgba(160, 32, 255, 0.4)",
              }}
            >
              {i.progress === 100 ? (
                <Check size={11} className="text-emerald-300" strokeWidth={3} />
              ) : (
                <CircleDot size={11} className="text-[#C084FC]" />
              )}
            </span>
            <p className="text-[13px] text-white font-medium truncate">{i.label}</p>
          </div>
          <span className="text-[10.5px] font-mono tabular-nums text-slate-500">
            {i.progress}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${i.progress}%` }}
            transition={{ duration: 0.9, delay: 0.15 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{
              background:
                i.progress === 100
                  ? "linear-gradient(90deg, #34D399, #10B981)"
                  : "linear-gradient(90deg, #00F5FF, #A020FF)",
            }}
          />
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const PREVIEWS = {
  ver: VerPreview,
  entender: EntenderPreview,
  actuar: ActuarPreview,
  ejecutar: EjecutarPreview,
};

// =========================================================================
// Main section
// =========================================================================

export const DifferentiationSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const { open: openPlatformAccess } = usePlatformAccess();
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  const steps = useMemo(
    () => [
      {
        key: "ver",
        icon: <Eye size={22} />,
        label: isEs ? "Ver" : "See",
        copy: isEs ? "Todos tus datos, conectados en un solo sistema" : "All your data, connected in one system",
        accentRGB: "0, 245, 255",
      },
      {
        key: "entender",
        icon: <Lightbulb size={22} />,
        label: isEs ? "Entender" : "Understand",
        copy: isEs ? "Detecta lo que nadie está viendo" : "Spots what no one else is seeing",
        accentRGB: "34, 211, 238",
      },
      {
        key: "actuar",
        icon: <Compass size={22} />,
        label: isEs ? "Actuar" : "Act",
        copy: isEs ? "Te dice exactamente qué hacer" : "Tells you exactly what to do",
        accentRGB: "192, 132, 252",
      },
      {
        key: "ejecutar",
        icon: <Zap size={22} />,
        label: isEs ? "Ejecutar" : "Execute",
        copy: isEs ? "Se ejecuta sin fricción" : "Executes without friction",
        accentRGB: "160, 32, 255",
      },
    ],
    [isEs]
  );

  // Autoplay — only runs while the section is in viewport and the user hasn't
  // explicitly paused by hovering a card.
  useEffect(() => {
    if (reduce || userInteracted) return;
    if (!sectionRef.current) return;

    let inView = false;
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        if (inView && !timerRef.current) {
          timerRef.current = setInterval(() => {
            setActive((i) => (i + 1) % steps.length);
          }, AUTOPLAY_MS);
        }
        if (!inView && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      { threshold: 0.25 }
    );
    io.observe(sectionRef.current);
    return () => {
      io.disconnect();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [steps.length, userInteracted, reduce]);

  const selectStep = (i, source = "hover") => {
    setActive(i);
    if (source === "tap") setUserInteracted(true);
    trackCTAClick(`diff_step_${steps[i].key}_${source}`);
  };

  const handleCTA = () => {
    trackCTAClick("diff_section_cta");
    openPlatformAccess();
  };

  const ActivePreview = PREVIEWS[steps[active].key];

  return (
    <AnimatedSection
      className="py-24 px-6 bg-gradient-to-b from-transparent via-slate-950/40 to-transparent"
      data-testid="differentiation-section"
    >
      <div ref={sectionRef} className="max-w-6xl mx-auto">
        {/* Preamble — NEW */}
        <motion.p
          variants={fadeInUp}
          className="text-center text-[12.5px] sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6"
          data-testid="diff-preamble"
        >
          <Sparkles size={12} className="inline mr-2 -mt-0.5 text-[#00F5FF]/80" />
          {isEs
            ? "Esto pasa todos los días. Sin que tengas que pedirlo."
            : "This happens every day. Without you having to ask."}
        </motion.p>

        {/* Headline block — unchanged */}
        <motion.div variants={fadeInUp} className="max-w-3xl mb-14 sm:mb-16 mx-auto text-center sm:text-left">
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
          <p className="text-lg text-slate-400 max-w-xl mx-auto sm:mx-0">
            {isEs
              ? "Donde otros se detienen en mostrar datos, Quantro conecta el ciclo completo."
              : "Where others stop at showing data, Quantro closes the full loop."}
          </p>
        </motion.div>

        {/* Interactive 4-card flow */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          data-testid="diff-steps-grid"
        >
          {steps.map((step, i) => (
            <FlowStep
              key={step.key}
              step={step}
              index={i}
              isActive={active === i}
              onHover={() => selectStep(i, "hover")}
              onTap={() => selectStep(i, "tap")}
            />
          ))}
        </motion.div>

        {/* Flow indicator dots */}
        <div
          className="flex items-center justify-center gap-0 mt-8"
          data-testid="diff-flow-indicator"
          aria-label={isEs ? "Paso activo" : "Active step"}
        >
          {steps.map((step, i) => (
            <React.Fragment key={step.key}>
              <motion.button
                type="button"
                onClick={() => selectStep(i, "tap")}
                className="relative focus:outline-none"
                animate={{ scale: active === i ? 1.15 : 1 }}
                transition={{ duration: 0.3 }}
                data-testid={`diff-dot-${i}`}
                aria-label={`${isEs ? "Paso" : "Step"} ${i + 1}`}
              >
                <span
                  className="block w-2 h-2 rounded-full transition-colors"
                  style={{
                    background:
                      active === i ? `rgba(${step.accentRGB}, 0.95)` : "rgba(148, 163, 184, 0.3)",
                    boxShadow:
                      active === i ? `0 0 10px rgba(${step.accentRGB}, 0.7)` : "none",
                  }}
                />
                {active === i && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-[-4px] rounded-full"
                    style={{ border: `1px solid rgba(${step.accentRGB}, 0.45)` }}
                    animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.35, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
              {i < steps.length - 1 && (
                <div className="relative w-12 sm:w-16 h-px bg-white/[0.08] mx-1.5 overflow-hidden">
                  <motion.span
                    className="absolute inset-0 origin-left"
                    style={{
                      background: `linear-gradient(90deg, rgba(${steps[i].accentRGB}, 0.7), rgba(${steps[i + 1].accentRGB}, 0.7))`,
                    }}
                    initial={false}
                    animate={{ scaleX: active > i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Live preview panel */}
        <motion.div
          variants={fadeInUp}
          className="relative mt-8 rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(14, 22, 40, 0.75) 0%, rgba(5, 10, 24, 0.85) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.12)",
            boxShadow: "0 40px 80px -30px rgba(0, 0, 0, 0.6)",
          }}
          data-testid="diff-preview-panel"
        >
          {/* chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500/40" />
              <span className="w-2 h-2 rounded-full bg-amber-500/40" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/40" />
              <span className="ml-3 text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500">
                Quantro OS · {steps[active].label}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-300 font-semibold">
              <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
              {isEs ? "En vivo" : "Live"}
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <ActivePreview key={steps[active].key} isEs={isEs} />
            </AnimatePresence>

            <motion.p
              key={`caption-${steps[active].key}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="mt-5 text-center text-[12.5px] text-slate-400 leading-relaxed"
              data-testid="diff-preview-caption"
            >
              <span className="font-semibold text-white/90">
                {steps[active].label}.
              </span>{" "}
              {steps[active].copy}
            </motion.p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 text-center"
          data-testid="diff-final-cta"
        >
          <p className="text-[14.5px] sm:text-[15px] text-slate-300 leading-snug max-w-md">
            {isEs
              ? "Así es como Quantro opera tu negocio, todos los días."
              : "That's how Quantro runs your business, every day."}
          </p>
          <button
            type="button"
            onClick={handleCTA}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[13px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all"
            data-testid="diff-cta-button"
          >
            {isEs ? "Empieza con Quantro" : "Start with Quantro"}
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// =========================================================================
// Flow step card
// =========================================================================

const FlowStep = ({ step, index, isActive, onHover, onTap }) => {
  const rgb = step.accentRGB;

  return (
    <motion.button
      type="button"
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onTap}
      animate={{
        opacity: isActive ? 1 : 0.62,
        scale: isActive ? 1 : 0.98,
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-left rounded-2xl p-5 sm:p-6 transition-colors focus:outline-none"
      style={{
        background: isActive
          ? `linear-gradient(160deg, rgba(${rgb}, 0.08), rgba(14, 22, 40, 0.92))`
          : "rgba(15, 23, 42, 0.5)",
        border: isActive
          ? `1px solid rgba(${rgb}, 0.45)`
          : "1px solid rgba(30, 41, 59, 1)",
        boxShadow: isActive
          ? `0 24px 60px -24px rgba(${rgb}, 0.35), 0 0 0 1px rgba(${rgb}, 0.04) inset`
          : "none",
      }}
      data-testid={`diff-step-${index}`}
      data-active={isActive}
      aria-pressed={isActive}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors"
        style={{
          background: `rgba(${rgb}, ${isActive ? 0.14 : 0.08})`,
          border: `1px solid rgba(${rgb}, ${isActive ? 0.4 : 0.2})`,
          color: `rgba(${rgb}, 0.95)`,
        }}
      >
        {step.icon}
      </div>

      {/* Step label */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[10px] font-mono text-slate-600 tabular-nums">
          0{index + 1}
        </span>
        <h3 className="font-satoshi font-semibold text-lg sm:text-xl text-white tracking-tight">
          {step.label}
        </h3>
      </div>

      <p className="text-[13px] text-slate-400 leading-relaxed">{step.copy}</p>

      {/* Active glow — sits behind the card */}
      {isActive && (
        <motion.span
          aria-hidden
          layoutId="diff-active-glow"
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 0 1px rgba(${rgb}, 0.35)`,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        />
      )}
    </motion.button>
  );
};

export default DifferentiationSection;
