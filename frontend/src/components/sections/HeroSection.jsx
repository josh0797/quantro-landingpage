import React, { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { trackCTAClick } from "../../lib/analytics";

// Mobile users get the dashboard as a separate chunk so the first paint is
// pure text (~< 10KB main). Desktop users preload the chunk on mount so
// they don't see the Suspense fallback — they still get an instant-looking
// hero, just with parallel network fetch.
const HeroDashboardPreview = lazy(() => import("../HeroDashboardPreview"));
const preloadHeroDashboard = () => import("../HeroDashboardPreview");

/**
 * Hero Section — lightweight static text + lazy-loaded dashboard.
 *
 * Only two live micro-behaviours:
 *   1. Dashboard preview keeps its own subtle loop (counters, live dot).
 *   2. A micro-copy above the dashboard crossfades between two lines every
 *      ~5.5s to anchor the conversion pitch.
 *
 * Primary CTA navigates to `/comparacion` so visitors move from curiosity
 * to self-qualification with one click.
 */

const MICROCOPY_STEP1_DELAY_MS = 4800; // initial → step 1 (slowed by +2s)
const MICROCOPY_STEP2_DELAY_MS = 7500; // initial → step 2 (slowed by +2s)
const MOBILE_BREAKPOINT = "(max-width: 1023px)"; // Tailwind lg = 1024px

export const HeroSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Dashboard chunk strategy ──────────────────────────────────────────
  // Detect desktop synchronously (if `window` is available) so the very first
  // render can already decide whether to pre-warm the chunk. matchMedia is
  // cheap and won't cause hydration mismatch in CRA's CSR-only build.
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia(MOBILE_BREAKPOINT).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    const handler = (e) => setIsDesktop(!e.matches);
    // Desktop preloads the chunk immediately so Suspense never shows the
    // fallback. Mobile defers the fetch.
    if (!mq.matches) preloadHeroDashboard();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Microcopy crossfade ───────────────────────────────────────────────
  // Three states now:
  //   0: "Mira a Quantro en acción." — primer frame (calma, invita).
  //   1: "Esto ya está pasando en tu negocio."
  //   2: "Solo necesitas aprobar."
  // Desktop: auto-advances 0→1 (2.8s) then 1→2 (5.5s).
  // Mobile: 0→1 when the user starts scrolling past ~80px, 1→2 past ~260px.
  const [microIndex, setMicroIndex] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
    if (!isMobile) {
      const t1 = setTimeout(() => setMicroIndex(1), MICROCOPY_STEP1_DELAY_MS);
      const t2 = setTimeout(() => setMicroIndex(2), MICROCOPY_STEP2_DELAY_MS);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 260) setMicroIndex(2);
      else if (y > 80) setMicroIndex((i) => (i < 1 ? 1 : i));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const microcopy = isEs
    ? [
        "Mira a Quantro en acción.",
        "Esto ya está pasando en tu negocio.",
        "Solo necesitas aprobar.",
      ]
    : [
        "Watch Quantro in action.",
        "This is already happening in your business.",
        "You just need to approve.",
      ];

  const comparisonPath = isEs ? "/comparacion" : "/comparison";

  // Paired company names — 2 per line for a quieter row.
  const companyPairs = [
    ["Grupo Nexo", "Altura Retail"],
    ["Nodo Studios", "Grupo OCP"],
  ];

  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0F1C 0%, #030712 100%)" }}
      data-testid="hero-section"
    >
      {/* Ambient orbs — static */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#00F5FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A020FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ─────── Left column — static text ─────── */}
          <div className="order-1">
            {/* Pre-header — Apple-level eyebrow. Inter/system font, medium weight,
                gentle tracking, 65% opacity. No mono/bold. */}
            <p
              className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-slate-400 mb-5"
              style={{
                fontFamily:
                  "-apple-system, 'SF Pro Text', Inter, 'Helvetica Neue', Arial, sans-serif",
                opacity: 0.65,
              }}
              data-testid="hero-preheader"
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.9)]" />
                {isEs
                  ? "Quantro piensa por ti mientras descansas"
                  : "Quantro thinks for you while you rest"}
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

            {/* Subheadline — short, benefit-focused, 3 rhythmic beats */}
            <p
              className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed mb-6 max-w-xl"
              data-testid="hero-subheadline"
            >
              {isEs ? (
                <>
                  Quantro conecta tus datos, detecta oportunidades y te propone acciones claras.
                  <br />
                  <span className="text-slate-300">Tú decides. Quantro ejecuta. Quantro Flow automatiza.</span>
                </>
              ) : (
                <>
                  Quantro connects your data, spots opportunities and proposes clear actions.
                  <br />
                  <span className="text-slate-300">You decide. Quantro executes. Quantro Flow automates.</span>
                </>
              )}
            </p>

            {/* CTAs */}
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

            {/* Social proof — paired rows, low opacity */}
            <div className="space-y-2 opacity-70" data-testid="hero-social-proof">
              <div className="flex items-center gap-2.5 text-[13px] text-slate-200">
                <span className="flex text-[#FACC15]/90" aria-label="5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span className="font-normal tracking-tight">
                  {isEs
                    ? "Empresas que deciden mejor, usan Quantro"
                    : "Companies that decide better, run on Quantro"}
                </span>
              </div>

              <div
                className="text-[10.5px] tracking-[0.22em] uppercase text-slate-400 space-y-0.5"
                data-testid="hero-social-companies"
              >
                {companyPairs.map((pair, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span>{pair[0]}</span>
                    <span className="text-slate-500" aria-hidden>·</span>
                    <span>{pair[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF download */}
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

          {/* ─────── Right column — microcopy + dashboard ─────── */}
          <div className="order-2 lg:order-2 relative">
            {/* Microcopy above dashboard — crossfade only, fixed-height wrapper */}
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
                  transition={{ duration: 0.5 }}
                  className="text-[11.5px] font-medium text-slate-400 leading-tight"
                >
                  {microcopy[microIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Dashboard — lazy-loaded chunk.
                Suspense fallback matches the dashboard's approximate size so
                there's no layout shift on mobile. Desktop preloads the chunk
                in useEffect so the fallback is never visible. */}
            <Suspense fallback={<DashboardSkeleton />}>
              <HeroDashboardPreview />
            </Suspense>
            {/* The desktop-preload effect referenced isDesktop. Reference it
                here to keep the state alive in fast-refresh environments. */}
            <span aria-hidden className="sr-only" data-desktop={isDesktop ? "1" : "0"} />
          </div>
        </div>
      </div>
    </section>
  );
};

// =========================================================================
// DashboardSkeleton — size-matched placeholder for Suspense. Keeps the hero
// column from collapsing while the dashboard chunk streams in.
// =========================================================================
const DashboardSkeleton = () => (
  <div
    className="relative rounded-2xl overflow-hidden"
    style={{
      aspectRatio: "1.6 / 1",
      background:
        "linear-gradient(180deg, rgba(14, 22, 40, 0.6) 0%, rgba(5, 10, 24, 0.5) 100%)",
      border: "1px solid rgba(148, 163, 184, 0.08)",
    }}
    data-testid="hero-dashboard-skeleton"
    aria-hidden
  >
    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/30">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
      </div>
    </div>
    <div className="p-5 space-y-3">
      <div className="h-20 rounded-lg bg-white/[0.02]" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 rounded-lg bg-white/[0.02]" />
        <div className="h-16 rounded-lg bg-white/[0.02]" />
      </div>
      <div className="space-y-1.5 pt-2">
        <div className="h-3 rounded bg-white/[0.02]" />
        <div className="h-3 rounded bg-white/[0.02] w-3/4" />
      </div>
    </div>
  </div>
);

export default HeroSection;
