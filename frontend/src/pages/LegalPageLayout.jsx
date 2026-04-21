import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import QuantroLogoMark from "../components/QuantroLogoMark";

// Shared layout for legal/contact pages — consistent with landing aesthetic
export const LegalPageLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300">
      <div className="noise-overlay" />

      {/* Minimal top bar */}
      <header className="border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" data-testid="legal-back-home">
            <QuantroLogoMark size={32} glow={false} transparent />
            <span className="text-lg font-medium text-white tracking-tight">Quantro</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#00F5FF] transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver al inicio</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-20 relative">
        <div className="mb-12">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#00F5FF] mb-4 block">
            Quantro
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle && <p className="text-lg text-slate-400">{subtitle}</p>}
        </div>

        <article className="prose prose-invert max-w-none">{children}</article>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>© 2026 Quantro. Todos los derechos reservados.</span>
          <div className="flex items-center gap-6">
            <Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalPageLayout;
