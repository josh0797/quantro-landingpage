import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// Animated big number — tweens once when the slide is visible
const BigMetric = ({ value, label }) => {
  // Parse numeric portion for tweening (e.g. "+40%" → 40, "4x" → 4, "30%" → 30)
  const match = value.match(/(\d+(?:\.\d+)?)/);
  const numeric = match ? parseFloat(match[1]) : null;
  const prefix = value.substring(0, match?.index || 0);
  const suffix = match ? value.substring(match.index + match[1].length) : "";
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (numeric === null) return;
    const duration = 1200;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // Keep one decimal if source had one
      const showVal = Number.isInteger(numeric)
        ? Math.round(eased * numeric)
        : (eased * numeric).toFixed(1);
      setDisplay(showVal);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numeric]);

  return (
    <div className="flex items-baseline gap-2">
      <span className="font-satoshi font-bold text-5xl sm:text-6xl bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent tabular-nums">
        {prefix}
        {numeric !== null ? display : value}
        {suffix}
      </span>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
};

export const SuccessStoriesSection = () => {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stories = language === "es"
    ? [
        {
          title: "De caos operativo a control total",
          quote: "Ahora cada lead tiene seguimiento automático y el equipo sabe qué hacer cada día.",
          author: "CEO · Grupo Nexo",
          metric: "+40%",
          metricLabel: "conversión",
        },
        {
          title: "Decisiones más rápidas, sin juntas eternas",
          quote: "Pasamos de analizar datos manualmente a recibir acciones claras cada mañana. Las reuniones se volvieron de 15 minutos.",
          author: "COO · AuroMex Alimentos",
          metric: "4x",
          metricLabel: "más rápido",
        },
        {
          title: "Su operación sigue, incluso cuando no están",
          quote: "Por primera vez siento que mi empresa trabaja para mí, no al revés. Identifiqué que el 30% de mis proyectos consumían el 70% del tiempo y no generaban utilidad.",
          author: "Fundador · TechBuild MX",
          metric: "30%",
          metricLabel: "ahorro de tiempo",
        },
      ]
    : [
        {
          title: "From operational chaos to total control",
          quote: "Every lead now has automated follow-up and the team knows what to do each day.",
          author: "CEO · Grupo Nexo",
          metric: "+40%",
          metricLabel: "conversion",
        },
        {
          title: "Faster decisions, no endless meetings",
          quote: "We went from analyzing data manually to receiving clear actions every morning. Meetings became 15 minutes long.",
          author: "COO · AuroMex Foods",
          metric: "4x",
          metricLabel: "faster",
        },
        {
          title: "Operations keep running, even when they're not",
          quote: "For the first time I feel my company works for me, not the other way around. I discovered 30% of my projects consumed 70% of the time without generating profit.",
          author: "Founder · TechBuild MX",
          metric: "30%",
          metricLabel: "time saved",
        },
      ];

  const goTo = useCallback((i) => setIndex((i + stories.length) % stories.length), [stories.length]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  // Auto-advance every 7s, paused on hover
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % stories.length);
    }, 7000);
    return () => clearInterval(id);
  }, [isPaused, stories.length]);

  const current = stories[index];

  return (
    <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-[#0A0F1C]/50 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {language === "es" ? "Casos de éxito" : "Success stories"}
          </span>
          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
            {language === "es"
              ? "Lo que ya están logrando nuestros clientes"
              : "What our customers are already achieving"}
          </h2>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          data-testid="testimonial-carousel"
        >
          {/* Slide viewport */}
          <div className="relative bg-gradient-to-br from-[#0F172A]/90 via-[#0A0F1C] to-[#0F172A]/90 border border-slate-800/70 rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[340px]">
            {/* Soft orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00F5FF]/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#A020FF]/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative p-8 sm:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-10 items-start"
                  data-testid={`testimonial-slide-${index}`}
                >
                  {/* Metric column */}
                  <div className="flex md:flex-col items-baseline md:items-start gap-2">
                    <BigMetric value={current.metric} label={current.metricLabel} />
                  </div>

                  {/* Story column */}
                  <div>
                    <Quote className="text-[#00F5FF]/40 mb-4" size={28} />
                    <h3 className="text-xl sm:text-2xl font-satoshi font-semibold text-white leading-snug mb-4">
                      {current.title}
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed mb-5">
                      "{current.quote}"
                    </p>
                    <div className="text-sm text-slate-500 font-medium">
                      — {current.author}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrow controls (hidden on small screens; dots are enough) */}
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/60 items-center justify-center text-slate-300 hover:text-[#00F5FF] hover:border-[#00F5FF]/40 transition-all"
              data-testid="testimonial-prev"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/60 items-center justify-center text-slate-300 hover:text-[#00F5FF] hover:border-[#00F5FF]/40 transition-all"
              data-testid="testimonial-next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dots + progress */}
          <div className="flex items-center justify-center gap-3 mt-6" data-testid="testimonial-dots">
            {stories.map((_, i) => {
              const isActive = i === index;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={isActive}
                  className="relative h-1.5 rounded-full bg-slate-700 overflow-hidden transition-all"
                  style={{ width: isActive ? 40 : 10 }}
                  data-testid={`testimonial-dot-${i}`}
                >
                  {isActive && !isPaused && (
                    <motion.div
                      key={`${i}-${isPaused}`}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 7, ease: "linear" }}
                    />
                  )}
                  {isActive && isPaused && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE]" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default SuccessStoriesSection;
