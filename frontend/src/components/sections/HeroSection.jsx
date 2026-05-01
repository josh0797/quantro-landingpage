import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { trackCTAClick } from "../../lib/analytics";
import HeroDashboardPreview from "../HeroDashboardPreview";

/**
 * Hero Section — optimized for performance and conversion clarity.
 *
 * Static text (no cascade / fade / glow pulse / teaser / signal layer).
 * Only two live micro-behaviours remain:
 *   1. The dashboard preview keeps its own subtle loop (counters, live dot).
 *   2. A micro-copy above the dashboard crossfades between two lines to
 *      anchor the conversion pitch:
 *        "Esto ya está pasando en tu negocio." → "Solo necesitas aprobar."
 *
 * Primary CTA navigates to `/comparacion` so visitors move from curiosity
 * to self-qualification with one click.
 */

const MICROCOPY_DELAY_MS = 2600; // 2–3 seconds before swap

export const HeroSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Microcopy crossfade — starts on state 0, switches to state 1 after a
  // short pause, and stays there. Only text changes; container height stays
  // fixed so nothing else reflows.
  const [microIndex, setMicroIndex] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setMicroIndex(1), MICROCOPY_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const microcopy = isEs
    ? ["Esto ya está pasando en tu negocio.", "Solo necesitas aprobar."]
    : ["This is already happening in your business.", "You just need to approve."];

  const comparisonPath = isEs ? "/comparacion" : "/comparison";

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0F1C 0%, #030712 100%)" }}
      data-testid="hero-section"
    >
      {/* Ambient orbs — static, no animation */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#00F5FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A020FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ─────── Left column — static text ─────── */}
          <div className="order-1">
            {/* Eyebrow */}
            <p
              className="text-[11px] sm:text-[12px] font-mono tracking-[0.3em] uppercase text-slate-500 mb-5"
              data-testid="hero-preheader"
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.9)]" />
                {isEs ? "Mientras tú dormías…" : "While you were sleeping…"}
              </span>
            </p>

            {/* Headline — static */}
            <h1
              className="font-satoshi font-bold text-[32px] sm:text-[44px] lg:text-[56px] xl:text-[64px] leading-[1.1] tracking-tight text-white mb-4"
              data-testid="hero-headline"
            >
              {isEs ? (
                <>
                  Despierta con{" "}
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                    decisiones listas
                  </span>{" "}
                  para actuar.
                </>
              ) : (
                <>
                  Wake up with{" "}
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                    ready decisions
                  </span>{" "}
                  to act.
                </>
              )}
            </h1>

            {/* Subheadline */}
            <p
              className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed mb-6 max-w-xl"
              data-testid="hero-subheadline"
            >
              {isEs
                ? "Quantro OS conecta tus datos, detecta oportunidades y te propone acciones claras — y con Quantro Flow, las ejecuta por ti."
                : "Quantro OS connects your data, detects opportunities and proposes clear actions — and with Quantro Flow, executes them for you."}
            </p>

            {/* CTAs — primary now routes to /comparacion */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                to={comparisonPath}
                onClick={() => trackCTAClick("hero_cta_comparison")}
                className="px-6 py-3.5 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-satoshi font-bold text-base rounded-xl hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all duration-200 hover:scale-[1.02] text-center"
                data-testid="hero-cta-primary"
              >
                {isEs ? "Quantro vs Otros sistemas" : "Quantro vs other systems"}
              </Link>
              <button
                onClick={() => scrollToSection("interactive-demo")}
                className="px-6 py-3.5 border border-slate-600 text-white font-medium text-base rounded-xl hover:border-slate-500 hover:bg-slate-800/30 transition-all duration-200"
                data-testid="hero-cta-secondary"
              >
                {isEs ? "Ver cómo funciona" : "See how it works"}
              </button>
            </div>

            {/* Social proof — Notion-style, static */}
            <div className="space-y-2" data-testid="hero-social-proof">
              <div className="flex items-center gap-2.5 text-[13px] text-slate-300/90">
                <span className="flex text-[#FACC15]/90" aria-label="5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span className="font-normal tracking-tight">
                  {isEs
                    ? "\u201CDonde se toman decisiones, está Quantro.\u201D"
                    : "\u201CWhere decisions are made, Quantro is there.\u201D"}
                </span>
              </div>

              <div
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] tracking-[0.22em] uppercase text-slate-500/70"
                data-testid="hero-social-companies"
              >
                {["Grupo Nexo", "Altura Retail", "Nodo Studios", "Grupo OCP"].map((c, i, arr) => (
                  <React.Fragment key={c}>
                    <span>{c}</span>
                    {i < arr.length - 1 && <span className="text-slate-600/50" aria-hidden>·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* PDF download — static */}
            <a
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
              <span>{isEs ? "Descarga el Quantro OS Overview (PDF)" : "Download the Quantro OS Overview (PDF)"}</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>

          {/* ─────── Right column — dashboard + crossfading microcopy ─────── */}
          <div className="order-2 lg:order-2 relative">
            {/* Microcopy above dashboard — only animated element on the left-side stack.
                Fixed-height wrapper so layout doesn't reflow when the text changes. */}
            <div
              className="mb-3 text-center sm:text-left min-h-[18px]"
              data-testid="hero-microcopy"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={microIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[11.5px] font-medium text-slate-400 leading-tight"
                >
                  {microcopy[microIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
