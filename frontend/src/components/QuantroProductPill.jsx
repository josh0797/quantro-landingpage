import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { trackCTAClick } from "../lib/analytics";

/**
 * QuantroProductPill — Apple-style sticky product navigation.
 *
 * Mirrors the floating pill Apple uses on iPhone product pages:
 *   • Hidden on the hero, slides in once the visitor scrolls past it.
 *   • Centered, dark glass with backdrop blur and a faint inner border.
 *   • Left: product label "Quantro OS".
 *   • Right: "Explorar" → minimalist dropdown that smooth-scrolls to
 *     each landing section, and "Comenzar" → opens platform access
 *     (registration / sign-in flow).
 *
 * The component is purely presentational; section IDs are pre-existing
 * and `scroll-margin-top` is set globally on `[data-section]` so the
 * destination always lands below the pill.
 */

const SHOW_AFTER_SCROLL_PX = 360; // appears once the user has read the hero

export const QuantroProductPill = () => {
  const { language } = useLanguage();
  const { open: openPlatformAccess } = usePlatformAccess();
  const isEs = language === "es";
  const [visible, setVisible] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const dropdownRef = useRef(null);

  // ── Show / hide on scroll ────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Track the section currently in view (for menu highlight) ─────────
  // Picks whichever target section's top is closest-to-but-still-above
  // the pill (88px scroll-margin). Updates on scroll so opening the
  // dropdown always shows the user's current location.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = [
      "hero",
      "interactive-demo",
      "comparison-summary",
      "success-stories",
      "switch",
      "pricing",
    ];
    const updateActive = () => {
      const y = window.scrollY + 120; // probe just under the pill
      let bestId = "hero";
      let bestTop = -Infinity;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y && top > bestTop) {
          bestTop = top;
          bestId = id;
        }
      });
      setActiveSection(bestId);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  // ── Close dropdown on outside click / escape ─────────────────────────
  useEffect(() => {
    if (!exploreOpen) return;
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setExploreOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [exploreOpen]);

  // ── Document-wide scroll progress (Apple-keynote feel) ───────────────
  // Drives the thin cyan bar at the bottom of the pill: 0% on the hero,
  // 100% when the visitor reaches the footer. Spring-smoothed so the
  // line glides instead of jittering.
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  const items = [
    { id: "interactive-demo", labelEs: "Cómo funciona", labelEn: "How it works" },
    { id: "comparison-summary", labelEs: "Comparación", labelEn: "Comparison" },
    { id: "success-stories", labelEs: "Casos de éxito", labelEn: "Success stories" },
    { id: "switch", labelEs: "Cámbiate a Quantro", labelEn: "Switch to Quantro" },
    { id: "pricing", labelEs: "Precios", labelEn: "Pricing" },
  ];

  const goTo = (id) => {
    trackCTAClick(`pill_explore_${id}`);
    setExploreOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStart = () => {
    trackCTAClick("pill_start");
    openPlatformAccess();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="quantro-pill"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-3 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none"
          data-testid="quantro-product-pill"
        >
          <div className="relative max-w-[1080px] mx-auto pointer-events-auto">
            <div
              className="relative flex items-center justify-between gap-3 sm:gap-6 h-[52px] sm:h-[58px] px-3 sm:px-5 rounded-[22px] backdrop-blur-xl"
              style={{
                background: "rgba(8, 12, 24, 0.62)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                boxShadow:
                  "0 18px 40px -16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
              }}
            >
              {/* ── Left: product label ── */}
              <button
                type="button"
                onClick={() => {
                  trackCTAClick("pill_brand");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 pl-1 pr-2 text-white text-[15px] sm:text-[16px] font-semibold tracking-tight focus:outline-none"
                data-testid="pill-brand"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]"
                  style={{ boxShadow: "0 0 8px rgba(0, 245, 255, 0.85)" }}
                  aria-hidden
                />
                Quantro OS
              </button>

              {/* ── Right: Explorar + Comenzar ── */}
              <div className="flex items-center gap-2 sm:gap-2.5" ref={dropdownRef}>
                {/* Explorar */}
                <button
                  type="button"
                  onClick={() => setExploreOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={exploreOpen}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 h-[36px] rounded-full text-[13px] font-medium text-white/90 hover:text-white transition-all duration-200"
                  style={{
                    background: exploreOpen
                      ? "rgba(255, 255, 255, 0.10)"
                      : "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                  }}
                  data-testid="pill-explore"
                >
                  <span>{isEs ? "Explorar" : "Explore"}</span>
                  <motion.span
                    animate={{ rotate: exploreOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <ChevronDown size={13} strokeWidth={2.4} />
                  </motion.span>
                </button>

                {/* Comenzar — primary CTA */}
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex items-center justify-center px-3.5 sm:px-4 h-[36px] rounded-full text-[13px] font-semibold text-[#031018] transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #00F5FF 0%, #22D3EE 100%)",
                    boxShadow:
                      "0 6px 22px -8px rgba(0, 245, 255, 0.55), inset 0 0 0 1px rgba(0, 245, 255, 0.25)",
                  }}
                  data-testid="pill-start"
                >
                  {isEs ? "Comenzar" : "Get started"}
                </button>
              </div>

              {/* ── Apple keynote progress bar ──
                  Ultra-thin cyan line glued to the pill's bottom edge.
                  `scaleX` is driven by the document scroll spring so it
                  feels like a story unfolding, not a raw scroll meter. */}
              <div
                aria-hidden
                className="absolute left-3 right-3 bottom-[3px] h-[2px] rounded-full overflow-hidden"
                style={{ background: "rgba(255, 255, 255, 0.06)" }}
                data-testid="pill-progress-track"
              >
                <motion.div
                  data-testid="pill-progress-fill"
                  className="h-full origin-left rounded-full"
                  style={{
                    scaleX: progressX,
                    background:
                      "linear-gradient(90deg, rgba(0,245,255,0.85) 0%, #00F5FF 60%, #22D3EE 100%)",
                    boxShadow: "0 0 8px rgba(0, 245, 255, 0.55)",
                  }}
                />
              </div>
            </div>

            {/* ── Explorar dropdown ── */}
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  role="menu"
                  aria-label={isEs ? "Explorar Quantro" : "Explore Quantro"}
                  className="absolute right-2 sm:right-4 mt-2 w-[260px] rounded-2xl overflow-hidden backdrop-blur-xl"
                  style={{
                    background: "rgba(8, 12, 24, 0.92)",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                    boxShadow: "0 24px 60px -20px rgba(0, 0, 0, 0.7)",
                  }}
                  data-testid="pill-explore-menu"
                >
                  <ul className="py-2">
                    {items.map((it) => {
                      const isActive = activeSection === it.id;
                      return (
                        <li key={it.id}>
                          <button
                            type="button"
                            onClick={() => goTo(it.id)}
                            className={`w-full text-left mx-2 my-0.5 px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-200 flex items-center justify-between group ${
                              isActive
                                ? "font-semibold text-[#031018]"
                                : "text-slate-200 hover:text-white hover:bg-white/[0.06]"
                            }`}
                            style={
                              isActive
                                ? {
                                    background:
                                      "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(127,245,255,0.95) 130%)",
                                    width: "calc(100% - 16px)",
                                    boxShadow:
                                      "0 4px 14px -4px rgba(0, 245, 255, 0.35)",
                                  }
                                : { width: "calc(100% - 16px)" }
                            }
                            data-testid={`pill-menu-${it.id}`}
                            data-active={isActive}
                            role="menuitem"
                            aria-current={isActive ? "true" : undefined}
                          >
                            <span>{isEs ? it.labelEs : it.labelEn}</span>
                            <span
                              className={
                                isActive
                                  ? "text-[#031018]"
                                  : "text-slate-600 group-hover:text-[#7FF5FF] transition-colors"
                              }
                            >
                              {isActive ? "•" : "→"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuantroProductPill;
