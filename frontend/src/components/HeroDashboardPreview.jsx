import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, Zap, Check, Clock } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

/**
 * HeroDashboardPreview — redesigned from a classic dashboard into a
 * "decision narrative":
 *
 *   1. System status chip — shows "Quantro Intelligence" is alive and
 *      reasoning ("3 decisiones generadas hoy · 2 ejecutándose · 1
 *      pendiente de aprobación").
 *   2. Decision Engine card — the hero insight: title → context → action →
 *      impact. Metrics appear inline inside the narrative, not as
 *      standalone tiles.
 *   3. Executable actions — specific, data-backed items (not generic
 *      "Send proposals / Optimize costs" checklists).
 *
 * The whole card reads in ~3 seconds and conveys: "Quantro already
 * thought about this. You just need to approve."
 */

const useSoftCounter = (target, duration = 1600) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setV(target);
      return;
    }
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
  }, [target, duration]);
  return v;
};

export const HeroDashboardPreview = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  // Soft counters for the narrative numbers
  const revenue = useSoftCounter(847);
  const growth = useSoftCounter(12.4);
  const marginLift = useSoftCounter(3.2);

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

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* System status — "Quantro is alive" */}
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
                {isEs ? "3 decisiones" : "3 decisions"}
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

          {/* Decision Engine — primary insight */}
          <div
            className="relative rounded-xl p-4 overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(0, 245, 255, 0.06), rgba(14, 22, 40, 0.85))",
              border: "1px solid rgba(0, 245, 255, 0.22)",
              boxShadow: "0 18px 50px -20px rgba(0, 245, 255, 0.28)",
            }}
            data-testid="hero-dash-decision"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold tracking-[0.2em] uppercase text-[#7FF5FF]">
                <TrendingUp size={10} />
                {isEs ? "Recomendación prioritaria" : "Priority recommendation"}
              </span>
              <span className="text-[9px] font-medium tracking-wider uppercase text-slate-500">
                {isEs ? "Recomendado por Quantro Intelligence" : "By Quantro Intelligence"}
              </span>
            </div>

            {/* Narrative block — metrics live INSIDE the sentence */}
            <p className="text-[13px] sm:text-[13.5px] text-white leading-snug font-medium">
              {isEs ? (
                <>
                  Tus ingresos subieron a{" "}
                  <span className="font-mono tabular-nums text-[#7FF5FF]">
                    ${Math.round(revenue)}K
                  </span>{" "}
                  <span className="text-emerald-300 tabular-nums">(+{growth.toFixed(1)}%)</span>, pero estás perdiendo margen en 2 productos clave.
                </>
              ) : (
                <>
                  Revenue grew to{" "}
                  <span className="font-mono tabular-nums text-[#7FF5FF]">
                    ${Math.round(revenue)}K
                  </span>{" "}
                  <span className="text-emerald-300 tabular-nums">(+{growth.toFixed(1)}%)</span>, but margin is slipping on 2 key products.
                </>
              )}
            </p>

            {/* Suggested action */}
            <div className="mt-3 flex items-start gap-2 text-[12px] text-slate-300 leading-snug">
              <ArrowRight size={12} className="text-[#7FF5FF] mt-0.5 flex-shrink-0" />
              <span>
                {isEs
                  ? <>Ajustar precios en <span className="text-white font-medium">"Silla ejecutiva"</span> y <span className="text-white font-medium">"Escritorio Pro"</span>.</>
                  : <>Adjust pricing on <span className="text-white font-medium">"Executive Chair"</span> and <span className="text-white font-medium">"Pro Desk"</span>.</>}
              </span>
            </div>

            {/* Expected impact pill */}
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
                <span className="tabular-nums">+{marginLift.toFixed(1)}%</span>{" "}
                {isEs ? "margen" : "margin"}
              </span>
              <button
                type="button"
                className="text-[10.5px] font-semibold text-[#0A0F1C] px-3 py-1.5 rounded-md bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] hover:shadow-[0_0_16px_rgba(0,245,255,0.3)] transition-shadow"
                data-testid="hero-dash-approve"
              >
                {isEs ? "Aprobar" : "Approve"}
              </button>
            </div>
          </div>

          {/* Executable actions — specific, data-backed */}
          <div className="space-y-1.5" data-testid="hero-dash-actions">
            <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-slate-500">
              {isEs ? "Acciones listas" : "Ready actions"}
            </p>

            {[
              {
                state: "running",
                es: <>Ajustar precio <span className="text-white">(+5%)</span> en 2 productos</>,
                en: <>Adjust price <span className="text-white">(+5%)</span> on 2 products</>,
              },
              {
                state: "running",
                es: <>Reasignar presupuesto Ads <span className="text-white">(−$2,000 desperdiciados)</span></>,
                en: <>Reallocate Ads budget <span className="text-white">(−$2,000 wasted)</span></>,
              },
              {
                state: "pending",
                es: <>Reactivar <span className="text-white">14 clientes inactivos</span> (últimos 30 días)</>,
                en: <>Reactivate <span className="text-white">14 inactive customers</span> (last 30 days)</>,
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-white/[0.015] border border-white/[0.04]"
              >
                <span
                  className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      a.state === "running" ? "rgba(52, 211, 153, 0.14)" : "rgba(251, 191, 36, 0.14)",
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

export default HeroDashboardPreview;
