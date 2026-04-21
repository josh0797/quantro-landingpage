import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";
import { trackCTAClick, trackCheckoutStarted } from "../../lib/analytics";
import { startStripeCheckout } from "../../lib/stripe";
import HeroDashboardPreview from "../HeroDashboardPreview";

// Hero Section - Premium Apple/Stripe Style
export const HeroSection = () => {
  const { language, t } = useLanguage();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const companies =
    language === "es"
      ? ["Grupo Nexo", "AuroMex Alimentos", "TechBuild MX"]
      : ["Grupo Nexo", "AuroMex Foods", "TechBuild MX"];

  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0A0F1C 0%, #030712 100%)" }}
      data-testid="hero-section"
    >
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#00F5FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A020FF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="order-1">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]" />
                Quantro OS · Powered by AOS
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-satoshi font-bold text-[32px] sm:text-[44px] lg:text-[56px] xl:text-[64px] leading-[1.1] tracking-tight text-white mb-4"
              data-testid="hero-headline"
            >
              {language === "es" ? (
                <>
                  Despierta con{" "}
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                    decisiones listas
                  </span>{" "}
                  para actuar.
                </>
              ) : (
                <>
                  Wake up with{" "}
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                    ready decisions
                  </span>{" "}
                  to act.
                </>
              )}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed mb-6 max-w-xl"
              data-testid="hero-subheadline"
            >
              {language === "es"
                ? "Quantro OS conecta tus datos, detecta oportunidades y te propone acciones claras — y con Quantro Flow, las ejecuta por ti."
                : "Quantro OS connects your data, detects opportunities and proposes clear actions — and with Quantro Flow, executes them for you."}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <button
                onClick={async () => {
                  if (loadingCheckout) return;
                  trackCTAClick("hero_start_stripe");
                  trackCheckoutStarted({ packageId: "trial_1usd", source: "hero_cta" });
                  setLoadingCheckout(true);
                  try {
                    await startStripeCheckout({ packageId: "trial_1usd" });
                  } catch (err) {
                    console.error("Stripe checkout failed:", err);
                    setLoadingCheckout(false);
                  }
                }}
                disabled={loadingCheckout}
                className="px-6 py-3.5 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-satoshi font-bold text-base rounded-xl hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-wait"
                data-testid="hero-cta-primary"
              >
                {loadingCheckout
                  ? t("payment.processing")
                  : language === "es"
                  ? "Empieza por $1 USD"
                  : "Start for $1 USD"}
              </button>
              <button
                onClick={() => scrollToSection("interactive-demo")}
                className="px-6 py-3.5 border border-slate-600 text-white font-medium text-base rounded-xl hover:border-slate-500 hover:bg-slate-800/30 transition-all duration-200"
                data-testid="hero-cta-secondary"
              >
                {language === "es" ? "Ver cómo funciona" : "See how it works"}
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-2 text-sm mb-4"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-[#FACC15]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-500">
                {language === "es"
                  ? `Empresas como ${companies.join(", ")} ya operan con Quantro.`
                  : `Companies like ${companies.join(", ")} already run on Quantro.`}
              </span>
            </motion.div>

            {/* PDF download — Quantro OS Overview */}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              href="/assets/quantro-os-overview.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick("hero_pdf_overview")}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-[#00F5FF] transition-colors group"
              data-testid="hero-pdf-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
              <span>{language === "es" ? "Descarga el Quantro OS Overview (PDF)" : "Download the Quantro OS Overview (PDF)"}</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </motion.a>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="order-2 lg:order-2">
            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
