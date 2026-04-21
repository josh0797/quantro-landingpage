import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

// Footer with routed legal links
export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 px-6 border-t border-slate-800" data-testid="footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2" data-testid="footer-logo-home">
          <div className="w-8 h-8 rounded bg-[#0A0F1C] border border-[#00F5FF]/30 flex items-center justify-center">
            <span className="font-satoshi font-bold text-sm text-[#00F5FF]">Q</span>
          </div>
          <span className="text-lg font-medium text-white">Quantro</span>
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
        </div>

        <div className="text-sm text-slate-600">
          © 2026 Quantro. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
