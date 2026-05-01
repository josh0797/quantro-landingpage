import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, X as CloseX, TrendingUp, ArrowRight, Quote } from "lucide-react";

/**
 * Mini case-study modal — Linear/Stripe style.
 *
 * Mobile: bottom-sheet (slides up from bottom, 88vh, internal scroll).
 * Desktop: centered modal (max-width 720px, scale-in from trigger).
 *
 * Props:
 *   story      — full story object (same shape as SuccessStoriesSection data)
 *   open       — boolean
 *   onClose    — () => void
 *   onPrimary  — () => void  (CTA action)
 *   isEs       — lang switch
 */

const fmtSpring = { type: "spring", duration: 0.35, bounce: 0.18 };

/** Tiny before/after sparkline. Red descending → Cyan ascending. */
const MiniChart = ({ isEs }) => {
  // 8 points — before (descending) then after (ascending)
  const points = [68, 62, 58, 52, 48, 54, 66, 82];
  const width = 300;
  const height = 80;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const y = (v) => height - ((v - min) / range) * (height - 8) - 4;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${y(p)}`)
    .join(" ");
  const mid = Math.floor(points.length / 2);
  const splitX = mid * step;

  return (
    <div className="relative" aria-label={isEs ? "Evolución en 90 días" : "90-day trend"}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-20"
      >
        <defs>
          <linearGradient id="cs-before" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="cs-after" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="1" />
          </linearGradient>
          <clipPath id="cs-clip-before">
            <rect x="0" y="0" width={splitX} height={height} />
          </clipPath>
          <clipPath id="cs-clip-after">
            <rect x={splitX} y="0" width={width - splitX} height={height} />
          </clipPath>
        </defs>
        {/* Before segment (red) */}
        <path
          d={path}
          stroke="url(#cs-before)"
          strokeWidth="2"
          fill="none"
          clipPath="url(#cs-clip-before)"
          strokeLinecap="round"
        />
        {/* After segment (cyan, glowing) */}
        <path
          d={path}
          stroke="url(#cs-after)"
          strokeWidth="2.5"
          fill="none"
          clipPath="url(#cs-clip-after)"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(0,245,255,0.5))" }}
        />
        {/* Midpoint divider */}
        <line
          x1={splitX}
          y1="0"
          x2={splitX}
          y2={height}
          stroke="rgba(148,163,184,0.18)"
          strokeDasharray="2 4"
        />
        {/* Endpoint dot */}
        <circle cx={(points.length - 1) * step} cy={y(points[points.length - 1])} r="3.5" fill="#00F5FF" />
      </svg>
      <div className="flex items-center justify-between text-[9px] font-semibold tracking-[0.16em] uppercase mt-2">
        <span className="text-rose-300/70">{isEs ? "Antes" : "Before"}</span>
        <span className="text-slate-500">{isEs ? "Evolución en 90 días" : "90-day trend"}</span>
        <span className="text-[#7FF5FF]">{isEs ? "Después" : "After"}</span>
      </div>
    </div>
  );
};

export const CaseStudyModal = ({ story, open, onClose, onPrimary, isEs = true }) => {
  const dialogRef = useRef(null);

  // ESC to close + body scroll lock
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!story) return null;

  const chips = story.chips?.[isEs ? "es" : "en"] || [];
  const secondary = story.secondaryMetrics?.[isEs ? "es" : "en"] || [];
  const beforeList = story.modalBefore?.[isEs ? "es" : "en"] || [];
  const afterList = story.modalAfter?.[isEs ? "es" : "en"] || [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={onClose}
          data-testid="case-study-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={fmtSpring}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-[720px] max-h-[88vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(14, 22, 40, 0.96) 0%, rgba(5, 10, 24, 0.94) 100%)",
              border: "1px solid rgba(0, 245, 255, 0.22)",
              boxShadow:
                "0 40px 80px -20px rgba(0, 0, 0, 0.8), 0 0 60px -10px rgba(0, 245, 255, 0.3)",
              backdropFilter: "blur(16px)",
            }}
            data-testid="case-study-modal"
          >
            {/* Ambient glow */}
            <div
              aria-hidden
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[480px] h-[240px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0, 245, 255, 0.22), transparent 70%)",
                filter: "blur(52px)",
              }}
            />

            {/* Mobile drag handle */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
              <span className="block w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={isEs ? "Cerrar" : "Close"}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-10"
              data-testid="case-study-modal-close"
            >
              <X size={18} />
            </button>

            <div className="relative px-5 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
              {/* Header */}
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="font-satoshi font-bold bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent tabular-nums leading-none tracking-tight"
                    style={{ fontSize: "clamp(36px, 9vw, 56px)" }}
                    data-testid="case-study-metric"
                  >
                    {story.metric[isEs ? "es" : "en"]}
                  </span>
                  <span className="text-[13px] font-semibold text-white/90">
                    {story.metricLabel[isEs ? "es" : "en"]}
                  </span>
                </div>
                <h3
                  className="font-satoshi font-bold text-white leading-[1.2] tracking-tight mt-4 [text-wrap:balance]"
                  style={{ fontSize: "clamp(19px, 3.6vw, 24px)" }}
                >
                  {story.title[isEs ? "es" : "en"]}
                </h3>

                {/* Chips */}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4" data-testid="case-study-chips">
                    {chips.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold text-slate-300 bg-white/[0.04] border border-white/[0.08]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Before / After */}
              <div className="grid sm:grid-cols-2 gap-3" data-testid="case-study-beforeafter">
                <div className="rounded-xl px-4 py-4 bg-rose-500/[0.04] border border-rose-500/20">
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-rose-300/80 mb-3">
                    {isEs ? "Antes" : "Before"}
                  </p>
                  <ul className="space-y-2">
                    {beforeList.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[12.5px] text-slate-300 leading-snug">
                        <span className="mt-0.5 w-4 h-4 rounded-md bg-rose-500/10 border border-rose-500/25 flex items-center justify-center flex-shrink-0">
                          <CloseX size={9} className="text-rose-300" strokeWidth={2.8} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: "rgba(0, 245, 255, 0.05)",
                    border: "1px solid rgba(0, 245, 255, 0.25)",
                  }}
                >
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-3">
                    {isEs ? "Después" : "After"}
                  </p>
                  <ul className="space-y-2">
                    {afterList.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-[12.5px] text-slate-200 leading-snug">
                        <span className="mt-0.5 w-4 h-4 rounded-md bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center flex-shrink-0">
                          <Check size={9} className="text-[#00F5FF]" strokeWidth={2.8} />
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Secondary metrics 2x2 */}
              {secondary.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5" data-testid="case-study-secondary">
                  {secondary.slice(0, 4).map((m) => (
                    <div
                      key={m.value}
                      className="rounded-xl px-3 py-3 bg-white/[0.02] border border-white/[0.06] text-center"
                    >
                      <div
                        className="font-satoshi font-bold bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent tabular-nums leading-none tracking-tight"
                        style={{ fontSize: "clamp(18px, 4.2vw, 24px)" }}
                      >
                        {m.value}
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-snug mt-1.5">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Mini chart */}
              <div
                className="rounded-xl px-4 py-4 bg-white/[0.015] border border-white/[0.05]"
                data-testid="case-study-chart"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={12} className="text-[#00F5FF]" />
                  <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-slate-400">
                    {isEs ? "Tendencia de 90 días" : "90-day trend"}
                  </span>
                </div>
                <MiniChart isEs={isEs} />
              </div>

              {/* Quote */}
              <figure className="relative pt-5 border-t border-white/[0.06]">
                <Quote size={16} className="text-[#00F5FF]/60 mb-2" />
                <blockquote
                  className="font-satoshi italic text-white leading-snug [text-wrap:balance]"
                  style={{ fontSize: "clamp(15px, 3.4vw, 18px)" }}
                >
                  "{story.quote[isEs ? "es" : "en"]}"
                </blockquote>
                <figcaption className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500 mt-3">
                  — {story.attribution[isEs ? "es" : "en"]}
                </figcaption>
              </figure>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onPrimary?.();
                    onClose();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[13px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/30 transition-all"
                  data-testid="case-study-primary-cta"
                >
                  {isEs ? "Ver cómo funciona esto en Quantro" : "See how this works in Quantro"}
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-auto px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 text-[13px] font-medium hover:bg-white/[0.06] transition-all"
                  data-testid="case-study-secondary-cta"
                >
                  {isEs ? "Cerrar" : "Close"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CaseStudyModal;
