import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  X as CloseX,
  Minus,
  Sparkles,
  Brain,
  Zap,
  Target,
  Workflow,
  Users,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Play,
} from "lucide-react";
import { QuantroLogoMark } from "../components/QuantroLogoMark";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { useLanguage } from "../hooks/useLanguage";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { trackCTAClick } from "../lib/analytics";
import { applyPageMeta } from "../lib/pageMeta";

/**
 * Quantro vs competitors comparison page.
 *
 * Accepts optional `focusKey` prop to render a focused variant:
 *   - "ninety"       → /vs-ninety (spotlight: Quantro vs Ninety)
 *   - "eos"          → /vs-eos
 *   - "notion"       → /vs-notion (Notion + Excel + CRM stack)
 *   - null/undefined → /comparacion + /comparison (general)
 *
 * Non-focused competitor columns render dimmed so the page still provides
 * full context, but the story centers on the user's current alternative.
 */

const COMPETITORS = [
  { key: "quantro", name: "Quantro", tagline: { es: "Sistema operativo AOS", en: "AOS Operating System" }, accent: "#00F5FF", isQuantro: true },
  { key: "ninety", name: "Ninety", tagline: { es: "Tracker alineado a EOS", en: "EOS-aligned tracker" }, accent: "#94A3B8" },
  { key: "eos", name: "EOS One", tagline: { es: "Toolset EOS tradicional", en: "Traditional EOS toolset" }, accent: "#94A3B8" },
  { key: "notion", name: "Notion + Excel + CRM", tagline: { es: "Stack de herramientas separadas", en: "Stack of separate tools" }, accent: "#94A3B8" },
];

// "Otros sistemas" column metadata. We collapse Ninety / EOS / Notion+Excel
// into a single consolidated column on the main table so the comparison
// reads at a glance (Quantro vs alternatives). Individual competitor data is
// preserved per-row for the focusKey variant pages (/vs-ninety etc.).
const OTHERS_META = {
  es: {
    name: "Otros sistemas",
    tagline: "Ninety · EOS · Notion · Excel",
  },
  en: {
    name: "Other systems",
    tagline: "Ninety · EOS · Notion · Excel",
  },
};

const ROWS = [
  { key: "dashboard", es: "Dashboard en tiempo real", en: "Real-time dashboard",
    quantro: "full", ninety: "partial", eos: "partial", notion: "none", others: "partial" },
  { key: "scorecard", es: "Scorecard semanal", en: "Weekly scorecard",
    quantro: "full", ninety: "full", eos: "full", notion: "partial", others: "partial" },
  { key: "rocks", es: "Gestión de objetivos (Rocks)", en: "Rocks / objectives",
    quantro: "full", ninety: "full", eos: "full", notion: "partial", others: "partial" },
  { key: "issues", es: "Gestión de issues", en: "Issues tracking",
    quantro: "full", ninety: "full", eos: "full", notion: "partial", others: "partial" },
  { key: "todos", es: "To-Dos operativos", en: "Operational to-dos",
    quantro: "full", ninety: "full", eos: "full", notion: "partial", others: "partial" },
  { key: "people", es: "Estructura organizacional (People OS)", en: "Org structure (People OS)",
    quantro: "full", ninety: "partial", eos: "partial", notion: "none", others: "partial" },
  { key: "ai-detect", es: "IA que detecta problemas automáticamente", en: "AI that detects problems automatically",
    quantro: "full", ninety: "none", eos: "none", notion: "none", others: "none" },
  { key: "ai-decisions", es: "Generación automática de decisiones", en: "Automatic decision generation",
    quantro: "full", ninety: "none", eos: "none", notion: "none", others: "none" },
  { key: "recommendations", es: "Recomendaciones accionables", en: "Actionable recommendations",
    quantro: "full", ninety: "none", eos: "none", notion: "none", others: "none" },
  { key: "one-system", es: "Integración completa en un solo sistema", en: "Full integration in one system",
    quantro: "full", ninety: "partial", eos: "partial", notion: "none", others: "partial" },
  { key: "flow", es: "Automatización de ejecución (Flow)", en: "Execution automation (Flow)",
    quantro: "full", ninety: "none", eos: "none", notion: "none", others: "none" },
  { key: "revenue", es: "Inteligencia financiera / Revenue", en: "Financial intelligence / Revenue",
    quantro: "full", ninety: "none", eos: "none", notion: "none", others: "none" },
  // NEW — inventory intelligence differentiator
  { key: "inventario-inteligente",
    es: "Inventario Inteligente",
    en: "Smart Inventory",
    quantro: "full", ninety: "none", eos: "none", notion: "none", others: "none",
    tooltips: {
      quantro: {
        es: "Detecta exceso y faltantes automáticamente y ofrece decisiones de compra o promociones listas para implementar.",
        en: "Automatically detects excess and shortages and delivers purchase or promo decisions ready to execute.",
      },
      ninety: {
        es: "No contempla inventario operativo.",
        en: "Doesn't cover operational inventory.",
      },
      eos: {
        es: "No contempla inventario operativo.",
        en: "Doesn't cover operational inventory.",
      },
      notion: {
        es: "Requiere hojas de cálculo y revisión manual constante.",
        en: "Requires spreadsheets and constant manual review.",
      },
      others: {
        es: "Ninguno conecta datos de inventario con decisiones automáticas.",
        en: "None connect inventory data with automatic decisions.",
      },
    },
  },
  // Differentiator row — execution visibility with per-cell tooltips and a Live badge for Quantro.
  { key: "execution-visibility",
    es: "Visibilidad de ejecución en tiempo real",
    en: "Real-time execution visibility",
    quantro: "full", ninety: "partial", eos: "partial", notion: "none", others: "partial",
    quantroLive: true,
    tooltips: {
      quantro: {
        es: "No solo sabes qué se debe hacer. Sabes en qué se está trabajando, cuánto tiempo toma y dónde se está perdiendo.",
        en: "You don't just know what should be done. You know what's being worked on, how long it takes and where it's slipping.",
      },
      ninety: {
        es: "Enfocados en seguimiento de metas, no en ejecución diaria.",
        en: "Focused on goal tracking, not daily execution.",
      },
      eos: {
        es: "Enfocados en seguimiento de metas, no en ejecución diaria.",
        en: "Focused on goal tracking, not daily execution.",
      },
      notion: {
        es: "Requiere procesos manuales y disciplina del equipo.",
        en: "Requires manual processes and team discipline.",
      },
      others: {
        es: "Enfocados en seguimiento, no en ejecución. O dependen de procesos manuales.",
        en: "Focused on tracking, not execution. Or rely on manual processes.",
      },
    },
  },
];

const CELL_ICON = {
  full: { Icon: Check, cls: "text-[#00F5FF]", ariaEs: "Disponible", ariaEn: "Available" },
  partial: { Icon: Minus, cls: "text-amber-400", ariaEs: "Parcial", ariaEn: "Partial" },
  none: { Icon: CloseX, cls: "text-slate-600", ariaEs: "No disponible", ariaEn: "Not available" },
};

const FOCUS_META = {
  ninety:  { displayName: "Ninety", key: "ninety" },
  eos:     { displayName: "EOS One", key: "eos" },
  notion:  { displayName: "Notion + Excel + CRM", key: "notion" },
};

// =========================================================================
// Open Graph config per variant
// =========================================================================

const BASE_URL = "https://quantro.io";

const META_CONFIG = {
  general: {
    path: { es: "/comparacion", en: "/comparison" },
    title: { es: "Comparación | Quantro", en: "Comparison | Quantro" },
    description: {
      es: "Compara Quantro con Ninety, EOS One y herramientas tradicionales. Ve por qué es un sistema operativo, no otra app.",
      en: "Compare Quantro with Ninety, EOS One and traditional tools. See why it's an operating system, not another app.",
    },
    ogTitle: { es: "Quantro vs otros sistemas", en: "Quantro vs other systems" },
    ogDescription: {
      es: "No todas las plataformas están diseñadas para operar tu negocio.",
      en: "Not every platform is designed to run your business.",
    },
  },
  ninety: {
    path: { es: "/vs-ninety", en: "/vs-ninety" },
    title: { es: "Quantro vs Ninety | Quantro", en: "Quantro vs Ninety | Quantro" },
    description: {
      es: "Ve cómo Quantro va más allá del tracking EOS que ofrece Ninety.",
      en: "See how Quantro goes beyond the EOS tracking Ninety offers.",
    },
    ogTitle: { es: "Quantro vs Ninety", en: "Quantro vs Ninety" },
    ogDescription: {
      es: "Ve cómo Quantro va más allá del tracking EOS.",
      en: "See how Quantro goes beyond EOS tracking.",
    },
  },
  eos: {
    path: { es: "/vs-eos", en: "/vs-eos" },
    title: { es: "Quantro vs EOS One | Quantro", en: "Quantro vs EOS One | Quantro" },
    description: {
      es: "Compara cómo Quantro conecta estrategia, decisiones y ejecución en un solo sistema.",
      en: "See how Quantro connects strategy, decisions and execution in a single system.",
    },
    ogTitle: { es: "Quantro vs EOS One", en: "Quantro vs EOS One" },
    ogDescription: {
      es: "Compara cómo Quantro conecta estrategia, decisiones y ejecución en un solo sistema.",
      en: "See how Quantro connects strategy, decisions and execution in one system.",
    },
  },
  notion: {
    path: { es: "/vs-notion", en: "/vs-notion" },
    title: {
      es: "Quantro vs Notion + Excel + CRM | Quantro",
      en: "Quantro vs Notion + Excel + CRM | Quantro",
    },
    description: {
      es: "Descubre por qué Quantro no solo organiza información, sino que opera tu negocio.",
      en: "Discover why Quantro doesn't just organize information — it runs your business.",
    },
    ogTitle: { es: "Quantro vs Notion", en: "Quantro vs Notion" },
    ogDescription: {
      es: "Descubre por qué Quantro no solo organiza información, sino que opera tu negocio.",
      en: "Discover why Quantro doesn't just organize — it runs your business.",
    },
  },
};

// =========================================================================
// Sections
// =========================================================================

const ComparisonHero = ({ isEs, focusKey, onPrimaryCTA, onSecondaryCTA }) => {
  const title = useMemo(() => {
    if (focusKey && FOCUS_META[focusKey]) {
      const n = FOCUS_META[focusKey].displayName;
      return isEs ? `Quantro vs ${n}` : `Quantro vs ${n}`;
    }
    return isEs ? "Quantro vs otros sistemas" : "Quantro vs other systems";
  }, [isEs, focusKey]);

  return (
    <section className="relative pt-36 pb-20 px-6" data-testid="compare-hero">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 55%)",
        }}
      />
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/[0.05] text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-6"
        >
          <Sparkles size={11} />
          {isEs ? "Comparación" : "Comparison"}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-satoshi font-bold text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl text-slate-300 mt-6 max-w-3xl mx-auto leading-snug"
        >
          {isEs
            ? "No todas las plataformas están diseñadas para operar tu negocio."
            : "Not every platform is designed to run your business."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[15px] text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          {isEs
            ? "Mientras otros sistemas organizan tu trabajo, Quantro entiende tu negocio, detecta oportunidades y te dice exactamente qué hacer."
            : "While other systems organize your work, Quantro understands your business, spots opportunities and tells you exactly what to do."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        >
          <button
            type="button"
            onClick={onPrimaryCTA}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[13px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all"
            data-testid="compare-hero-primary-cta"
          >
            {isEs ? "Empieza por $1 USD" : "Start for $1 USD"}
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={onSecondaryCTA}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-white text-[13px] font-medium hover:bg-white/[0.06] hover:border-white/20 transition-all"
            data-testid="compare-hero-secondary-cta"
          >
            <Play size={12} />
            {isEs ? "Ver cómo funciona Quantro" : "See how Quantro works"}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = ({ isEs }) => {
  const bullets = isEs
    ? [
        "Organizan tareas, pero no generan decisiones",
        "Muestran datos, pero no explican qué hacer",
        "Requieren múltiples herramientas adicionales",
        "No conectan estrategia con ejecución diaria",
        "No detectan problemas automáticamente",
      ]
    : [
        "They organize tasks but don't generate decisions",
        "They show data but don't explain what to do",
        "They require multiple additional tools",
        "They don't connect strategy with daily execution",
        "They don't detect problems automatically",
      ];

  return (
    <section className="relative py-20 px-6" data-testid="compare-problem">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-rose-300/70 mb-3">
            {isEs ? "El patrón" : "The pattern"}
          </p>
          <h2 className="font-satoshi font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            {isEs ? "Lo que otros sistemas no hacen" : "What other systems don't do"}
          </h2>
        </div>

        <ul className="space-y-2.5 max-w-2xl mx-auto">
          {bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="flex items-start gap-3 rounded-lg px-4 py-3 bg-white/[0.015] border border-white/[0.06]"
              data-testid={`compare-problem-bullet-${i}`}
            >
              <span className="mt-0.5 w-5 h-5 rounded-md bg-rose-500/10 border border-rose-500/25 flex items-center justify-center flex-shrink-0">
                <CloseX size={11} className="text-rose-300" strokeWidth={2.8} />
              </span>
              <span className="text-[14px] text-slate-200 leading-snug">{b}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const ComparisonCell = ({ value, isEs, tooltip, live, columnKey }) => {
  const { Icon, cls, ariaEs, ariaEn } = CELL_ICON[value] || CELL_ICON.none;
  const aria = isEs ? ariaEs : ariaEn;

  const cellInner = (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.02] border border-white/[0.06] ${cls}`}
      aria-label={aria}
    >
      <Icon size={14} strokeWidth={2.5} />
    </span>
  );

  // Quantro "Live" pill — sits next to the check on the differentiator row.
  const livePill = live ? (
    <span
      className="ml-1.5 hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.12em] uppercase leading-none"
      style={{
        background: "rgba(0, 245, 255, 0.10)",
        border: "1px solid rgba(0, 245, 255, 0.35)",
        color: "#7FF5FF",
        boxShadow: "0 0 10px rgba(0, 245, 255, 0.18)",
      }}
      data-testid={`compare-live-badge-${columnKey || ""}`}
    >
      <span
        className="w-1 h-1 rounded-full bg-[#00F5FF]"
        style={{ boxShadow: "0 0 6px rgba(0, 245, 255, 0.9)" }}
      />
      {isEs ? "Real-time" : "Real-time"}
    </span>
  ) : null;

  if (!tooltip) {
    return (
      <span className="inline-flex items-center">
        {cellInner}
        {livePill}
      </span>
    );
  }

  // With tooltip — uses Radix tooltip; trigger is the same cell + (optional) live pill.
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center cursor-help focus:outline-none focus:ring-1 focus:ring-[#00F5FF]/40 rounded-full"
          aria-label={`${aria}. ${tooltip[isEs ? "es" : "en"]}`}
          data-testid={`compare-cell-tooltip-${columnKey || ""}`}
        >
          {cellInner}
          {livePill}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className="max-w-[260px] text-[12px] leading-snug font-normal text-slate-100 bg-[#0A0F1C] border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]"
      >
        {tooltip[isEs ? "es" : "en"]}
      </TooltipContent>
    </Tooltip>
  );
};

const ComparisonTable = ({ isEs, focusKey }) => {
  // All 4 competitors are rendered. On focused variants (/vs-ninety, /vs-eos,
  // /vs-notion) the non-focused ones dim to 35% so the comparison narrows
  // visually without losing context.
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false, progress: 0, hasOverflow: false });

  // Track scroll progress (0..1) and edge state. We derive `hasOverflow` so
  // the progress indicator only renders when the table is actually wider than
  // its container (typically mobile/tablet).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const progress = max > 0 ? el.scrollLeft / max : 0;
      setScrollState({
        atStart: el.scrollLeft <= 4,
        atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
        progress,
        hasOverflow: max > 4,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Grid template — wider columns so the longer taglines breathe (previously
  // 140/130/130/160 caused header text like "Tracker alineado a EOS" to bleed
  // across cell boundaries).
  const GRID = "grid-cols-[240px_170px_160px_160px_180px]";
  const STICKY_BG = "#0B1020";
  const QUANTRO_STICKY_BG =
    "linear-gradient(180deg, rgba(0, 245, 255, 0.05), rgba(11, 16, 32, 1))";

  return (
    <section className="relative py-20 px-6" data-testid="compare-table">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]/80 mb-3">
            {isEs ? "Capacidades lado a lado" : "Capabilities side-by-side"}
          </p>
          <h2 className="font-satoshi font-bold text-white text-3xl sm:text-4xl leading-tight tracking-tight">
            {isEs ? "Todo lo que Quantro hace" : "Everything Quantro does"}
          </h2>
          <p className="text-[13px] text-slate-400 mt-3 max-w-xl mx-auto">
            {isEs
              ? "Comparativa directa. Fila por fila. Sin marketing vacío."
              : "A direct, row-by-row comparison. No empty marketing."}
          </p>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ background: STICKY_BG, backdropFilter: "blur(12px)" }}
        >
          {/* Edge fade overlays — positioned above the scroll area but not
              over the sticky columns so the first 2 columns never fade. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-[56px] right-0 w-16 z-20 transition-opacity duration-300"
            style={{
              opacity: scrollState.atEnd ? 0 : 1,
              background:
                "linear-gradient(to left, rgba(11, 16, 32, 1), rgba(11, 16, 32, 0))",
            }}
          />

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto no-scrollbar relative"
            style={{ WebkitOverflowScrolling: "touch" }}
            data-testid="compare-table-scroll"
          >
            <div className={`min-w-[910px] ${GRID} grid`}>
              {/* ─── Header row ─── */}
              <HeaderCell sticky="left-0" align="start" style={{ background: STICKY_BG, zIndex: 15 }}>
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-500">
                  {isEs ? "Funcionalidad" : "Capability"}
                </span>
              </HeaderCell>
              <HeaderCell
                sticky="left-[240px]"
                style={{ background: QUANTRO_STICKY_BG, zIndex: 14 }}
                testId="compare-col-quantro"
              >
                <div className="w-full text-center">
                  <div className="text-[13px] font-bold tracking-tight text-white">Quantro</div>
                  <div className="text-[10px] text-[#7FF5FF]/80 mt-0.5 leading-tight break-words">
                    {isEs ? "Sistema operativo AOS" : "AOS OS"}
                  </div>
                  <span className="inline-block mt-1.5 w-10 h-0.5 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
                </div>
              </HeaderCell>
              {[
                { key: "ninety", name: "Ninety", tagline: isEs ? "Tracker EOS" : "EOS tracker" },
                { key: "eos", name: "EOS One", tagline: isEs ? "EOS tradicional" : "Traditional EOS" },
                { key: "notion", name: "Notion + Excel + CRM", tagline: isEs ? "Stack separado" : "Separate stack" },
              ].map((c) => {
                const dim = focusKey && c.key !== focusKey;
                return (
                  <HeaderCell
                    key={c.key}
                    testId={`compare-col-${c.key}`}
                    style={{ background: STICKY_BG, opacity: dim ? 0.35 : 1 }}
                  >
                    <div className="w-full text-center">
                      <div className="text-[12px] font-bold tracking-tight text-slate-300 leading-tight break-words">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight break-words">
                        {c.tagline}
                      </div>
                    </div>
                  </HeaderCell>
                );
              })}

              {/* ─── Body rows ─── */}
              {ROWS.map((row) => (
                <React.Fragment key={row.key}>
                  <BodyCell
                    sticky="left-0"
                    style={{ background: STICKY_BG, zIndex: 15 }}
                    testId={`compare-row-${row.key}`}
                  >
                    <span className="text-[13px] text-slate-200 leading-snug">
                      {isEs ? row.es : row.en}
                    </span>
                  </BodyCell>
                  <BodyCell
                    sticky="left-[240px]"
                    center
                    style={{ background: QUANTRO_STICKY_BG, zIndex: 14 }}
                  >
                    <ComparisonCell
                      value={row.quantro}
                      isEs={isEs}
                      tooltip={row.tooltips?.quantro}
                      live={!!row.quantroLive}
                      columnKey="quantro"
                    />
                  </BodyCell>
                  {["ninety", "eos", "notion"].map((key) => {
                    const dim = focusKey && key !== focusKey;
                    return (
                      <BodyCell
                        key={key}
                        center
                        style={{ background: STICKY_BG, opacity: dim ? 0.3 : 1 }}
                      >
                        <ComparisonCell
                          value={row[key]}
                          isEs={isEs}
                          tooltip={row.tooltips?.[key]}
                          columnKey={key}
                        />
                      </BodyCell>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* iOS-style scroll progress indicator — a thin track with a
              gliding dot. Only shows when the table actually overflows
              (mobile/tablet). */}
          {scrollState.hasOverflow && (
            <div
              className="flex items-center justify-center pt-3 pb-1"
              data-testid="compare-table-progress"
              aria-hidden
            >
              <div className="relative h-[3px] w-28 rounded-full bg-white/[0.08]">
                <div
                  className="absolute top-0 h-[3px] rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.5)] transition-[left,width] duration-200 ease-out"
                  style={{
                    width: "14px",
                    left: `${scrollState.progress * (112 - 14)}px`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Mobile hint */}
          <div
            className="lg:hidden flex items-center justify-center gap-1.5 px-4 pt-1 pb-1 text-[10.5px] text-slate-500"
            data-testid="compare-table-mobile-hint"
            style={{ opacity: scrollState.atEnd ? 0.3 : 0.9, transition: "opacity 0.3s" }}
          >
            <ArrowRight size={11} className="opacity-70" />
            {isEs ? "Desliza para comparar" : "Swipe to compare"}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-5 px-4 py-4 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <ComparisonCell value="full" isEs={isEs} />
              {isEs ? "Disponible" : "Available"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ComparisonCell value="partial" isEs={isEs} />
              {isEs ? "Parcial" : "Partial"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ComparisonCell value="none" isEs={isEs} />
              {isEs ? "No disponible" : "Not available"}
            </span>
          </div>
        </div>

        {/* Constant-evolution glass card — sits between the table and the rest of the page */}
        <EvolvingNoteCard isEs={isEs} />
      </div>
    </section>
  );
};

// Small presentational helpers for the compare table — keep row markup tidy.
// HeaderCell centers its content by default (pass `align="start"` for the
// Funcionalidad label column). `overflow-hidden` + `min-w-0` prevent
// long taglines from bleeding into the next cell during horizontal scroll.
const HeaderCell = ({ children, sticky, style, testId, align = "center" }) => (
  <div
    data-testid={testId}
    className={`p-4 border-b border-white/[0.08] flex items-center ${align === "center" ? "justify-center" : "justify-start"} overflow-hidden min-w-0 ${sticky ? `sticky ${sticky}` : ""}`}
    style={style}
  >
    {children}
  </div>
);

const BodyCell = ({ children, sticky, style, center = false, testId }) => (
  <div
    data-testid={testId}
    className={`px-4 py-3 border-b border-white/[0.04] flex items-center ${center ? "justify-center" : "justify-start"} overflow-hidden min-w-0 ${sticky ? `sticky ${sticky}` : ""}`}
    style={style}
  >
    {children}
  </div>
);

// =========================================================================
// EvolvingNoteCard — "Quantro evoluciona constantemente"
// Sits right under the comparison table. Glass card, premium feel, not banner-y.
// Includes an integrated mini-changelog (last 3 launches) — feels like
// "fine print of progress", not a technical changelog.
// =========================================================================

const CHANGELOG_BADGES = {
  nuevo: {
    es: "Nuevo",
    en: "New",
    color: "#7FF5FF",
    bg: "rgba(0, 245, 255, 0.10)",
    border: "rgba(0, 245, 255, 0.32)",
  },
  potenciado: {
    es: "Potenciado",
    en: "Upgraded",
    color: "#C084FC",
    bg: "rgba(160, 32, 255, 0.12)",
    border: "rgba(160, 32, 255, 0.35)",
  },
  beta: {
    es: "Beta",
    en: "Beta",
    color: "#FCD34D",
    bg: "rgba(250, 204, 21, 0.10)",
    border: "rgba(250, 204, 21, 0.32)",
  },
};

const CHANGELOG_ITEMS = [
  {
    key: "revenue-v2",
    date: { es: "Mar 2026", en: "Mar 2026" },
    name: "Quantro Revenue v2",
    badge: "potenciado",
    copy: {
      es: "Decision Engine con flujo de aprobación y conexión al Dashboard.",
      en: "Decision Engine with approval flow and Dashboard connection.",
    },
  },
  {
    key: "time",
    date: { es: "Mar 2026", en: "Mar 2026" },
    name: "Quantro Time",
    badge: "nuevo",
    copy: {
      es: "Visibilidad real de cómo se invierte el tiempo y dónde se ejecuta.",
      en: "Real visibility into how time is spent and where execution happens.",
    },
  },
  {
    key: "chat-intelligence",
    date: { es: "Jun 2026", en: "Jun 2026" },
    name: "Chat Intelligence",
    badge: "beta",
    copy: {
      es: "Respuestas, acciones y seguimiento desde un solo lugar.",
      en: "Answers, actions and follow-up from a single place.",
    },
  },
];

const ChangelogRow = ({ item, isEs, isLast }) => {
  const badge = CHANGELOG_BADGES[item.badge];
  return (
    <li
      className={`flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4 py-3.5 ${
        isLast ? "" : "border-b border-white/[0.05]"
      }`}
      data-testid={`changelog-item-${item.key}`}
    >
      {/* Date */}
      <span className="font-mono text-[10.5px] tracking-wider uppercase text-slate-500 sm:w-[68px] flex-shrink-0">
        {item.date[isEs ? "es" : "en"]}
      </span>

      {/* Name + badge */}
      <div className="flex items-center gap-2 flex-shrink-0 sm:w-[260px]">
        <span className="text-[13.5px] font-medium text-white tracking-tight whitespace-nowrap">
          {item.name}
        </span>
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold tracking-wider uppercase leading-none"
          style={{
            color: badge.color,
            background: badge.bg,
            border: `1px solid ${badge.border}`,
          }}
          data-testid={`changelog-badge-${item.key}`}
        >
          {badge[isEs ? "es" : "en"]}
        </span>
      </div>

      {/* Copy */}
      <p className="text-[12.5px] text-slate-400 leading-snug min-w-0 flex-1">
        {item.copy[isEs ? "es" : "en"]}
      </p>
    </li>
  );
};

const EvolvingNoteCard = ({ isEs }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="mt-8 sm:mt-10 relative rounded-2xl overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, rgba(0, 245, 255, 0.05) 0%, rgba(14, 22, 40, 0.85) 60%, rgba(160, 32, 255, 0.05) 100%)",
      border: "1px solid rgba(0, 245, 255, 0.18)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow: "0 30px 80px -30px rgba(0, 245, 255, 0.18)",
    }}
    data-testid="evolving-note-card"
  >
    {/* ambient glow */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(0,245,255,0.08), transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(160,32,255,0.06), transparent 55%)",
      }}
    />

    <div className="relative px-5 sm:px-7 py-6 sm:py-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 245, 255, 0.16), rgba(0, 245, 255, 0.04))",
            border: "1px solid rgba(0, 245, 255, 0.35)",
            boxShadow: "0 0 24px rgba(0, 245, 255, 0.2)",
          }}
        >
          <Zap size={20} className="text-[#7FF5FF]" strokeWidth={2.2} />
        </div>

        <div className="min-w-0 flex-1">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-[0.2em] uppercase"
            style={{
              background: "rgba(0, 245, 255, 0.08)",
              border: "1px solid rgba(0, 245, 255, 0.25)",
              color: "#7FF5FF",
            }}
          >
            <Sparkles size={9} />
            {isEs ? "Actualizaciones constantes" : "Constant updates"}
          </span>

          <h3 className="font-satoshi font-bold text-white text-xl sm:text-2xl leading-tight tracking-tight mt-3">
            {isEs ? "Quantro evoluciona cada semana." : "Quantro evolves every week."}
          </h3>

          <p className="text-[13px] sm:text-[13.5px] text-slate-400 leading-relaxed mt-2 max-w-xl">
            {isEs
              ? "Estamos agregando constantemente nuevas funciones, agentes e integraciones para que tu negocio opere con más claridad, menos herramientas y más inteligencia."
              : "We're constantly adding new features, agents and integrations so your business runs with more clarity, fewer tools and more intelligence."}
          </p>
        </div>
      </div>

      {/* Mini changelog — integrated, not a separate section */}
      <div className="mt-6 sm:mt-7 pt-5 border-t border-white/[0.06]" data-testid="evolving-changelog">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-1.5">
          {isEs ? "Lanzamientos recientes" : "Recent releases"}
        </p>
        <ul className="divide-y-0">
          {CHANGELOG_ITEMS.map((item, i) => (
            <ChangelogRow
              key={item.key}
              item={item}
              isEs={isEs}
              isLast={i === CHANGELOG_ITEMS.length - 1}
            />
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);



const KeyDifferenceSection = ({ isEs }) => (
  <section className="relative py-24 px-6" data-testid="compare-key-difference">
    <div className="max-w-4xl mx-auto">
      <h2 className="font-satoshi font-bold text-white text-3xl sm:text-4xl lg:text-5xl text-center leading-tight tracking-tight max-w-3xl mx-auto">
        {isEs ? (
          <>
            Quantro no es un sistema de seguimiento.{" "}
            <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
              Es un sistema de decisión.
            </span>
          </>
        ) : (
          <>
            Quantro is not a tracking system.{" "}
            <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
              It's a decision system.
            </span>
          </>
        )}
      </h2>

      <div className="grid sm:grid-cols-2 gap-5 mt-12">
        <div className="rounded-2xl p-6 bg-white/[0.015] border border-white/[0.06]">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-3">
            {isEs ? "Otros sistemas" : "Other systems"}
          </p>
          <p className="font-satoshi font-bold text-white text-xl leading-snug">
            {isEs ? "Te muestran lo que pasa." : "They show you what's happening."}
          </p>
        </div>
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(0, 245, 255, 0.08), rgba(12, 18, 34, 0.92))",
            border: "1px solid rgba(0, 245, 255, 0.35)",
            boxShadow: "0 20px 50px -24px rgba(0, 245, 255, 0.35)",
          }}
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-3">
            Quantro
          </p>
          <p className="font-satoshi font-bold text-white text-xl leading-snug">
            {isEs ? "Te dice qué hacer al respecto." : "Tells you what to do about it."}
          </p>
        </div>
      </div>

      {/* Flow chips */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        {[
          { Icon: AlertTriangle, es: "Problema detectado", en: "Problem detected", color: "#FCA5A5" },
          { Icon: Lightbulb, es: "Recomendación generada", en: "Recommendation generated", color: "#FACC15" },
          { Icon: CheckCircle2, es: "Acción ejecutable", en: "Executable action", color: "#00F5FF" },
        ].map(({ Icon, es, en, color }, i, arr) => (
          <React.Fragment key={es}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.02] border"
              style={{ borderColor: `${color}40` }}
            >
              <Icon size={13} style={{ color }} />
              <span className="text-[12.5px] font-medium text-white">{isEs ? es : en}</span>
            </div>
            {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-600" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

const BeforeAfterSection = ({ isEs, focusKey }) => {
  const beforeItems = useMemo(() => {
    if (focusKey === "ninety" || focusKey === "eos") {
      return isEs
        ? [FOCUS_META[focusKey].displayName, "Notion", "Excel", "CRM aparte", "Procesos manuales"]
        : [FOCUS_META[focusKey].displayName, "Notion", "Excel", "Separate CRM", "Manual processes"];
    }
    if (focusKey === "notion") {
      return isEs
        ? ["Notion", "Excel", "CRM separado", "Ninety / EOS", "Procesos manuales"]
        : ["Notion", "Excel", "Separate CRM", "Ninety / EOS", "Manual processes"];
    }
    return isEs
      ? ["Notion", "Excel", "CRM", "Ninety / EOS", "Herramientas separadas"]
      : ["Notion", "Excel", "CRM", "Ninety / EOS", "Separate tools"];
  }, [isEs, focusKey]);

  const afterItems = [
    { Icon: Target, es: "Dashboard", en: "Dashboard" },
    { Icon: Brain, es: "Inteligencia", en: "Intelligence" },
    { Icon: Lightbulb, es: "Decisiones", en: "Decisions" },
    { Icon: Workflow, es: "Ejecución", en: "Execution" },
    { Icon: Users, es: "Equipo", en: "Team" },
  ];

  return (
    <section className="relative py-24 px-6" data-testid="compare-before-after">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]/80 mb-3">
            {isEs ? "La transición" : "The transition"}
          </p>
          <h2 className="font-satoshi font-bold text-white text-3xl sm:text-4xl leading-tight tracking-tight max-w-3xl mx-auto">
            {isEs
              ? "De múltiples herramientas → un solo sistema"
              : "From multiple tools → one system"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
          {/* Before */}
          <div
            className="rounded-2xl p-6 bg-white/[0.015] border border-white/[0.06]"
            data-testid="compare-before-card"
          >
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-4">
              {isEs ? "Antes" : "Before"}
            </p>
            <ul className="space-y-2">
              {beforeItems.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[13px] text-slate-400"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#00F5FF]/8 border border-[#00F5FF]/30 flex items-center justify-center">
              <ArrowRight size={22} className="text-[#00F5FF]" />
            </div>
          </div>
          <div className="flex lg:hidden items-center justify-center py-2">
            <ArrowRight size={18} className="text-[#00F5FF] rotate-90" />
          </div>

          {/* After */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(160deg, rgba(0, 245, 255, 0.06), rgba(12, 18, 34, 0.92))",
              border: "1px solid rgba(0, 245, 255, 0.35)",
              boxShadow: "0 24px 60px -28px rgba(0, 245, 255, 0.4)",
            }}
            data-testid="compare-after-card"
          >
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-4">
              {isEs ? "Después — todo dentro de Quantro" : "After — everything inside Quantro"}
            </p>
            <ul className="space-y-2">
              {afterItems.map(({ Icon, es, en }) => (
                <li
                  key={es}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#00F5FF]/[0.04] border border-[#00F5FF]/20 text-[13px] text-white font-medium"
                >
                  <Icon size={14} className="text-[#00F5FF]" />
                  {isEs ? es : en}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const RealExampleSection = ({ isEs }) => (
  <section className="relative py-24 px-6" data-testid="compare-real-example">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]/80 mb-3">
          {isEs ? "Ejemplo real" : "Real example"}
        </p>
        <h2 className="font-satoshi font-bold text-white text-3xl sm:text-4xl leading-tight tracking-tight">
          {isEs ? "Qué pasa cuando algo sale de rango" : "What happens when something goes off track"}
        </h2>
      </div>

      {/* Problem card */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{
          background: "linear-gradient(160deg, rgba(244, 63, 94, 0.06), rgba(12, 18, 34, 0.88))",
          border: "1px solid rgba(244, 63, 94, 0.28)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={14} className="text-rose-300" />
          </span>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-300/80 mb-0.5">
              {isEs ? "Problema" : "Problem"}
            </p>
            <p className="text-[14px] text-white font-semibold">
              {isEs ? "Leads por debajo de meta" : "Leads below target"}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Others */}
        <div className="rounded-2xl p-5 bg-white/[0.015] border border-white/[0.06]">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-3">
            {isEs ? "Otros sistemas" : "Other systems"}
          </p>
          <div className="flex items-center gap-2 text-[13px] text-slate-400">
            <TrendingUp size={14} className="text-slate-500" />
            {isEs ? "Solo muestran el dato." : "They just show the data."}
          </div>
        </div>

        {/* Quantro */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(160deg, rgba(0, 245, 255, 0.06), rgba(12, 18, 34, 0.92))",
            border: "1px solid rgba(0, 245, 255, 0.35)",
            boxShadow: "0 18px 44px -22px rgba(0, 245, 255, 0.35)",
          }}
        >
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-3">
            Quantro
          </p>
          <ul className="space-y-2 text-[13px]">
            {[
              { Icon: AlertTriangle, es: "Detecta el problema", en: "Detects the problem" },
              { Icon: Lightbulb, es: "Propone aumentar inversión en canal X", en: "Suggests increasing spend on channel X" },
              { Icon: CheckCircle2, es: "Genera un To-Do", en: "Generates a To-Do" },
              { Icon: Users, es: "Asigna responsable", en: "Assigns an owner" },
              { Icon: Zap, es: "Hace seguimiento", en: "Tracks follow-through" },
            ].map(({ Icon, es, en }) => (
              <li key={es} className="flex items-center gap-2 text-white">
                <Icon size={13} className="text-[#00F5FF] flex-shrink-0" />
                {isEs ? es : en}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const AudienceSection = ({ isEs }) => {
  const items = isEs
    ? [
        "Empresas que usan EOS o Ninety pero quieren más",
        "Equipos que ya usan múltiples herramientas",
        "CEOs que quieren claridad y control real",
        "Negocios que quieren pasar de análisis a ejecución",
      ]
    : [
        "Companies using EOS or Ninety that want more",
        "Teams already using multiple tools",
        "CEOs who want real clarity and control",
        "Businesses going from analysis to execution",
      ];

  return (
    <section className="relative py-20 px-6" data-testid="compare-audience">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]/80 mb-3">
            {isEs ? "Para quién es" : "Who it's for"}
          </p>
          <h2 className="font-satoshi font-bold text-white text-3xl sm:text-4xl leading-tight tracking-tight">
            {isEs ? "Está diseñado para..." : "It's built for..."}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {items.map((it, i) => (
            <div
              key={it}
              className="rounded-xl p-4 bg-white/[0.015] border border-white/[0.06] flex items-start gap-2.5"
              data-testid={`compare-audience-${i}`}
            >
              <span className="mt-0.5 w-5 h-5 rounded-md bg-[#00F5FF]/10 border border-[#00F5FF]/25 flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-[#00F5FF]" strokeWidth={2.8} />
              </span>
              <span className="text-[13.5px] text-slate-200 leading-snug">{it}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyQuantroSection = ({ isEs, onPrimaryCTA }) => {
  const pillars = [
    {
      Icon: Brain,
      es: { title: "Inteligencia", copy: "Observa tu negocio en tiempo real y detecta lo que pocos ven." },
      en: { title: "Intelligence", copy: "Watches your business in real time and catches what few see." },
    },
    {
      Icon: Lightbulb,
      es: { title: "Decisión", copy: "Convierte datos en acciones claras, no en dashboards pasivos." },
      en: { title: "Decision", copy: "Turns data into clear actions, not passive dashboards." },
    },
    {
      Icon: Workflow,
      es: { title: "Ejecución", copy: "Asigna, automatiza y hace seguimiento hasta que el trabajo está hecho." },
      en: { title: "Execution", copy: "Assigns, automates and tracks until the work is done." },
    },
  ];

  return (
    <section
      id="why-quantro"
      className="relative py-24 px-6 scroll-mt-24"
      data-testid="compare-why-quantro"
    >
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/[0.05] text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]">
            <Sparkles size={11} />
            {isEs ? "Por qué Quantro" : "Why Quantro"}
          </span>
        </div>

        <h2 className="font-satoshi font-bold text-white text-3xl sm:text-4xl lg:text-5xl text-center leading-tight tracking-tight max-w-3xl mx-auto">
          {isEs ? (
            <>
              Deja de usar herramientas que solo organizan.{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                Usa un sistema que opera tu negocio.
              </span>
            </>
          ) : (
            <>
              Stop using tools that only organize.{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                Use a system that runs your business.
              </span>
            </>
          )}
        </h2>

        <p className="text-center text-[15px] text-slate-400 leading-relaxed mt-5 max-w-2xl mx-auto">
          {isEs
            ? "Quantro no es un competidor más en la lista. Es la siguiente capa: inteligencia, decisión y ejecución integradas en un solo sistema operativo de negocio."
            : "Quantro isn't one more competitor on the list. It's the next layer: intelligence, decisions and execution fused into a single business operating system."}
        </p>

        {/* 3-pillar diferentiator cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-12" data-testid="compare-why-pillars">
          {pillars.map(({ Icon, es, en }, i) => {
            const { title, copy } = isEs ? es : en;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-6 bg-white/[0.015] border border-white/[0.06] hover:border-[#00F5FF]/25 transition-colors"
                data-testid={`compare-why-pillar-${i}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,245,255,0.22), rgba(0,245,255,0.04))",
                    border: "1px solid rgba(0,245,255,0.35)",
                  }}
                >
                  <Icon size={16} className="text-[#00F5FF]" />
                </div>
                <h3 className="font-satoshi font-semibold text-white text-[16px] leading-tight tracking-tight mb-1.5">
                  {title}
                </h3>
                <p className="text-[12.5px] text-slate-400 leading-snug">{copy}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA card */}
        <div
          className="mt-10 rounded-3xl px-6 sm:px-12 py-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(14, 22, 40, 0.9) 0%, rgba(5, 10, 24, 0.8) 100%)",
            border: "1px solid rgba(0, 245, 255, 0.2)",
            boxShadow: "0 40px 80px -30px rgba(0, 245, 255, 0.3)",
          }}
          data-testid="compare-why-cta-card"
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.14), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="font-satoshi font-semibold text-white text-xl sm:text-2xl leading-tight max-w-2xl mx-auto">
              {isEs
                ? "Inteligencia + decisión + ejecución en un solo sistema."
                : "Intelligence + decision + execution in a single system."}
            </p>
            <button
              type="button"
              onClick={onPrimaryCTA}
              className="inline-flex items-center gap-2 mt-7 px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[14px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/30 transition-all"
              data-testid="compare-final-cta-btn"
            >
              {isEs ? "Empieza con Quantro" : "Get started with Quantro"}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// =========================================================================
// Page
// =========================================================================

export const ComparisonPage = ({ focusKey = null }) => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const location = useLocation();
  const { open: openPlatformAccess } = usePlatformAccess();

  // Scroll to top on route change — SPA navigation otherwise preserves scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // SEO + Open Graph — dynamic per variant
  useEffect(() => {
    const key = focusKey || "general";
    const cfg = META_CONFIG[key] || META_CONFIG.general;
    const path = cfg.path[isEs ? "es" : "en"] || cfg.path.es;
    const cleanup = applyPageMeta({
      title: cfg.title[isEs ? "es" : "en"],
      description: cfg.description[isEs ? "es" : "en"],
      url: `${BASE_URL}${path}`,
      ogTitle: cfg.ogTitle[isEs ? "es" : "en"],
      ogDescription: cfg.ogDescription[isEs ? "es" : "en"],
    });
    return cleanup;
  }, [focusKey, isEs]);

  const handlePrimaryCTA = () => {
    trackCTAClick(`comparison_page_primary${focusKey ? "_" + focusKey : ""}`);
    openPlatformAccess();
  };

  const handleSecondaryCTA = () => {
    trackCTAClick(`comparison_page_secondary${focusKey ? "_" + focusKey : ""}`);
    const target = document.getElementById("why-quantro");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={300}>
    <div
      className="min-h-screen text-white"
      style={{ background: "#030712" }}
      data-testid="comparison-page"
      data-focus={focusKey || "general"}
    >
      <div className="noise-overlay" />

      {/* Minimal top bar — uses mark-only icon + single wordmark */}
      <header className="sticky top-0 z-40 border-b border-slate-800/60 backdrop-blur-md bg-[#030712]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-testid="compare-back-home"
            aria-label="Quantro — ir al inicio"
          >
            <QuantroLogoMark size={28} />
            <span className="font-satoshi font-semibold text-white tracking-tight text-[17px] leading-none">
              Quantro
            </span>
          </Link>
          <button
            type="button"
            onClick={handlePrimaryCTA}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[12px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all"
          >
            {isEs ? "Empezar" : "Start"}
            <ArrowRight size={12} />
          </button>
        </div>
      </header>

      <main>
        <ComparisonHero
          isEs={isEs}
          focusKey={focusKey}
          onPrimaryCTA={handlePrimaryCTA}
          onSecondaryCTA={handleSecondaryCTA}
        />
        <ProblemSection isEs={isEs} />
        <ComparisonTable isEs={isEs} focusKey={focusKey} />
        <KeyDifferenceSection isEs={isEs} />
        <BeforeAfterSection isEs={isEs} focusKey={focusKey} />
        <RealExampleSection isEs={isEs} />
        <AudienceSection isEs={isEs} />
        <WhyQuantroSection isEs={isEs} onPrimaryCTA={handlePrimaryCTA} />
      </main>

      <footer className="border-t border-slate-800/60 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-500">
          <span>© 2026 Quantro. {isEs ? "Todos los derechos reservados." : "All rights reserved."}</span>
          <div className="flex items-center gap-6">
            <Link to="/vs-ninety" className="hover:text-white transition-colors">vs Ninety</Link>
            <Link to="/vs-eos" className="hover:text-white transition-colors">vs EOS</Link>
            <Link to="/vs-notion" className="hover:text-white transition-colors">vs Notion</Link>
            <Link to="/" className="hover:text-white transition-colors">
              {isEs ? "Inicio" : "Home"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
    </TooltipProvider>
  );
};

export default ComparisonPage;
