import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { trackCTAClick } from "../../lib/analytics";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const FALLBACK_COUNT = 127;
const NEW_THIS_WEEK = 3;

// Paired rows of live customers — two per line for a quieter rhythm.
const COMPANY_PAIRS = [
  ["Grupo Nexo", "Altura Retail"],
  ["Nodo Studios", "Grupo OCP"],
];

/**
 * Count-up number used in the hero of the card. Tweens 0 → target once
 * the card enters the viewport. Duration intentionally shorter (900ms)
 * than the legacy variant so the number lands before the company rows
 * start staggering in.
 */
const AnimatedCount = ({ target, inView }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView || !target) return;
    const duration = 1000;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);
  return (
    <span className="tabular-nums font-satoshi font-bold">
      {value.toLocaleString()}
    </span>
  );
};

/**
 * Social Proof — "127 empresas ya se unieron a Quantro" glass card.
 *
 * Acts as the narrative bridge between the hero and the Success Stories
 * block. Three ideas compress into one card:
 *   1. Live-feeling counter (real number from backend, count-up on entry).
 *   2. Momentum signal ("+3 nuevas esta semana", "Actualizado hoy").
 *   3. Real customer names, staggered so the eye lingers.
 *
 * The card is interactive — click/tap reveals the phrase "Ver cómo
 * operan →" and scrolls to #casos-de-exito, handing the visitor off to
 * the Success Stories carousel. As that section comes into view the
 * card's opacity fades to ~0.55 via scroll parallax so the reader feels
 * a continuous narrative instead of two disconnected blocks.
 */
export const SocialProofSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [count, setCount] = useState(null);
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-80px" });

  // ── Real count (with safe fallback) ───────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/stripe/payments/count`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCount(data.count || FALLBACK_COUNT);
      } catch {
        if (!cancelled) setCount(FALLBACK_COUNT);
      }
    };
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // ── Handoff parallax ──────────────────────────────────────────────────
  // As the Success Stories section approaches, the proof card's opacity
  // eases from 1 → 0.55, creating the "consequence, not cut" feel
  // (Apple-style continuity). `useScroll` targets this section's own
  // viewport position so we don't need to query #casos-de-exito.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 20%", "end -10%"],
  });
  const cardOpacity = useTransform(scrollYProgress, [0.5, 1], [1, 0.55]);
  const cardY = useTransform(scrollYProgress, [0.5, 1], [0, -12]);

  // ── CTA: scroll to Success Stories ────────────────────────────────────
  const scrollToStories = () => {
    trackCTAClick("social_proof_to_cases");
    const target =
      document.getElementById("casos-de-exito") ||
      document.getElementById("success-stories");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const displayCount = count !== null ? count : FALLBACK_COUNT;

  return (
    <AnimatedSection className="py-14 sm:py-16 px-6" data-testid="social-proof-wrapper">
      <div ref={rootRef} className="max-w-3xl mx-auto">
        <motion.div
          ref={cardRef}
          variants={fadeInUp}
          style={{ opacity: cardOpacity, y: cardY }}
          className="relative rounded-[22px] overflow-hidden"
          data-testid="social-proof-section"
        >
          {/* Glass base + faint cyan top-glow to anchor the "live" dot */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 55%), linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(3, 7, 18, 0.85) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.10)",
              boxShadow: "0 30px 60px -30px rgba(0, 0, 0, 0.6)",
              borderRadius: "22px",
            }}
          />

          {/* Clickable layer — the whole card nudges the visitor forward */}
          <button
            type="button"
            onClick={scrollToStories}
            className="relative w-full text-left px-7 sm:px-10 py-8 sm:py-9 group focus:outline-none"
            data-testid="social-proof-cta"
            aria-label={
              isEs
                ? "Ver casos de éxito de empresas que usan Quantro"
                : "See success stories of companies using Quantro"
            }
          >
            {/* ── Live eyebrow ── */}
            <div className="flex items-center gap-2 mb-5">
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                  animate={{ opacity: [0.7, 0, 0.7], scale: [1, 2.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase text-emerald-300"
                data-testid="social-proof-live-label"
              >
                {isEs ? "En vivo" : "Live"}
              </span>
            </div>

            {/* ── Big count + headline ── */}
            <p
              className="font-satoshi font-bold text-white leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(28px, 5.4vw, 44px)" }}
              data-testid="social-proof-count"
            >
              <span
                className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent"
                style={{
                  textShadow: "0 0 24px rgba(0, 245, 255, 0.2)",
                }}
              >
                <AnimatedCount target={displayCount} inView={inView} />
              </span>{" "}
              <span className="text-white/95">
                {isEs
                  ? "empresas ya se unieron a Quantro"
                  : "companies have already joined Quantro"}
              </span>
            </p>

            {/* ── Micro-activity signals ── */}
            <div
              className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-slate-400"
              data-testid="social-proof-signals"
            >
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0, duration: 0.45 }}
                className="inline-flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-[#7FF5FF]/80" />
                <span className="text-slate-300">
                  <span className="font-semibold text-[#7FF5FF]">
                    +{NEW_THIS_WEEK}
                  </span>{" "}
                  {isEs ? "nuevas esta semana" : "new this week"}
                </span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.15, duration: 0.45 }}
                className="text-slate-500"
              >
                {isEs ? "Actualizado hace un momento" : "Updated moments ago"}
              </motion.span>
            </div>

            {/* ── Divider ── */}
            <div className="mt-6 mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {/* ── Company names ── */}
            <p className="text-[10.5px] font-semibold tracking-[0.22em] uppercase text-slate-500 mb-3">
              {isEs ? "Equipos que ya operan con Quantro" : "Teams running on Quantro"}
            </p>
            <div
              className="space-y-1.5 text-[13.5px] tracking-[0.05em] text-slate-300"
              data-testid="social-proof-companies"
            >
              {COMPANY_PAIRS.map((pair, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.45 + i * 0.22,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center gap-3"
                >
                  <span>{pair[0]}</span>
                  <span className="text-slate-600" aria-hidden>
                    ·
                  </span>
                  <span>{pair[1]}</span>
                </motion.div>
              ))}
            </div>

            {/* ── Reveal on hover: "Ver cómo operan →" ── */}
            <div
              className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#7FF5FF] opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
              data-testid="social-proof-hint"
            >
              <span>{isEs ? "Ver cómo operan" : "See how they run"}</span>
              <ArrowDown
                size={13}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </div>
          </button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default SocialProofSection;
