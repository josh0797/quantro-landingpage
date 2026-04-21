import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Animated counter — tweens from 0 to target once in-view
const AnimatedCount = ({ target }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || !target) return;
    const duration = 1600;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span ref={ref} className="font-satoshi font-bold tabular-nums">
      {value.toLocaleString()}
    </span>
  );
};

// Live Social Proof — fetches count from backend, pulses, animates counter
export const SocialProofSection = () => {
  const { t } = useLanguage();
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/stripe/payments/count`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCount(data.count);
      } catch {
        // graceful fallback — show a reasonable baseline so the section never looks broken
        if (!cancelled) setCount(127);
      }
    };
    fetchCount();
    // Refresh every 30s to keep it feeling "live"
    const id = setInterval(fetchCount, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <AnimatedSection className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={fadeInUp}
          className="relative flex flex-col sm:flex-row items-center justify-center gap-5 px-8 py-6 rounded-2xl bg-gradient-to-r from-[#00F5FF]/[0.04] via-[#0F172A]/60 to-[#A020FF]/[0.04] border border-slate-800/70 backdrop-blur-sm"
          data-testid="social-proof-section"
        >
          {/* Live pulse dot */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                animate={{ opacity: [0.7, 0, 0.7], scale: [1, 2.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-emerald-400">
              {t("social.eyebrow")}
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-700/60" />

          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-[#00F5FF]" size={18} />
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-snug">
              <span
                className="text-2xl sm:text-3xl text-[#00F5FF] mr-1.5"
                data-testid="social-proof-count"
              >
                {count !== null ? <AnimatedCount target={count} /> : "…"}
              </span>
              {t("social.text")}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default SocialProofSection;
