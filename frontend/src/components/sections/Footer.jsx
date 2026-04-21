import React from "react";

// Footer
export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-slate-800" data-testid="footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#0A0F1C] border border-[#00F5FF]/30 flex items-center justify-center">
            <span className="font-satoshi font-bold text-sm text-[#00F5FF]">Q</span>
          </div>
          <span className="text-lg font-medium text-white">Quantro</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">
            Privacidad
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Términos
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contacto
          </a>
        </div>

        <div className="text-sm text-slate-600">
          © 2026 Quantro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
