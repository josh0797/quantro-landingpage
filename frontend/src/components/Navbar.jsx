import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useUserBillingState, getCTAForState } from "../hooks/useUserBillingState";
import { trackCTAClick, trackCheckoutStarted } from "../lib/analytics";
import { startStripeCheckout } from "../lib/stripe";
import LanguageSwitcher from "./LanguageSwitcher";
import { QuantroLogoMark } from "./QuantroLogoMark";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const { language, t } = useLanguage();
  const billingState = useUserBillingState();
  const cta = getCTAForState(billingState, language, { source: "navbar" });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleCTA = async (sourceSuffix = "") => {
    if (loadingCheckout) return;
    const source = sourceSuffix ? `${cta.source}_${sourceSuffix}` : cta.source;
    trackCTAClick(source);

    if (cta.type === "app") {
      window.open(cta.href, "_blank", "noopener,noreferrer");
      setMobileMenuOpen(false);
      return;
    }

    // stripe OR billing (both go to the $1 checkout until customer portal exists)
    trackCheckoutStarted({ packageId: "trial_1usd", source });
    setLoadingCheckout(true);
    try {
      await startStripeCheckout({ packageId: "trial_1usd" });
    } catch (err) {
      console.error("Stripe checkout failed:", err);
      setLoadingCheckout(false);
    }
  };

  // Visual variant of the CTA button
  const ctaClasses =
    cta.variant === "warning"
      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#0A0F1C] hover:shadow-lg hover:shadow-amber-400/25"
      : "bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#00F5FF]/20";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-3" : "py-5"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5" data-testid="logo">
          <QuantroLogoMark size={32} />
          <span className="font-satoshi font-semibold text-[17px] text-white tracking-tight leading-none">
            Quantro
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("solution")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-solution"
          >
            {language === "es" ? "Solución" : "Solution"}
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-features"
          >
            {language === "es" ? "Características" : "Features"}
          </button>
          <button
            onClick={() => scrollToSection("interactive-demo")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-product"
          >
            {language === "es" ? "Producto" : "Product"}
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-pricing"
          >
            {language === "es" ? "Precios" : "Pricing"}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => handleCTA()}
            disabled={loadingCheckout}
            data-testid="nav-cta"
            data-cta-state={billingState}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-all disabled:opacity-70 disabled:cursor-wait ${ctaClasses}`}
          >
            {loadingCheckout ? t("payment.processing") : cta.label}
          </button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("solution")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                {language === "es" ? "Solución" : "Solution"}
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                {language === "es" ? "Características" : "Features"}
              </button>
              <button
                onClick={() => scrollToSection("interactive-demo")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                {language === "es" ? "Producto" : "Product"}
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                {language === "es" ? "Precios" : "Pricing"}
              </button>
              <div className="pt-2 flex justify-center">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => handleCTA("mobile")}
                disabled={loadingCheckout}
                data-testid="mobile-cta"
                data-cta-state={billingState}
                className={`px-4 py-3 font-medium text-sm rounded-lg w-full mt-2 disabled:opacity-70 disabled:cursor-wait ${ctaClasses}`}
              >
                {loadingCheckout ? t("payment.processing") : cta.label}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
