import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { trackCTAClick, trackCheckoutStarted } from "../lib/analytics";
import { startStripeCheckout } from "../lib/stripe";
import LanguageSwitcher from "./LanguageSwitcher";
import QuantroLogoMark from "./QuantroLogoMark";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const goToStripe = async (source) => {
    if (loadingCheckout) return;
    trackCTAClick(source);
    trackCheckoutStarted({ packageId: "trial_1usd", source });
    setLoadingCheckout(true);
    try {
      await startStripeCheckout({ packageId: "trial_1usd" });
    } catch (err) {
      console.error("Stripe checkout failed:", err);
      setLoadingCheckout(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-3" : "py-5"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3" data-testid="logo">
          <QuantroLogoMark size={40} glow={false} transparent />
          <span className="text-xl font-medium text-white tracking-tight">Quantro</span>
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
            onClick={() => goToStripe("navbar")}
            disabled={loadingCheckout}
            className="px-4 py-2 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-medium text-sm rounded-lg hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all disabled:opacity-70 disabled:cursor-wait"
            data-testid="nav-cta"
          >
            {loadingCheckout ? t("payment.processing") : language === "es" ? "Comenzar" : "Get Started"}
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
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => goToStripe("mobile_menu")}
                disabled={loadingCheckout}
                className="px-4 py-3 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-medium text-sm rounded-lg w-full mt-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {loadingCheckout ? t("payment.processing") : language === "es" ? "Comenzar" : "Get Started"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
