import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useUserBillingState } from "../hooks/useUserBillingState";
import { getCTACopy } from "../lib/billingGuards";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { trackCTAClick } from "../lib/analytics";
import LanguageSwitcher from "./LanguageSwitcher";
import { QuantroLogoMark } from "./QuantroLogoMark";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const { billingState } = useUserBillingState();
  const { open: openPlatformAccess } = usePlatformAccess();
  const ctaLabel = getCTACopy(billingState, language);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleCTA = (source = "navbar") => {
    trackCTAClick(`${source}_open_platform_access`);
    setMobileMenuOpen(false);
    openPlatformAccess();
  };

  const ctaClasses =
    billingState === "expired"
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
            onClick={() => handleCTA("navbar")}
            data-testid="nav-cta"
            data-cta-state={billingState}
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-all ${ctaClasses}`}
          >
            {ctaLabel}
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
                onClick={() => handleCTA("mobile_menu")}
                data-testid="mobile-cta"
                data-cta-state={billingState}
                className={`px-4 py-3 font-medium text-sm rounded-lg w-full mt-2 ${ctaClasses}`}
              >
                {ctaLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
