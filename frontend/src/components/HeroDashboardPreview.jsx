import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, Zap, Check, Clock } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

/**
 * HeroDashboardPreview — Decision narrative with intelligent rotation.
 *
 *   1. System status chip — "Quantro Intelligence" is alive ("3 nuevas
 *      oportunidades detectadas hoy · 2 ejecutándose · 1 pendiente").
 *   2. Decision Engine card — rotates through 3 decisions (pricing → ads →
 *      reactivation). First decision waits ~11s before the first swap so
 *      the reader fully absorbs it; subsequent swaps every ~11s.
 *      Cross-fade + 3px blur transition (420ms) — no carousel, no dots.
 *   3. Executable actions — specific, data-backed items adjacent to the
 *      current decision.
 *
 * Hover or tap on the decision card pauses the rotation (blur/fade stop,
 * timer resets on resume). Respects prefers-reduced-motion.
 */

// ── Soft counters (animated number ticker)
const useSoftCounter = (target, duration = 1400, deps = []) => {
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
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, ...deps]);
  return v;
};

// ── Decision data ──────────────────────────────────────────────────────
// Three decisions Quantro rotates through. Each is a single narrative with
// inline metrics so the card reads like a sentence, not a dashboard.
const buildDecisions = (isEs) => [
  {
    key: "pricing",
    kicker: isEs ? "Pricing · margen" : "Pricing · margin",
    render: ({ rev, growth, lift }) =>
      isEs ? (
        <>
          Tus ingresos subieron a{" "}
          <span className="font-mono tabular-nums text-[#7FF5FF]">${Math.round(rev)}K</span>{" "}
          <span className="text-emerald-300 tabular-nums">(+{growth.toFixed(1)}%)</span>, pero
          estás perdiendo margen en 2 productos clave.
        </>
      ) : (
        <>
          Revenue grew to{" "}
          <span className="font-mono tabular-nums text-[#7FF5FF]">${Math.round(rev)}K</span>{" "}
          <span className="text-emerald-300 tabular-nums">(+{growth.toFixed(1)}%)</span>, but
          margin is slipping on 2 key products.
        </>
      ),
    action: isEs
      ? <>Ajustar precios en <span className="text-white font-medium">"Silla ejecutiva"</span> y <span className="text-white font-medium">"Escritorio Pro"</span>.</>
      : <>Adjust pricing on <span className="text-white font-medium">"Executive Chair"</span> and <span className="text-white font-medium">"Pro Desk"</span>.</>,
    impactLabel: isEs ? "margen" : "margin",
    analyzing: isEs ? "Analizando pricing" : "Analysing pricing",
    counters: { rev: 847, growth: 12.4, lift: 3.2 },
    impactKey: "lift",
    actions: [
      { state: "running", es: <>Ajustar precio <span className="text-white">(+5%)</span> en 2 productos</>, en: <>Adjust price <span className="text-white">(+5%)</span> on 2 products</> },
      { state: "running", es: <>Notificar al equipo comercial</>, en: <>Notify sales team</> },
      { state: "pending", es: <>Actualizar catálogo público</>, en: <>Publish updated catalog</> },
    ],
  },
  {
    key: "ads",
    kicker: isEs ? "Ads · eficiencia" : "Ads · efficiency",
    render: ({ wasted, lift }) =>
      isEs ? (
        <>
          Estás perdiendo{" "}
          <span className="font-mono tabular-nums text-rose-300">${Math.round(wasted).toLocaleString()}</span>{" "}
          al mes en campañas ineficientes. Reasignar presupuesto mejoraría tu ROI.
        </>
      ) : (
        <>
          You're burning{" "}
          <span className="font-mono tabular-nums text-rose-300">${Math.round(wasted).toLocaleString()}</span>{" "}
          a month on underperforming campaigns. Reallocating would lift ROI.
        </>
      ),
    action: isEs
      ? <>Pausar <span className="text-white font-medium">2 conjuntos de anuncios</span> y redirigir a Meta Advantage.</>
      : <>Pause <span className="text-white font-medium">2 ad sets</span> and redirect to Meta Advantage.</>,
    impactLabel: "ROI",
    analyzing: isEs ? "Analizando eficiencia de Ads" : "Analysing Ads efficiency",
    counters: { wasted: 2000, lift: 22 },
    impactKey: "lift",
    actions: [
      { state: "running", es: <>Pausar 2 conjuntos de Meta Ads</>, en: <>Pause 2 Meta ad sets</> },
      { state: "running", es: <>Reasignar <span className="text-white">$2,000</span> a campañas top</>, en: <>Reallocate <span className="text-white">$2,000</span> to top campaigns</> },
      { state: "pending", es: <>Revisar creatividades antes de relanzar</>, en: <>Review creatives before relaunch</> },
    ],
  },
  {
    key: "reactivation",
    kicker: isEs ? "Clientes · ingresos" : "Customers · revenue",
    render: ({ count, potential }) =>
      isEs ? (
        <>
          <span className="font-mono tabular-nums text-[#7FF5FF]">{Math.round(count)}</span> clientes inactivos pueden reactivarse con seguimiento automático. Potencial:{" "}
          <span className="text-emerald-300 tabular-nums">+${Math.round(potential)}K</span>.
        </>
      ) : (
        <>
          <span className="font-mono tabular-nums text-[#7FF5FF]">{Math.round(count)}</span> inactive customers can be re-engaged with automated follow-up. Potential:{" "}
          <span className="text-emerald-300 tabular-nums">+${Math.round(potential)}K</span>.
        </>
      ),
    action: isEs
      ? <>Lanzar <span className="text-white font-medium">secuencia de reactivación</span> personalizada por segmento.</>
      : <>Launch a <span className="text-white font-medium">re-engagement sequence</span> tailored by segment.</>,
    impactLabel: isEs ? "potencial" : "potential",
    analyzing: isEs ? "Analizando comportamiento de clientes" : "Analysing customer behaviour",
    counters: { count: 14, potential: 58 },
    impactKey: "potential",
    impactSuffix: "K",
    impactPrefix: "+$",
    actions: [
      { state: "running", es: <>Segmentar por última compra</>, en: <>Segment by last purchase</> },
      { state: "pending", es: <>Revisar plantilla de email</>, en: <>Review email template</> },
      { state: "pending", es: <>Aprobar envío a <span className="text-white">14 clientes</span></>, en: <>Approve send to <span className="text-white">14 customers</span></> },
    ],
  },
];

const ROTATE_FIRST_DELAY = 15000; // first decision stays longer (more reading time)
const ROTATE_EVERY = 15000;       // subsequent swaps

export const HeroDashboardPreview = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const decisions = React.useMemo(() => buildDecisions(isEs), [isEs]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Intelligent rotation — first card waits longer, user-interaction pauses.
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const delay = idx === 0 ? ROTATE_FIRST_DELAY : ROTATE_EVERY;
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % decisions.length);
    }, delay);
    return () => clearTimeout(t);
  }, [idx, paused, decisions.length]);

  const active = decisions[idx];
  // Soft counters that reset and re-animate each time the decision changes.
  // We read from `active.counters` and expose a map the render() can consume.
  const c = active.counters;
  const c1 = useSoftCounter(c.rev ?? 0, 1400, [idx]);
  const c2 = useSoftCounter(c.growth ?? 0, 1400, [idx]);
  const c3 = useSoftCounter(c.lift ?? 0, 1400, [idx]);
  const c4 = useSoftCounter(c.wasted ?? 0, 1400, [idx]);
  const c5 = useSoftCounter(c.count ?? 0, 1400, [idx]);
  const c6 = useSoftCounter(c.potential ?? 0, 1400, [idx]);
  const counterMap = {
    rev: c1, growth: c2, lift: c3, wasted: c4, count: c5, potential: c6,
  };
  const impactVal = counterMap[active.impactKey];
  const impactStr = `${active.impactPrefix || "+"}${
    active.impactKey === "count" ? Math.round(impactVal) : impactVal.toFixed(1)
  }${active.impactSuffix || (active.impactLabel === "ROI" ? "%" : "%")}`;

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      className="relative"
      data-testid="hero-dashboard-preview"
    >
      {/* Ambient glow behind the card */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-[#A020FF]/10 rounded-3xl blur-2xl" />

      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.92) 0%, rgba(3, 7, 18, 0.95) 100%)",
          border: "1px solid rgba(148, 163, 184, 0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Browser bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] text-slate-500 font-mono">app.quantroos.com · decision engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-slate-500">Live</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* System status — reinforces that Quantro is constantly analysing */}
          <div
            className="flex items-center justify-between gap-2 text-[10.5px]"
            data-testid="hero-dash-status"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles size={11} className="text-[#7FF5FF]" />
              <span className="font-medium">
                {isEs ? "Quantro Intelligence" : "Quantro Intelligence"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[9.5px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#00F5FF] shadow-[0_0_4px_rgba(0,245,255,0.9)]" />
                {isEs ? "3 oportunidades hoy" : "3 opportunities today"}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.9)]" />
                {isEs ? "2 ejecutándose" : "2 running"}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.9)]" />
                {isEs ? "1 pendiente" : "1 pending"}
              </span>
            </div>
          </div>

          {/* Decision Engine — rotates through 3 decisions with cross-fade+blur.
              Min-height keeps layout stable during the transition. */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(0, 245, 255, 0.06), rgba(14, 22, 40, 0.85))",
              border: "1px solid rgba(0, 245, 255, 0.22)",
              boxShadow: "0 18px 50px -20px rgba(0, 245, 255, 0.28)",
              minHeight: "168px",
            }}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
            data-testid="hero-dash-decision"
            data-decision-key={active.key}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.key}
                initial={{ opacity: 0, filter: "blur(5px)", y: 4 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(5px)", y: -4 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="p-4"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold tracking-[0.2em] uppercase text-[#7FF5FF]">
                    <TrendingUp size={10} />
                    {isEs ? "Recomendación prioritaria" : "Priority recommendation"}
                  </span>
                  <span className="text-[9px] font-medium tracking-wider uppercase text-slate-500">
                    {active.kicker}
                  </span>
                </div>

                {/* Narrative with inline metrics */}
                <p className="text-[13px] sm:text-[13.5px] text-white leading-snug font-medium">
                  {active.render(counterMap)}
                </p>

                {/* Suggested action */}
                <div className="mt-3 flex items-start gap-2 text-[12px] text-slate-300 leading-snug">
                  <ArrowRight size={12} className="text-[#7FF5FF] mt-0.5 flex-shrink-0" />
                  <span>{active.action}</span>
                </div>

                {/* Impact pill + approve */}
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold"
                    style={{
                      background: "rgba(52, 211, 153, 0.12)",
                      border: "1px solid rgba(52, 211, 153, 0.3)",
                      color: "#6EE7B7",
                    }}
                  >
                    <Sparkles size={9} />
                    {isEs ? "Impacto estimado:" : "Estimated impact:"}{" "}
                    <span className="tabular-nums">{impactStr}</span>{" "}
                    {active.impactLabel}
                  </span>
                  <button
                    type="button"
                    className="text-[10.5px] font-semibold text-[#0A0F1C] px-3 py-1.5 rounded-md bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] hover:shadow-[0_0_16px_rgba(0,245,255,0.3)] transition-shadow"
                    data-testid="hero-dash-approve"
                  >
                    {isEs ? "Aprobar" : "Approve"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Executable actions — also cross-fade with the decision. */}
          <div className="space-y-1.5" data-testid="hero-dash-actions">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-slate-500">
                {isEs ? "Acciones listas" : "Ready actions"}
              </p>
              <AnalyzingIndicator text={active.analyzing} activeKey={active.key} />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`actions-${active.key}`}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-1.5"
              >
                {active.actions.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]"
                  >
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          a.state === "running"
                            ? "rgba(52, 211, 153, 0.14)"
                            : "rgba(251, 191, 36, 0.14)",
                        border:
                          a.state === "running"
                            ? "1px solid rgba(52, 211, 153, 0.35)"
                            : "1px solid rgba(251, 191, 36, 0.35)",
                      }}
                    >
                      {a.state === "running" ? (
                        <Check size={9} className="text-emerald-300" strokeWidth={3} />
                      ) : (
                        <Clock size={9} className="text-amber-300" />
                      )}
                    </span>
                    <span className="text-[11.5px] text-slate-300 leading-snug">
                      {isEs ? a.es : a.en}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Flow badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -bottom-3 -left-3 bg-[#A020FF]/20 border border-[#A020FF]/30 rounded-lg px-3 py-1.5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-1.5">
          <Zap className="text-[#A020FF]" size={12} />
          <span className="text-[#A020FF] text-[11px] font-medium">Quantro Flow</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// AnalyzingIndicator — types out the current decision's analyzing-label with
// a subtle blinking caret, then a trio of breathing dots signals ongoing
// computation. When the active decision changes, the typing restarts.
const AnalyzingIndicator = ({ text, activeKey }) => {
  const [shown, setShown] = React.useState("");
  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text);
      return;
    }
    setShown("");
    const chars = [...text];
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(chars.slice(0, i).join(""));
      if (i >= chars.length) clearInterval(id);
    }, 34); // ~12 chars/s — feels human, not robotic
    return () => clearInterval(id);
  }, [text, activeKey]);

  const typing = shown.length < text.length;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[9px] font-medium tracking-wider uppercase text-slate-500 max-w-[55%]"
      data-testid="hero-dash-analyzing"
    >
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] h-[3px] rounded-full bg-[#7FF5FF]"
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: 1.4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </span>
      <span className="truncate" aria-live="polite">
        {shown}
        {typing && (
          <motion.span
            aria-hidden
            className="inline-block w-[1px] h-[9px] align-[-1px] ml-[1px] bg-[#7FF5FF]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          />
        )}
      </span>
    </span>
  );
};

export default HeroDashboardPreview;
