import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  X as CloseX,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import { trackCTAClick } from "../../lib/analytics";
import { QuantroLogoMark } from "../QuantroLogoMark";

/**
 * ComparisonSummarySection
 *
 * A high-contrast, two-column summary section that answers the silent
 * question users are asking right before pricing: "how is this different
 * from Ninety / EOS / Notion / Excel?".
 *
 * Left column  — "Otros sistemas" (dim, grey, friction).
 * Right column — "Quantro" (cyan accent, momentum).
 *
 * Ends with a primary CTA that navigates (via React Router) to the full
 * comparison page at /comparacion, which keeps SPA state intact and also
 * scrolls to top on mount (handled inside ComparisonPage).
 */

const rowFade = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const OtherRow = ({ label, i }) => (
  <motion.li
    custom={i}
    variants={rowFade}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-40px" }}
    className="flex items-start gap-3 text-[13.5px] text-slate-400 leading-snug"
    data-testid={`comparison-summary-other-row-${i}`}
  >
    <span className="mt-[3px] w-4 h-4 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
      <CloseX size={10} className="text-slate-500" />
    </span>
    <span>{label}</span>
  </motion.li>
);

const QuantroRow = ({ label, i }) => (
  <motion.li
    custom={i}
    variants={rowFade}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-40px" }}
    className="flex items-start gap-3 text-[13.5px] text-white leading-snug"
    data-testid={`comparison-summary-quantro-row-${i}`}
  >
    <span
      className="mt-[3px] w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: "rgba(0, 245, 255, 0.12)",
        border: "1px solid rgba(0, 245, 255, 0.4)",
        boxShadow: "0 0 10px rgba(0, 245, 255, 0.25)",
      }}
    >
      <Check size={10} className="text-[#7FF5FF]" />
    </span>
    <span>{label}</span>
  </motion.li>
);

export const ComparisonSummarySection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const otherItems = isEs
    ? [
        "Muestran dashboards y reportes que todavía tienes que interpretar.",
        "Trackean objetivos, pero no deciden qué está fuera de rumbo.",
        "Información dispersa entre Excel, CRM, Notion y mil tabs.",
        "Dependen de que alguien revise, analice y actúe cada semana.",
        "Crecen en complejidad a medida que creces tú.",
      ]
    : [
        "They show dashboards and reports — you still have to interpret them.",
        "They track goals, but don't decide what's drifting off course.",
        "Information scattered across Excel, CRM, Notion, and a dozen tabs.",
        "Depend on someone reviewing, analyzing and acting every week.",
        "Grow in complexity as you grow.",
      ];

  const quantroItems = isEs
    ? [
        "Observa tu operación en tiempo real y te dice qué mirar.",
        "Detecta lo que está fuera de lugar antes de que cueste dinero.",
        "Un solo sistema: inventario, personas, finanzas y decisiones.",
        "Llega con la acción lista: tú apruebas, Quantro ejecuta.",
        "Se vuelve más inteligente con cada decisión que tomas.",
      ]
    : [
        "Watches your operation in real time and tells you what to look at.",
        "Spots what's out of place before it costs you money.",
        "One system: inventory, people, finance and decisions.",
        "Arrives with the action ready — you approve, Quantro executes.",
        "Gets smarter with every decision you make.",
      ];

  const handleCTA = (source) => {
    trackCTAClick(`comparison_summary_${source}`);
  };

  const comparisonPath = isEs ? "/comparacion" : "/comparison";

  return (
    <AnimatedSection
      id="comparison-summary"
      className="relative py-28 px-6 overflow-hidden"
      data-testid="comparison-summary-section"
      data-section="comparacion"
      aria-label={isEs ? "Quantro frente a otros sistemas — comparativa resumida" : "Quantro vs other systems — at-a-glance comparison"}
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.05) 0%, transparent 55%), #030712",
      }}
    >
      {/* ES-friendly anchor alias for direct deep-linking / SEO */}
      <span id="comparacion" className="absolute -top-24" aria-hidden />
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 60%, rgba(160, 32, 255, 0.04), transparent 45%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mb-6"
          data-testid="comparison-summary-eyebrow"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.03] text-[10px] font-bold tracking-[0.22em] uppercase text-slate-300">
            <Sparkles size={11} className="text-[#00F5FF]" />
            {isEs ? "Quantro vs otros sistemas" : "Quantro vs other systems"}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-satoshi font-bold text-white text-4xl sm:text-5xl lg:text-6xl text-center leading-[1.05] tracking-tight max-w-4xl mx-auto"
          data-testid="comparison-summary-heading"
        >
          {isEs ? (
            <>
              No es otra herramienta.{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                Es un sistema operativo.
              </span>
            </>
          ) : (
            <>
              It isn't another tool.{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                It's an operating system.
              </span>
            </>
          )}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mt-5"
        >
          {isEs
            ? "La mayoría de los sistemas te muestran información. Quantro decide contigo."
            : "Most systems show you information. Quantro decides with you."}
        </motion.p>

        {/* Two-column comparison */}
        <div
          className="grid md:grid-cols-2 gap-5 mt-14"
          data-testid="comparison-summary-columns"
        >
          {/* Others column */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative rounded-3xl p-7 sm:p-8 border border-white/[0.06] bg-white/[0.015]"
            data-testid="comparison-summary-others-card"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <CloseX size={14} className="text-slate-500" />
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500">
                  {isEs ? "Otros sistemas" : "Other systems"}
                </p>
                <p className="font-satoshi font-semibold text-white/80 text-[17px] leading-tight tracking-tight">
                  {isEs ? "Ninety, EOS, Notion, Excel…" : "Ninety, EOS, Notion, Excel…"}
                </p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {otherItems.map((label, i) => (
                <OtherRow key={i} label={label} i={i} />
              ))}
            </ul>
          </motion.div>

          {/* Quantro column */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative rounded-3xl p-7 sm:p-8 overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(0, 245, 255, 0.06), rgba(14, 22, 40, 0.92))",
              border: "1px solid rgba(0, 245, 255, 0.28)",
              boxShadow: "0 30px 80px -30px rgba(0, 245, 255, 0.35)",
            }}
            data-testid="comparison-summary-quantro-card"
          >
            {/* subtle cyan sheen */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-80"
              style={{
                background:
                  "radial-gradient(ellipse at 80% 0%, rgba(0,245,255,0.08), transparent 55%)",
              }}
            />

            <div className="relative flex items-center gap-2.5 mb-6">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(0, 245, 255, 0.1)",
                  border: "1px solid rgba(0, 245, 255, 0.35)",
                }}
              >
                <QuantroLogoMark size={16} />
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]">
                  Quantro
                </p>
                <p className="font-satoshi font-semibold text-white text-[17px] leading-tight tracking-tight">
                  {isEs ? "Sistema operativo AOS" : "AOS Operating System"}
                </p>
              </div>
            </div>

            <ul className="relative space-y-3.5">
              {quantroItems.map((label, i) => (
                <QuantroRow key={i} label={label} i={i} />
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-14"
          data-testid="comparison-summary-cta-row"
        >
          <Link
            to={comparisonPath}
            onClick={() => handleCTA("primary")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[14px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all"
            data-testid="comparison-summary-cta-primary"
          >
            {isEs ? "Ver comparativa completa" : "See full comparison"}
            <ArrowRight size={15} />
          </Link>

          <p className="text-[12.5px] text-slate-500">
            {isEs
              ? "Incluye Ninety, EOS One, Notion, Excel y más."
              : "Includes Ninety, EOS One, Notion, Excel and more."}
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default ComparisonSummarySection;
