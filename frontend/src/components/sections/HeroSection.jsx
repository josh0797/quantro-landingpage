import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";
import { trackCTAClick } from "../../lib/analytics";
import { usePlatformAccess } from "../../hooks/usePlatformAccess";
import HeroDashboardPreview from "../HeroDashboardPreview";

// ==========================================================================
// Hero Section — keynote-style narrative
//
// 8–12s mini-story the user experiences without reading:
//   (1) Midnight silence: "Mientras tú dormías…"
//   (2) Headline cascades word-by-word, "decisiones listas" glows softly
//   (3) Floating signals drift in — the system is thinking
//   (4) Signals converge → a single decision card
//   (5) Dashboard reveals with zoom + fade
//   (6) Micro-copy rotates: "Esto ya está pasando" → "Solo necesitas aprobar"
//   (7) CTAs slide up (only AFTER the wow moment)
//   (8) Signals re-enter subtly forever so the hero feels alive
//
// Respects prefers-reduced-motion by collapsing the narrative to a
// static end-state snapshot.
// ==========================================================================

// Timings (seconds) — keep short delays early, give the dashboard room later.
const T = {
  preHeader: 0.1,
  h1a: 0.5,          // "Despierta con"
  h1b: 1.0,          // "decisiones listas"
  h1c: 1.55,         // "para actuar."
  sub: 2.1,
  signalsIn: 2.6,    // signals start floating
  signalsConverge: 4.9,
  cardVisible: 5.1,  // decision card visible
  dashboard: 5.9,    // dashboard reveal
  microcopyA: 6.4,   // "Esto ya está pasando…"
  microcopyB: 8.2,   // "Solo necesitas aprobar."
  ctas: 6.8,
  social: 7.6,
  pdf: 8.0,
  loopEvery: 9.5,    // subtle signal loop (seconds)
};

export const HeroSection = () => {
  const { language } = useLanguage();
  const { open: openPlatformAccess } = usePlatformAccess();
  const reduce = useReducedMotion();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0F1C 0%, #030712 100%)" }}
      data-testid="hero-section"
    >
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#00F5FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A020FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ─────── Left column — narrative text ─────── */}
          <div className="order-1">
            {/* Pre-header micro-copy — "Mientras tú dormías…" */}
            <motion.p
              initial={reduce ? { opacity: 0.8 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ delay: reduce ? 0 : T.preHeader, duration: 0.6 }}
              className="text-[11px] sm:text-[12px] font-mono tracking-[0.3em] uppercase text-slate-500 mb-5"
              data-testid="hero-preheader"
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.9)]" />
                {language === "es" ? "Mientras tú dormías…" : "While you were sleeping…"}
              </span>
            </motion.p>

            {/* Headline — word-by-word cascade. No block fade: each chunk
                breathes in sequentially to feel like a keynote reveal. */}
            <h1
              className="font-satoshi font-bold text-[32px] sm:text-[44px] lg:text-[56px] xl:text-[64px] leading-[1.1] tracking-tight text-white mb-4"
              data-testid="hero-headline"
            >
              <HeadlineChunk delay={T.h1a} reduce={reduce}>
                {language === "es" ? "Despierta con " : "Wake up with "}
              </HeadlineChunk>
              <HeadlineChunk delay={T.h1b} reduce={reduce} glow>
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                  {language === "es" ? "decisiones listas" : "ready decisions"}
                </span>
              </HeadlineChunk>
              <HeadlineChunk delay={T.h1c} reduce={reduce}>
                {language === "es" ? " para actuar." : " to act."}
              </HeadlineChunk>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : T.sub, duration: 0.6 }}
              className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed mb-6 max-w-xl"
              data-testid="hero-subheadline"
            >
              {language === "es"
                ? "Quantro OS conecta tus datos, detecta oportunidades y te propone acciones claras — y con Quantro Flow, las ejecuta por ti."
                : "Quantro OS connects your data, detects opportunities and proposes clear actions — and with Quantro Flow, executes them for you."}
            </motion.p>

            {/* CTAs — arrive AFTER the wow moment */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : T.ctas, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <motion.button
                onClick={() => {
                  trackCTAClick("hero_open_platform_access");
                  openPlatformAccess();
                }}
                animate={
                  reduce
                    ? { boxShadow: "0 0 0 0 rgba(0, 245, 255, 0)" }
                    : { boxShadow: [
                        "0 0 0 0 rgba(0, 245, 255, 0)",
                        "0 0 28px 0 rgba(0, 245, 255, 0.32)",
                        "0 0 0 0 rgba(0, 245, 255, 0)",
                      ] }
                }
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: T.ctas + 1 }}
                className="px-6 py-3.5 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-satoshi font-bold text-base rounded-xl hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all duration-200 hover:scale-[1.02]"
                data-testid="hero-cta-primary"
              >
                {language === "es" ? "Ver mi negocio con Quantro" : "See my business with Quantro"}
              </motion.button>
              <button
                onClick={() => scrollToSection("interactive-demo")}
                className="px-6 py-3.5 border border-slate-600 text-white font-medium text-base rounded-xl hover:border-slate-500 hover:bg-slate-800/30 transition-all duration-200"
                data-testid="hero-cta-secondary"
              >
                {language === "es" ? "Ver cómo funciona" : "See how it works"}
              </button>
            </motion.div>

            {/* Refined social proof — Notion-style, light, quiet */}
            <RefinedSocialProof language={language} reduce={reduce} delay={T.social} />

            {/* PDF download — unchanged */}
            <motion.a
              initial={reduce ? { opacity: 0.9 } : { opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: reduce ? 0 : T.pdf, duration: 0.6 }}
              href="/assets/quantro-os-overview.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick("hero_pdf_overview")}
              className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-[#00F5FF] transition-colors group"
              data-testid="hero-pdf-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
              <span>{language === "es" ? "Descarga el Quantro OS Overview (PDF)" : "Download the Quantro OS Overview (PDF)"}</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </motion.a>
          </div>

          {/* ─────── Right column — narrative stage ─────── */}
          <div className="order-2 lg:order-2 relative min-h-[360px] sm:min-h-[460px]">
            <HeroNarrativeStage language={language} reduce={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
};

// =========================================================================
// HeadlineChunk — single word/phrase that fades + slides up on cue.
// When `glow` is true, a soft repeating glow plays after the reveal.
// =========================================================================
const HeadlineChunk = ({ children, delay, reduce, glow = false }) => (
  <motion.span
    initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
    animate={
      glow
        ? { opacity: 1, y: 0 }
        : { opacity: 1, y: 0 }
    }
    transition={{ delay: reduce ? 0 : delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={glow ? "inline-block" : "inline"}
    style={
      glow
        ? {
            filter: reduce ? "none" : "drop-shadow(0 0 0 rgba(0,245,255,0))",
          }
        : undefined
    }
  >
    {glow && !reduce ? (
      <motion.span
        initial={{ filter: "drop-shadow(0 0 0 rgba(0,245,255,0))" }}
        animate={{
          filter: [
            "drop-shadow(0 0 0 rgba(0,245,255,0))",
            "drop-shadow(0 0 14px rgba(0,245,255,0.45))",
            "drop-shadow(0 0 6px rgba(0,245,255,0.18))",
            "drop-shadow(0 0 12px rgba(0,245,255,0.35))",
          ],
        }}
        transition={{
          duration: 3.6,
          ease: "easeInOut",
          repeat: Infinity,
          delay: delay + 0.4,
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
    ) : (
      children
    )}
  </motion.span>
);

// =========================================================================
// RefinedSocialProof — Notion-style: 5 stars, single quote, light company
// row. No heavy boxes, no long paragraphs.
// =========================================================================
const RefinedSocialProof = ({ language, reduce, delay }) => {
  const companies = ["Grupo Nexo", "Altura Retail", "Nodo Studios", "Grupo OCP"];
  return (
    <motion.div
      initial={reduce ? { opacity: 0.9 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : delay, duration: 0.7 }}
      className="space-y-2"
      data-testid="hero-social-proof"
    >
      {/* Stars + quote in one quiet line */}
      <div className="flex items-center gap-2.5 text-[13px] text-slate-300/90">
        <span className="flex text-[#FACC15]/90" aria-label="5 stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </span>
        <span className="font-normal tracking-tight">
          {language === "es"
            ? "\u201CDonde se toman decisiones, está Quantro.\u201D"
            : "\u201CWhere decisions are made, Quantro is there.\u201D"}
        </span>
      </div>

      {/* Company names — tiny, uppercase, quiet */}
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] tracking-[0.22em] uppercase text-slate-500/70"
        data-testid="hero-social-companies"
      >
        {companies.map((c, i) => (
          <React.Fragment key={c}>
            <span>{c}</span>
            {i < companies.length - 1 && (
              <span className="text-slate-600/50" aria-hidden>·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

// =========================================================================
// HeroNarrativeStage — the "right column" stage.
// Sequences: signals drifting → converge → decision card → dashboard reveal
// (dashboard always rendered, faded until signals clear so the morph feels
// continuous). A rotating micro-copy sits above the dashboard.
// =========================================================================
const HeroNarrativeStage = ({ language, reduce }) => {
  const isEs = language === "es";

  const signals = isEs
    ? [
        { text: "+22% revenue", accent: "#00F5FF", x: "6%", y: "8%", dur: 6 },
        { text: "stock optimizado", accent: "#22D3EE", x: "62%", y: "2%", dur: 7 },
        { text: "5 oportunidades detectadas", accent: "#A5F3FC", x: "2%", y: "62%", dur: 6.5 },
        { text: "clientes satisfechos", accent: "#C084FC", x: "68%", y: "58%", dur: 7.5 },
        { text: "100% tareas asignadas", accent: "#00F5FF", x: "28%", y: "80%", dur: 6.8 },
      ]
    : [
        { text: "+22% revenue", accent: "#00F5FF", x: "6%", y: "8%", dur: 6 },
        { text: "stock optimized", accent: "#22D3EE", x: "62%", y: "2%", dur: 7 },
        { text: "5 opportunities detected", accent: "#A5F3FC", x: "2%", y: "62%", dur: 6.5 },
        { text: "customers delighted", accent: "#C084FC", x: "68%", y: "58%", dur: 7.5 },
        { text: "100% tasks assigned", accent: "#00F5FF", x: "28%", y: "80%", dur: 6.8 },
      ];

  // Track which microcopy is showing over the dashboard
  const [microIndex, setMicroIndex] = useState(0);
  useEffect(() => {
    if (reduce) {
      setMicroIndex(1);
      return;
    }
    const t1 = setTimeout(() => setMicroIndex(0), T.microcopyA * 1000);
    const t2 = setTimeout(() => setMicroIndex(1), T.microcopyB * 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce]);

  const microcopy = isEs
    ? ["Esto ya está pasando en tu negocio.", "Solo necesitas aprobar."]
    : ["This is already happening in your business.", "You just need to approve."];

  return (
    <div className="relative w-full" data-testid="hero-stage">
      {/* Signals layer — floats in then fades out (also subtly loops every
          ~9.5s so the hero always feels alive) */}
      {!reduce && (
        <SignalsLayer
          signals={signals}
          showStart={T.signalsIn}
          showEnd={T.signalsConverge + 0.6}
          loopEvery={T.loopEvery}
        />
      )}

      {/* Decision card — converges in the middle, then fades */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{
            opacity: [0, 0, 1, 1, 0],
            scale: [0.9, 0.9, 1, 1, 1.02],
            filter: ["blur(8px)", "blur(6px)", "blur(0px)", "blur(0px)", "blur(4px)"],
          }}
          transition={{
            duration: T.dashboard,
            times: [0, T.cardVisible / T.dashboard - 0.12, T.cardVisible / T.dashboard, (T.cardVisible + 0.5) / T.dashboard, 1],
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          data-testid="hero-decision-card"
          aria-hidden
        >
          <div
            className="rounded-2xl px-5 py-4 text-center"
            style={{
              background:
                "linear-gradient(160deg, rgba(14, 22, 40, 0.95), rgba(5, 10, 24, 0.92))",
              border: "1px solid rgba(0, 245, 255, 0.35)",
              boxShadow: "0 30px 80px -20px rgba(0, 245, 255, 0.4)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#7FF5FF] mb-1">
              {isEs ? "Plan de crecimiento activo" : "Growth plan active"}
            </p>
            <p className="font-satoshi font-semibold text-white text-[15px] leading-tight">
              {isEs ? "3 acciones ejecutándose" : "3 actions running"}
            </p>
          </div>
        </motion.div>
      )}

      {/* Micro-copy above the dashboard */}
      <motion.div
        initial={reduce ? { opacity: 0.85 } : { opacity: 0, y: -4 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ delay: reduce ? 0 : T.microcopyA, duration: 0.6 }}
        className="mb-3 text-center sm:text-left text-[11.5px] font-medium text-slate-400 min-h-[18px]"
        data-testid="hero-microcopy"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={microIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
          >
            {microcopy[microIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Dashboard reveal — fades in with slight zoom after signals clear */}
      <motion.div
        initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reduce ? 0 : T.dashboard, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
        data-testid="hero-dashboard-reveal"
      >
        <HeroDashboardPreview />
      </motion.div>
    </div>
  );
};

// =========================================================================
// SignalsLayer — floating translucent pills that drift gently, then converge
// toward the center before fading. Loops softly so the hero feels alive.
// =========================================================================
const SignalsLayer = ({ signals, showStart, showEnd, loopEvery }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), loopEvery * 1000);
    return () => clearInterval(id);
  }, [loopEvery]);

  const cycleDelay = tick === 0 ? showStart : 0;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      data-testid="hero-signals-layer"
      aria-hidden
      key={tick}
    >
      {signals.map((s, i) => (
        <motion.span
          key={`${s.text}-${i}-${tick}`}
          initial={{ opacity: 0, x: 0, y: 14, scale: 0.9, filter: "blur(6px)" }}
          animate={{
            opacity: tick === 0
              ? [0, 0.55, 0.55, 0.0]
              : [0, 0.28, 0],
            y: [14, -6, -10, -30],
            x: tick === 0 ? [0, 0, 0, `calc(40% - ${s.x})`] : [0, 0, 0],
            scale: tick === 0 ? [0.9, 1, 1, 0.85] : [0.9, 0.95, 0.9],
            filter: tick === 0
              ? ["blur(6px)", "blur(0px)", "blur(0px)", "blur(3px)"]
              : ["blur(6px)", "blur(1px)", "blur(5px)"],
          }}
          transition={{
            delay: cycleDelay + i * 0.18,
            duration: tick === 0 ? showEnd - showStart : 3.6,
            times: tick === 0 ? [0, 0.22, 0.7, 1] : [0, 0.4, 1],
            ease: "easeInOut",
          }}
          className="absolute inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-tight whitespace-nowrap"
          style={{
            left: s.x,
            top: s.y,
            background: `${s.accent}12`,
            border: `1px solid ${s.accent}3D`,
            color: "#E2E8F0",
            boxShadow: `0 0 18px ${s.accent}22`,
            backdropFilter: "blur(4px)",
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: s.accent, boxShadow: `0 0 6px ${s.accent}` }}
          />
          {s.text}
        </motion.span>
      ))}
    </div>
  );
};

export default HeroSection;
