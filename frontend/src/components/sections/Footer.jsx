import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { QuantroLogoMark } from "../QuantroLogoMark";

// Footer with routed legal links
export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="py-12 px-6 border-t border-slate-800" data-testid="footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5" data-testid="footer-logo-home">
          <QuantroLogoMark size={30} />
          <span className="font-satoshi font-semibold text-[17px] text-white tracking-tight leading-none">
            Quantro
          </span>
        </Link>

        <div className="flex items-center gap-8 text-sm text-slate-500">
          <Link
            to="/privacidad"
            className="hover:text-white transition-colors"
            data-testid="footer-link-privacy"
          >
            {t("footer.privacy")}
          </Link>
          <Link
            to="/terminos"
            className="hover:text-white transition-colors"
            data-testid="footer-link-terms"
          >
            {t("footer.terms")}
          </Link>
          <Link
            to="/contacto"
            className="hover:text-white transition-colors"
            data-testid="footer-link-contact"
          >
            {t("footer.contact")}
          </Link>
          <Link
            to="/comparacion"
            className="hover:text-white transition-colors"
            data-testid="footer-link-comparison"
          >
            {language === "es" ? "Comparación" : "Comparison"}
          </Link>
        </div>

        <div className="text-sm text-slate-600">
          © 2026 Quantro. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
