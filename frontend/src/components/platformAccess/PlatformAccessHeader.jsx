import React from "react";
import { Sparkles } from "lucide-react";
import { StepIndicator } from "./StepIndicator";

/**
 * Header for the platform access modal.
 * Renders an eyebrow pill plus, for non-picker stages, the dynamic title,
 * description, and step indicator.
 *
 * The choose_platform stage intentionally hides the H2/p — the
 * AccessPickerPanel ships its own Apple-style narrative.
 */
export const PlatformAccessHeader = ({ stage, authMode, isEs, stepIndex }) => {
  const isPicker = stage === "choose_platform";

  return (
    <div className="mb-7">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/[0.06] mb-4">
        <Sparkles size={11} className="text-[#00F5FF]" />
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#00F5FF]">
          {isEs ? "Acceso a plataforma" : "Platform access"}
        </span>
      </div>

      {!isPicker && (
        <>
          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl text-white leading-tight tracking-tight mb-2">
            {stage === "auth" && authMode === "signup" &&
              (isEs ? "Crea tu cuenta" : "Create your account")}
            {stage === "auth" && authMode !== "signup" &&
              (isEs ? "Inicia sesión para continuar" : "Sign in to continue")}
            {(stage === "choose_plan" || stage === "onboarding") &&
              (isEs ? "Elige tu plan" : "Choose your plan")}
            {stage === "redirect" &&
              (isEs ? "Entrando a tu plataforma…" : "Entering your platform…")}
          </h2>
          <p className="text-[13px] text-slate-400 max-w-[560px]">
            {stage === "auth" && authMode === "signup" &&
              (isEs
                ? "Con tu cuenta obtienes acceso a Quantro OS y Quantro Flow."
                : "Your Quantro account unlocks both Quantro OS and Quantro Flow.")}
            {stage === "auth" && authMode !== "signup" &&
              (isEs
                ? "Tu sesión de Quantro funciona tanto en Quantro OS como en Quantro Flow."
                : "Your Quantro session works on both Quantro OS and Quantro Flow.")}
            {(stage === "choose_plan" || stage === "onboarding") &&
              (isEs
                ? "Prueba cualquier plan con $1 USD. Cancelas cuando quieras."
                : "Try any plan for $1 USD. Cancel anytime.")}
            {stage === "redirect" &&
              (isEs
                ? "Te estamos redirigiendo a tu producto. No cierres esta ventana."
                : "We're sending you to your product. Don't close this window.")}
          </p>
          <div className="mt-4">
            <StepIndicator step={stepIndex} isEs={isEs} />
          </div>
        </>
      )}

      {isPicker && (
        <p className="text-[13px] text-slate-400 max-w-[560px]" data-testid="access-microcopy">
          {isEs
            ? "Selecciona la experiencia que quieres abrir. Cada sistema opera de forma independiente."
            : "Pick the experience you want to open. Each system runs independently."}
        </p>
      )}
    </div>
  );
};

export default PlatformAccessHeader;
