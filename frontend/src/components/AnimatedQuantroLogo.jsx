import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AnimatedQuantroLogo — the "living" brand mark.
 *
 * Communicates: "Quantro is thinking, analyzing, preparing decisions."
 *
 * Variants:
 *   - "loading" : full sequence — stroke-draw (900ms) → glow pulse (600ms) →
 *                 gentle breathing loop every ~4s. Use for page / content loaders.
 *   - "hover"   : glow-pulse only on hover (use in navbar logo, buttons).
 *   - "thinking": slow circular pulse (as if analyzing data).
 *   - "complete": plays a single "tail-lights-up" flash then settles.
 *   - "idle"    : static ring + tail with minimal resting glow.
 *
 * Accessibility:
 *   - Respects `prefers-reduced-motion` (falls back to static idle).
 *   - aria-label describes the mark.
 *
 * API is intentionally small: size + variant + className.
 */

const GRAD_FROM = "#00E5FF";
const GRAD_TO = "#22D3EE";

// Path metadata — keep in sync with the stroke drawing
// We draw the circle first, then the tail. Dash length approximations
// (Framer's `pathLength` prop normalises to [0,1] so exact pixel length
// doesn't matter — we just use 1 → 0 offset).

export const AnimatedQuantroLogo = ({
  size = 32,
  variant = "hover",
  className = "",
  "aria-label": ariaLabel = "Quantro",
  "data-testid": testId = "quantro-logo-animated",
}) => {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [drawPhase, setDrawPhase] = useState("idle"); // 'idle' | 'drawing' | 'done'
  const drewOnceRef = useRef(false);

  // Kick off the draw animation on mount for loading / complete variants
  useEffect(() => {
    if (reduceMotion) return;
    if (drewOnceRef.current) return;
    if (variant === "loading" || variant === "complete") {
      setDrawPhase("drawing");
      drewOnceRef.current = true;
      const t = setTimeout(() => setDrawPhase("done"), 900);
      return () => clearTimeout(t);
    }
  }, [variant, reduceMotion]);

  // If reduced motion: render a purely static version (same as QuantroLogoMark)
  if (reduceMotion) {
    return <StaticMark size={size} className={className} aria-label={ariaLabel} testId={testId} />;
  }

  // Breathing loop is only active in the loading variant (after draw completes)
  const showBreathing = variant === "loading" && drawPhase === "done";

  // Glow triggers
  const pulseGlow =
    variant === "loading"
      ? drawPhase === "done"
      : variant === "hover"
      ? hovered
      : variant === "thinking"
      ? true
      : variant === "complete"
      ? drawPhase === "done"
      : false;

  // Tail-flash (complete variant)
  const tailFlash = variant === "complete" && drawPhase === "done";

  const ringDraw =
    (variant === "loading" || variant === "complete") && drawPhase === "drawing";
  const tailDraw =
    (variant === "loading" || variant === "complete") && drawPhase === "drawing";

  return (
    <motion.span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={testId}
      data-variant={variant}
      animate={showBreathing ? { scale: [1, 1.015, 1] } : { scale: 1 }}
      transition={
        showBreathing
          ? { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }
          : { duration: 0.2 }
      }
    >
      {/* Outer ambient glow — ramps on pulse events */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-[22%]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.55), rgba(34, 211, 238, 0) 65%)",
          filter: "blur(6px)",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: pulseGlow ? (variant === "thinking" ? [0.15, 0.45, 0.15] : [0.0, 0.7, 0.15]) : 0.0,
        }}
        transition={
          variant === "thinking"
            ? { duration: 2.2, ease: "easeInOut", repeat: Infinity }
            : { duration: 0.6, ease: "easeOut" }
        }
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={ariaLabel}
        role="img"
        style={{ display: "block", position: "relative" }}
      >
        <defs>
          <linearGradient id="aqm-grad" x1="8" y1="8" x2="56" y2="56">
            <stop offset="0%" stopColor={GRAD_FROM} />
            <stop offset="100%" stopColor={GRAD_TO} />
          </linearGradient>
          <linearGradient id="aqm-bg" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#0B0F1A" />
          </linearGradient>
          <filter id="aqm-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        {/* Container */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          fill="url(#aqm-bg)"
          stroke="url(#aqm-grad)"
          strokeWidth="1.15"
          strokeOpacity="0.38"
        />

        {/* Thinking mode — tiny orbiting dot around the Q */}
        {variant === "thinking" && (
          <motion.circle
            r="1.3"
            fill={GRAD_FROM}
            style={{
              filter: `drop-shadow(0 0 4px ${GRAD_FROM})`,
            }}
            initial={false}
            animate={{
              cx: [32 + 14, 32 + 14 * Math.cos(Math.PI / 2), 32 - 14, 32 + 14 * Math.cos((3 * Math.PI) / 2), 32 + 14],
              cy: [31, 31 + 14, 31, 31 - 14, 31],
            }}
            transition={{
              duration: 3.2,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        )}

        {/* Q ring — draws on mount for loading/complete */}
        <motion.circle
          cx="32"
          cy="31"
          r="11"
          stroke="url(#aqm-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          filter="url(#aqm-soft)"
          initial={ringDraw ? { pathLength: 0, opacity: 0.9 } : { pathLength: 1, opacity: 1 }}
          animate={
            ringDraw
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 1, opacity: 1 }
          }
          transition={ringDraw ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] } : { duration: 0.2 }}
        />

        {/* Q tail — draws after the ring; flashes on complete */}
        <motion.path
          d="M39 38.5 L47 47"
          stroke="url(#aqm-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#aqm-soft)"
          initial={tailDraw ? { pathLength: 0, opacity: 0.9 } : { pathLength: 1, opacity: 1 }}
          animate={
            tailFlash
              ? { pathLength: 1, opacity: [1, 1], filter: ["drop-shadow(0 0 0px #00E5FF)", "drop-shadow(0 0 6px #00E5FF)", "drop-shadow(0 0 0px #00E5FF)"] }
              : tailDraw
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 1, opacity: 1 }
          }
          transition={
            tailFlash
              ? { duration: 0.7, ease: "easeInOut", delay: 0.1 }
              : tailDraw
              ? { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.55 }
              : { duration: 0.2 }
          }
        />
      </svg>
    </motion.span>
  );
};

/* ------------------------------------------------------------------
 * Static fallback — used for prefers-reduced-motion. Matches the
 * frozen look of AnimatedQuantroLogo without animating anything.
 * ------------------------------------------------------------------ */
const StaticMark = ({ size = 32, className = "", "aria-label": ariaLabel = "Quantro", testId }) => (
  <span className={`inline-flex ${className}`} style={{ width: size, height: size }} data-testid={testId}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label={ariaLabel} role="img">
      <defs>
        <linearGradient id="aqm-static-grad" x1="8" y1="8" x2="56" y2="56">
          <stop offset="0%" stopColor={GRAD_FROM} />
          <stop offset="100%" stopColor={GRAD_TO} />
        </linearGradient>
        <linearGradient id="aqm-static-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#0B0F1A" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#aqm-static-bg)" stroke="url(#aqm-static-grad)" strokeWidth="1.15" strokeOpacity="0.4" />
      <circle cx="32" cy="31" r="11" stroke="url(#aqm-static-grad)" strokeWidth="3" fill="none" />
      <path d="M39 38.5 L47 47" stroke="url(#aqm-static-grad)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </span>
);

export default AnimatedQuantroLogo;
