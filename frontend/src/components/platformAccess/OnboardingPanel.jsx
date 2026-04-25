import React from "react";
import { ArrowRight } from "lucide-react";

/**
 * Onboarding stage — shown after the user has a plan but hasn't completed
 * onboarding inside Quantro OS yet. Just a soft nudge + continue button.
 */
export const OnboardingPanel = ({ isEs, onContinue }) => (
  <div
    className="rounded-xl p-6 text-center"
    style={{
      background: "rgba(148,163,184,0.04)",
      border: "1px solid rgba(148,163,184,0.12)",
    }}
    data-testid="platform-access-onboarding"
  >
    <p className="text-[13px] text-white font-medium mb-2">
      {isEs
        ? "Un paso más: completa tu perfil dentro de Quantro OS."
        : "One more step: complete your profile inside Quantro OS."}
    </p>
    <p className="text-[12px] text-slate-400 mb-4 max-w-md mx-auto">
      {isEs
        ? "Te llevamos directo al onboarding. Puedes regresar a Flow en cualquier momento."
        : "We'll take you straight to onboarding. You can switch to Flow anytime."}
    </p>
    <button
      type="button"
      onClick={onContinue}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[12px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all"
      data-testid="platform-onboarding-continue"
    >
      {isEs ? "Ir a Quantro OS" : "Go to Quantro OS"} <ArrowRight size={12} />
    </button>
  </div>
);

export default OnboardingPanel;
