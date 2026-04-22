import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { trackCTAClick } from "../lib/analytics";

const STORAGE_KEY = "quantro_announce_dismissed";

/**
 * Top-of-page announcement strip.
 * Dismissible, persists in localStorage for the rest of the session.
 * Premium, minimal, Linear/Stripe style. Sits above the Navbar.
 */
export const AnnouncementBanner = () => {
  const { language } = useLanguage();
  const { open: openPlatformAccess } = usePlatformAccess();
  const isEs = language === "es";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* storage unavailable — still show */
    }
    // Mount after tiny delay to avoid layout shift on first paint
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const dismiss = (e) => {
    e?.stopPropagation?.();
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* no-op */
    }
  };

  const handleClick = () => {
    trackCTAClick("announcement_banner_click");
    openPlatformAccess();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-[60] overflow-hidden"
          data-testid="announcement-banner"
        >
          <div
            className="relative w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(0, 245, 255, 0.12) 0%, rgba(160, 32, 255, 0.10) 50%, rgba(0, 245, 255, 0.12) 100%)",
              borderBottom: "1px solid rgba(0, 245, 255, 0.18)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Animated shimmer */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClick}
                className="flex items-center gap-2 text-[12px] sm:text-[13px] text-white group"
                data-testid="announcement-cta"
              >
                <Sparkles size={13} className="text-[#00F5FF] flex-shrink-0" />
                <span className="font-medium">
                  {isEs ? (
                    <>
                      <span className="hidden sm:inline">Prueba Quantro por </span>
                      <span className="sm:hidden">Quantro por </span>
                      <span className="font-bold text-[#00F5FF]">$1 USD</span>
                      <span className="hidden sm:inline"> — despierta con decisiones listas y ejecutables.</span>
                      <span className="sm:hidden"> — decisiones listas.</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Try Quantro for </span>
                      <span className="sm:hidden">Quantro for </span>
                      <span className="font-bold text-[#00F5FF]">$1</span>
                      <span className="hidden sm:inline"> — wake up to ready-to-execute decisions.</span>
                      <span className="sm:hidden"> — ready decisions.</span>
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[#00F5FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                  {isEs ? "Empezar" : "Start"}
                  <ArrowRight size={11} />
                </span>
              </button>

              <button
                type="button"
                onClick={dismiss}
                aria-label={isEs ? "Cerrar" : "Dismiss"}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                data-testid="announcement-dismiss"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
