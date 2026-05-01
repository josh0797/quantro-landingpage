import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, ArrowUpRight } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { usePlatformAccess } from "../../hooks/usePlatformAccess";
import { trackCTAClick } from "../../lib/analytics";
import CaseStudyModal from "./CaseStudyModal";

/**
 * Casos de Éxito — Resultados reales, no promesas.
 *
 * Mobile-first rewrite:
 *   - 1 premium glass card on-screen (not a crowded grid)
 *   - iOS-style swipe (touch handlers), soft scale on inactive slides
 *   - Autoplay 9s, pauses on any user interaction
 *   - Proof-layer metric strip below card — full picture in a glance
 *   - Max 3 content blocks per card for scannability
 */

// -------------------------------------------------------------------------
// Data — micro-stories
// -------------------------------------------------------------------------

const STORIES = [
  {
    key: "conversion",
    metric: { es: "+40%", en: "+40%" },
    metricLabel: { es: "conversión de clientes", en: "customer conversion" },
    context: {
      es: "Más leads convertidos sin aumentar equipo.",
      en: "More leads converted without growing the team.",
    },
    title: {
      es: "De leads sin seguimiento a crecimiento predecible",
      en: "From lost leads to predictable growth",
    },
    before: {
      es: "El pipeline vivía en hojas de cálculo. Nadie sabía qué estaba frío o caliente.",
      en: "Pipeline lived in spreadsheets. Nobody knew what was hot or cold.",
    },
    after: {
      es: "Ahora Quantro prioriza, asigna y hace seguimiento automático a cada lead.",
      en: "Now Quantro prioritizes, assigns and auto-follows every lead.",
    },
    quote: {
      es: "Ahora sabemos qué hacer cada día. Nada se pierde.",
      en: "We know exactly what to do every day. Nothing slips.",
    },
    attribution: { es: "CEO · Grupo Nexo", en: "CEO · Grupo Nexo" },
    chips: {
      es: ["SaaS B2B", "12 empleados", "90 días"],
      en: ["B2B SaaS", "12 employees", "90 days"],
    },
    modalBefore: {
      es: ["Leads sin seguimiento", "Hojas de cálculo dispersas", "Decisiones reactivas"],
      en: ["Unfollowed leads", "Scattered spreadsheets", "Reactive decisions"],
    },
    modalAfter: {
      es: ["Seguimiento automático", "Pipeline priorizado", "Acciones asignadas con dueño"],
      en: ["Automatic follow-up", "Prioritized pipeline", "Actions with clear owners"],
    },
    secondaryMetrics: {
      es: [
        { value: "+40%", label: "conversión" },
        { value: "-30%", label: "tiempo operativo" },
        { value: "0", label: "leads sin dueño" },
        { value: "-80%", label: "decisiones improvisadas" },
      ],
      en: [
        { value: "+40%", label: "conversion" },
        { value: "-30%", label: "ops time" },
        { value: "0", label: "orphan leads" },
        { value: "-80%", label: "improvised calls" },
      ],
    },
  },
  {
    key: "costs",
    metric: { es: "-$52K", en: "-$52K" },
    metricLabel: { es: "costos innecesarios eliminados", en: "unnecessary costs removed" },
    context: {
      es: "Eliminación de herramientas y procesos duplicados.",
      en: "Duplicate tools and processes eliminated.",
    },
    title: {
      es: "De gasto disperso a control financiero",
      en: "From scattered spend to financial control",
    },
    before: {
      es: "Seis suscripciones SaaS activas y nadie sabía cuál hacía qué.",
      en: "Six active SaaS subscriptions and nobody knew which did what.",
    },
    after: {
      es: "Un solo sistema para operar, medir y decidir — con contabilidad integrada.",
      en: "One single system to run, measure and decide — with accounting built-in.",
    },
    quote: {
      es: "Cortamos lo que no sumaba. Y el equipo ahora ejecuta más rápido.",
      en: "We cut what wasn't adding up. And the team now executes faster.",
    },
    attribution: { es: "CFO · Altura Retail", en: "CFO · Altura Retail" },
    chips: {
      es: ["Retail", "45 empleados", "6 meses"],
      en: ["Retail", "45 employees", "6 months"],
    },
    modalBefore: {
      es: ["6 suscripciones SaaS activas", "Gasto sin trazabilidad", "Reportes manuales en Excel"],
      en: ["6 active SaaS subscriptions", "Untraceable spending", "Manual Excel reports"],
    },
    modalAfter: {
      es: ["Un solo sistema operativo", "Contabilidad integrada", "Reportes en tiempo real"],
      en: ["Single operating system", "Built-in accounting", "Real-time reporting"],
    },
    secondaryMetrics: {
      es: [
        { value: "-$52K", label: "costos/año" },
        { value: "-6", label: "herramientas" },
        { value: "+3x", label: "velocidad de reportes" },
        { value: "100%", label: "trazabilidad" },
      ],
      en: [
        { value: "-$52K", label: "cost/year" },
        { value: "-6", label: "tools" },
        { value: "+3x", label: "reporting speed" },
        { value: "100%", label: "traceability" },
      ],
    },
  },
  {
    key: "ontime",
    metric: { es: "90%", en: "90%" },
    metricLabel: { es: "tareas completadas a tiempo", en: "tasks completed on time" },
    context: {
      es: "El equipo ejecuta con seguimiento claro.",
      en: "The team executes with clear follow-through.",
    },
    title: {
      es: "De tareas olvidadas a ejecución consistente",
      en: "From forgotten tasks to consistent execution",
    },
    before: {
      es: "Las tareas se escribían en chats y se perdían entre urgencias.",
      en: "Tasks were dropped in chats and lost among urgencies.",
    },
    after: {
      es: "Cada acción tiene responsable, fecha y notificación — sin fricción.",
      en: "Every action has an owner, a date and a nudge — frictionless.",
    },
    quote: {
      es: "Lo que entra a Quantro se ejecuta. Punto.",
      en: "What enters Quantro gets done. Period.",
    },
    attribution: { es: "COO · Nodo Studios", en: "COO · Nodo Studios" },
    chips: {
      es: ["Agencia", "28 empleados", "4 meses"],
      en: ["Agency", "28 employees", "4 months"],
    },
    modalBefore: {
      es: ["Tareas en chats dispersos", "Sin fechas ni responsables", "Urgencias constantes"],
      en: ["Tasks in scattered chats", "No dates or owners", "Constant urgencies"],
    },
    modalAfter: {
      es: ["Todo en un sistema con dueño", "Fechas y prioridades claras", "Ejecución sin recordatorios"],
      en: ["Everything owned in one place", "Clear dates and priorities", "Execution without reminders"],
    },
    secondaryMetrics: {
      es: [
        { value: "90%", label: "a tiempo" },
        { value: "+2.4x", label: "throughput" },
        { value: "-60%", label: "reuniones" },
        { value: "0", label: "tareas perdidas" },
      ],
      en: [
        { value: "90%", label: "on time" },
        { value: "+2.4x", label: "throughput" },
        { value: "-60%", label: "meetings" },
        { value: "0", label: "lost tasks" },
      ],
    },
  },
  {
    key: "ownership",
    metric: { es: "0", en: "0" },
    metricLabel: { es: "tareas sin responsable", en: "orphan tasks" },
    context: {
      es: "Cada acción tiene dueño definido.",
      en: "Every action has a defined owner.",
    },
    title: {
      es: "De desorden operativo a responsabilidad total",
      en: "From operational chaos to total ownership",
    },
    before: {
      es: "Las reuniones cerraban con acuerdos que nadie tomaba.",
      en: "Meetings ended with agreements no one picked up.",
    },
    after: {
      es: "Quantro asigna automáticamente. El equipo sabe exactamente qué mover.",
      en: "Quantro auto-assigns. The team knows exactly what to move.",
    },
    quote: {
      es: "Ya no hay tareas huérfanas. Eso cambió la cultura.",
      en: "No more orphan tasks. That changed the culture.",
    },
    attribution: { es: "Founder · Praga", en: "Founder · Praga" },
    chips: {
      es: ["Consultoría", "18 empleados", "60 días"],
      en: ["Consulting", "18 employees", "60 days"],
    },
    modalBefore: {
      es: ["Acuerdos sin dueño", "Prioridades difusas", "Reuniones repetitivas"],
      en: ["Ownerless agreements", "Fuzzy priorities", "Repetitive meetings"],
    },
    modalAfter: {
      es: ["Asignación automática", "Prioridad visible al equipo", "Reuniones enfocadas"],
      en: ["Automatic assignment", "Priority visible to all", "Focused meetings"],
    },
    secondaryMetrics: {
      es: [
        { value: "0", label: "huérfanas" },
        { value: "100%", label: "claridad" },
        { value: "-50%", label: "reuniones" },
        { value: "+35%", label: "velocidad" },
      ],
      en: [
        { value: "0", label: "orphans" },
        { value: "100%", label: "clarity" },
        { value: "-50%", label: "meetings" },
        { value: "+35%", label: "speed" },
      ],
    },
  },
  {
    key: "decisions",
    metric: { es: "-80%", en: "-80%" },
    metricLabel: { es: "decisiones improvisadas", en: "improvised decisions" },
    context: {
      es: "El negocio opera con claridad, no con urgencias.",
      en: "The business runs on clarity, not urgency.",
    },
    title: {
      es: "De reacción a decisiones inteligentes",
      en: "From reaction to intelligent decisions",
    },
    before: {
      es: "El CEO decidía todo por instinto, bajo presión diaria.",
      en: "The CEO decided everything on instinct, under daily pressure.",
    },
    after: {
      es: "Quantro observa, detecta lo que cambia y propone la decisión correcta.",
      en: "Quantro watches, catches what changes and proposes the right call.",
    },
    quote: {
      es: "Decidimos con datos, no con adrenalina.",
      en: "We decide with data, not adrenaline.",
    },
    attribution: { es: "CEO · Labora Fintech", en: "CEO · Labora Fintech" },
    chips: {
      es: ["Fintech", "35 empleados", "120 días"],
      en: ["Fintech", "35 employees", "120 days"],
    },
    modalBefore: {
      es: ["Decisiones por instinto", "Datos dispersos", "CEO como cuello de botella"],
      en: ["Gut-based calls", "Scattered data", "CEO as bottleneck"],
    },
    modalAfter: {
      es: ["Recomendaciones con contexto", "Datos en tiempo real", "Equipo decidiendo con claridad"],
      en: ["Context-rich recommendations", "Real-time data", "Team deciding with clarity"],
    },
    secondaryMetrics: {
      es: [
        { value: "-80%", label: "improvisación" },
        { value: "+5x", label: "visibilidad" },
        { value: "-45%", label: "carga CEO" },
        { value: "+2.1x", label: "velocidad de decisión" },
      ],
      en: [
        { value: "-80%", label: "improvising" },
        { value: "+5x", label: "visibility" },
        { value: "-45%", label: "CEO load" },
        { value: "+2.1x", label: "decision speed" },
      ],
    },
  },
];

const AUTOPLAY_MS = 9000;
const SWIPE_THRESHOLD = 40;

// -------------------------------------------------------------------------
// Component
// -------------------------------------------------------------------------

export const SuccessStoriesSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchMoved = useRef(false);
  const hostRef = useRef(null);
  const { open: openPlatformAccess } = usePlatformAccess();

  const total = STORIES.length;
  const active = STORIES[index];

  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // Autoplay — respects pause after user interacts
  useEffect(() => {
    if (paused) return undefined;
    const id = setTimeout(goNext, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, goNext]);

  // Pause autoplay on hover / focus
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;
    const onEnter = () => setPaused(true);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("focusin", onEnter);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("focusin", onEnter);
    };
  }, []);

  // iOS-style swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchMoved.current = false;
    setPaused(true);
  };
  const handleTouchMove = (e) => {
    if (touchStartX.current == null) return;
    if (Math.abs(e.touches[0].clientX - touchStartX.current) > 8) {
      touchMoved.current = true;
    }
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const handleCardClick = () => {
    // Don't open modal if the user was swiping
    if (touchMoved.current) {
      touchMoved.current = false;
      return;
    }
    trackCTAClick(`story_card_open_${active.key}`);
    setPaused(true);
    setModalOpen(true);
  };

  const handleModalPrimary = () => {
    trackCTAClick(`story_modal_cta_${active.key}`);
    openPlatformAccess();
  };

  const proofItems = useMemo(
    () =>
      STORIES.map((s) => ({
        key: s.key,
        value: s.metric[isEs ? "es" : "en"],
        label: s.metricLabel[isEs ? "es" : "en"],
      })),
    [isEs]
  );

  return (
    <AnimatedSection
      id="success-stories"
      className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden"
      data-testid="success-stories-section"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.04) 0%, transparent 55%), #030712",
      }}
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/[0.05] text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-5">
            <Quote size={11} />
            {isEs ? "Casos de éxito" : "Success stories"}
          </span>
          <h2
            className="font-satoshi font-bold text-white leading-[1.1] tracking-tight [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 6.4vw, 52px)" }}
            data-testid="stories-headline"
          >
            {isEs ? (
              <>
                Resultados reales,{" "}
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                  no promesas.
                </span>
              </>
            ) : (
              <>
                Real results,{" "}
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                  not promises.
                </span>
              </>
            )}
          </h2>
          <p className="text-[15px] text-slate-400 leading-[1.55] max-w-xl mx-auto mt-4">
            {isEs
              ? "Empresas que pasaron de operar con herramientas a operar con Quantro."
              : "Teams that moved from running on tools to running on Quantro."}
          </p>
        </motion.div>

        {/* Card slider */}
        <div
          ref={hostRef}
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-testid="stories-carousel"
        >
          <AnimatePresence mode="wait">
            <motion.article
              key={active.key}
              role="button"
              tabIndex={0}
              onClick={handleCardClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick();
                }
              }}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl overflow-hidden px-6 sm:px-10 py-8 sm:py-10 cursor-pointer hover:border-[#00F5FF]/35 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00F5FF]/50"
              style={{
                background:
                  "linear-gradient(160deg, rgba(14, 22, 40, 0.92) 0%, rgba(5, 10, 24, 0.85) 100%)",
                border: "1px solid rgba(0, 245, 255, 0.18)",
                boxShadow:
                  "0 40px 80px -28px rgba(0, 0, 0, 0.8), 0 0 60px -16px rgba(0, 245, 255, 0.22)",
                backdropFilter: "blur(18px)",
              }}
              data-testid={`story-card-${active.key}`}
            >
              {/* Ambient glow */}
              <div
                aria-hidden
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-[420px] h-[200px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0, 245, 255, 0.18), transparent 70%)",
                  filter: "blur(48px)",
                }}
              />

              {/* 1. Big metric + context (the hero number) */}
              <div className="relative">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="font-satoshi font-bold bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent tabular-nums leading-none tracking-tight"
                    style={{ fontSize: "clamp(48px, 13vw, 92px)" }}
                    data-testid="story-metric"
                  >
                    {active.metric[isEs ? "es" : "en"]}
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-semibold text-white/90 leading-tight">
                    {active.metricLabel[isEs ? "es" : "en"]}
                  </span>
                </div>
                <p className="text-[12.5px] sm:text-[13px] text-slate-400 leading-relaxed mt-2 max-w-md">
                  {active.context[isEs ? "es" : "en"]}
                </p>
              </div>

              {/* 2. Title — the outcome */}
              <h3
                className="relative font-satoshi font-bold text-white leading-[1.2] tracking-tight mt-6 sm:mt-8 [text-wrap:balance]"
                style={{ fontSize: "clamp(20px, 4.2vw, 28px)" }}
              >
                {active.title[isEs ? "es" : "en"]}
              </h3>

              {/* 3. Before / After — inline, tight */}
              <div className="relative grid sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-7">
                <div className="rounded-xl px-4 py-3 bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-1.5">
                    {isEs ? "Antes" : "Before"}
                  </p>
                  <p className="text-[12.5px] text-slate-400 leading-snug">
                    {active.before[isEs ? "es" : "en"]}
                  </p>
                </div>
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(0, 245, 255, 0.04)",
                    borderColor: "rgba(0, 245, 255, 0.22)",
                  }}
                >
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-1.5">
                    {isEs ? "Después" : "After"}
                  </p>
                  <p className="text-[12.5px] text-slate-200 leading-snug">
                    {active.after[isEs ? "es" : "en"]}
                  </p>
                </div>
              </div>

              {/* 4. Quote + attribution */}
              <figure className="relative mt-7 sm:mt-8 pt-6 border-t border-white/[0.06]">
                <Quote size={16} className="text-[#00F5FF]/60 mb-2" />
                <blockquote
                  className="font-satoshi font-medium text-white leading-snug [text-wrap:balance]"
                  style={{ fontSize: "clamp(15px, 3.4vw, 18px)" }}
                >
                  "{active.quote[isEs ? "es" : "en"]}"
                </blockquote>
                <figcaption className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500 mt-3">
                  — {active.attribution[isEs ? "es" : "en"]}
                </figcaption>
              </figure>

              {/* "Ver caso completo" hint */}
              <div className="relative mt-5 flex items-center justify-end gap-1.5 text-[11px] font-semibold text-[#7FF5FF] opacity-80 group-hover:opacity-100 transition-opacity">
                {isEs ? "Ver caso completo" : "See full case"}
                <ArrowUpRight size={12} />
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Side arrows (desktop) */}
          <button
            type="button"
            onClick={() => { setPaused(true); goPrev(); }}
            aria-label={isEs ? "Anterior" : "Previous"}
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
            data-testid="stories-prev"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => { setPaused(true); goNext(); }}
            aria-label={isEs ? "Siguiente" : "Next"}
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 items-center justify-center rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
            data-testid="stories-next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots — bigger on mobile */}
        <div className="flex items-center justify-center gap-2.5 mt-6" data-testid="stories-dots">
          {STORIES.map((s, i) => {
            const isActive = i === index;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => { setPaused(true); setIndex(i); }}
                aria-label={`${isEs ? "Ir al caso" : "Go to case"} ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-6 h-2 bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.6)]"
                    : "w-2 h-2 bg-white/15 hover:bg-white/30"
                }`}
                data-testid={`stories-dot-${i}`}
              />
            );
          })}
        </div>

        {/* Proof layer — condensed metric strip */}
        <div
          className="mt-12 sm:mt-14 pt-8 border-t border-white/[0.06]"
          data-testid="stories-proof-layer"
        >
          <p className="text-center text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-5">
            {isEs ? "Resultados acumulados" : "Aggregate results"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {proofItems.map((p) => (
              <div
                key={p.key}
                className="rounded-xl px-3 py-3 sm:px-4 sm:py-4 bg-white/[0.015] border border-white/[0.05] text-center"
                data-testid={`proof-${p.key}`}
              >
                <div
                  className="font-satoshi font-bold bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent tabular-nums leading-none tracking-tight"
                  style={{ fontSize: "clamp(18px, 4.5vw, 26px)" }}
                >
                  {p.value}
                </div>
                <p className="text-[10.5px] text-slate-500 leading-snug mt-1.5">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lazy-rendered modal — only mounts when opened */}
      {modalOpen && (
        <CaseStudyModal
          story={active}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onPrimary={handleModalPrimary}
          isEs={isEs}
        />
      )}
    </AnimatedSection>
  );
};

export default SuccessStoriesSection;
