import React from "react";
import { motion } from "framer-motion";
import { Brain, Workflow, ArrowRight, Lock } from "lucide-react";
import { PLATFORMS } from "../lib/platformRoutes";
import { trackCTAClick } from "../lib/analytics";

/**
 * Apple-style platform-picker panel.
 *
 * Narrative structure:
 *   STEP 1 — Statement  ("Esto no es una app." → "Es un sistema…")
 *   STEP 2 — Reveal     ("Quantro funciona en dos capas:") + 2 cards
 *
 * Each card redirects DIRECTLY to the external product URL — this screen
 * no longer orchestrates auth. Each product handles its own sign-in.
 */

const STATEMENT_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const PlatformCard = ({ platform, onPick, isEs, cta, bullets, delay }) => {
  const Icon = platform.id === "os" ? Brain : Workflow;
  const isReady = platform.available && platform.url;
  const disabled = !isReady;

  return (
    <motion.button
      type="button"
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      custom={delay}
      whileHover={disabled ? undefined : { scale: 1.02, y: -3 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={() => !disabled && onPick(platform.id)}
      disabled={disabled}
      className="group relative text-left rounded-2xl p-6 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#00F5FF]/60"
      style={{
        background:
          "linear-gradient(160deg, rgba(14, 22, 40, 0.82), rgba(5, 10, 24, 0.72))",
        border: `1px solid ${platform.accent}3A`,
        boxShadow: disabled
          ? "none"
          : `0 20px 54px -22px ${platform.accent}55, inset 0 1px 0 rgba(255,255,255,0.04)`,
        backdropFilter: "blur(18px)",
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      data-testid={`platform-card-${platform.id}`}
    >
      {/* Glow layer intensifies on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top, ${platform.accent}22, transparent 70%)`,
        }}
      />

      <div className="relative flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${platform.accent}2E, ${platform.accent}08)`,
            border: `1px solid ${platform.accent}55`,
          }}
        >
          <Icon size={18} style={{ color: platform.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="text-[9px] font-bold tracking-[0.22em] uppercase"
            style={{ color: platform.accent }}
          >
            {platform.name}
          </div>
          <div className="font-satoshi font-bold text-[20px] text-white leading-tight tracking-tight mt-1.5">
            {platform.tagline[isEs ? "es" : "en"]}
          </div>
        </div>
        {disabled && <Lock size={14} className="text-slate-500 flex-shrink-0 mt-1" />}
      </div>

      {/* Bullets */}
      <ul className="relative mt-5 space-y-1.5">
        {bullets.map((b, i) => (
          <li
            key={i}
            className="text-[12.5px] text-slate-300/90 leading-snug flex gap-2"
          >
            <span
              aria-hidden
              className="mt-1 w-1 h-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: platform.accent }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* CTA row — animated underline sweeps from left on hover */}
      <div className="relative mt-6 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
          style={{ color: platform.accent }}
        >
          {cta}
          <motion.span
            aria-hidden
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            className="inline-flex"
          >
            <ArrowRight size={13} />
          </motion.span>
        </span>
        {!disabled && (
          <span className="text-[10px] tracking-[0.16em] uppercase text-slate-500">
            {isEs ? "Abrir" : "Open"}
          </span>
        )}
      </div>

      {/* Animated bottom line */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] origin-left"
        style={{
          width: "100%",
          background: `linear-gradient(90deg, ${platform.accent}, ${platform.accent}00)`,
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <style>{`
        button[data-testid="platform-card-${platform.id}"]:hover span[aria-hidden]:last-of-type {
          transform: scaleX(1) !important;
        }
      `}</style>
    </motion.button>
  );
};

export const AccessPickerPanel = ({ isEs, onPick }) => {
  const osBullets = isEs
    ? [
        "Analiza tu empresa",
        "Detecta oportunidades",
        "Define qué hacer",
      ]
    : [
        "Analyzes your business",
        "Detects opportunities",
        "Decides what to do",
      ];

  const flowBullets = isEs
    ? [
        "Captura leads",
        "Da seguimiento",
        "Organiza tu operación",
        "Convierte más oportunidades en ventas",
        "Mantiene a tus clientes activos",
      ]
    : [
        "Captures leads",
        "Follows up",
        "Organizes operations",
        "Turns opportunities into sales",
        "Keeps customers engaged",
      ];

  const handlePick = (platformId) => {
    const url = PLATFORMS[platformId]?.url;
    if (!url) return;
    trackCTAClick(`access_picker_${platformId}`);
    // Direct redirect — each app handles its own auth.
    window.location.href = url;
  };

  const pick = typeof onPick === "function" ? onPick : handlePick;

  return (
    <div className="w-full" data-testid="access-picker-panel">
      {/* Narrative — STEP 1 */}
      <div className="text-center mb-8">
        <motion.p
          variants={STATEMENT_VARIANTS}
          initial="hidden"
          animate="visible"
          custom={0.05}
          className="font-satoshi font-bold text-white text-2xl sm:text-3xl leading-tight tracking-tight"
          data-testid="access-statement-1"
        >
          {isEs ? "Esto no es una app." : "This is not an app."}
        </motion.p>
        <motion.p
          variants={STATEMENT_VARIANTS}
          initial="hidden"
          animate="visible"
          custom={0.9}
          className="font-satoshi text-slate-300 text-lg sm:text-xl leading-snug tracking-tight mt-2 max-w-xl mx-auto"
          data-testid="access-statement-2"
        >
          {isEs
            ? "Es un sistema que piensa y ejecuta por ti."
            : "It's a system that thinks and executes for you."}
        </motion.p>
      </div>

      {/* Narrative — STEP 2 */}
      <motion.p
        variants={STATEMENT_VARIANTS}
        initial="hidden"
        animate="visible"
        custom={1.6}
        className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-[#00F5FF]/80 mb-4"
        data-testid="access-reveal"
      >
        {isEs ? "Quantro funciona en dos capas" : "Quantro runs in two layers"}
      </motion.p>

      <div className="grid sm:grid-cols-2 gap-4">
        <PlatformCard
          platform={PLATFORMS.os}
          onPick={pick}
          isEs={isEs}
          cta={isEs ? "Ver decisiones" : "See decisions"}
          bullets={osBullets}
          delay={1.8}
        />
        <PlatformCard
          platform={PLATFORMS.flow}
          onPick={pick}
          isEs={isEs}
          cta={isEs ? "Ir a automatización" : "Go to automation"}
          bullets={flowBullets}
          delay={1.95}
        />
      </div>

      {/* Closing microcopy */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="mt-8 text-center text-[12px] text-slate-500 leading-relaxed max-w-md mx-auto"
        data-testid="access-closing"
      >
        <p>
          {isEs ? "Entender es el inicio." : "Understanding is the beginning."}
        </p>
        <p>
          {isEs
            ? "Ejecutar es lo que genera resultados."
            : "Executing is what drives results."}
        </p>
        <p className="text-slate-400 font-medium mt-1">
          {isEs
            ? "Así es como tu negocio avanza."
            : "This is how your business moves forward."}
        </p>
      </motion.div>
    </div>
  );
};

export default AccessPickerPanel;
