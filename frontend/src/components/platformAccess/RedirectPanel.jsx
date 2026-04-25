import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Loader2, Sparkles } from "lucide-react";

/**
 * Final stage — shown while the modal is auto-redirecting to the chosen
 * platform. Two variants:
 *   - fresh purchase: large welcome with plan label + first name
 *   - generic: minimal "All set / opening …" message
 */
export const RedirectPanel = ({
  isEs,
  isFreshPurchase,
  firstName,
  planLabel,
  platformName,
  redirecting,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 text-center"
      data-testid="platform-access-redirect"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,245,255,0.22), rgba(0,245,255,0.05))",
          border: "1px solid rgba(0,245,255,0.45)",
          boxShadow: "0 0 32px -8px rgba(0,245,255,0.5)",
        }}
      >
        {isFreshPurchase ? (
          <Sparkles size={26} className="text-[#00F5FF]" />
        ) : (
          <ExternalLink size={22} className="text-[#00F5FF]" />
        )}
      </motion.div>

      {isFreshPurchase ? (
        <>
          <div className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#00F5FF] mb-1.5">
            {isEs ? "Pago confirmado" : "Payment confirmed"}
          </div>
          <div className="font-satoshi font-bold text-xl text-white mb-1 leading-tight">
            {isEs
              ? `¡Bienvenido${firstName ? `, ${firstName}` : ""}!`
              : `Welcome${firstName ? `, ${firstName}` : ""}!`}
          </div>
          <div className="text-[12px] text-slate-400 mb-3 max-w-sm">
            {isEs
              ? `Tu plan ${planLabel} está activo. Vamos a ${platformName}.`
              : `Your ${planLabel} plan is active. Let's head to ${platformName}.`}
          </div>
        </>
      ) : (
        <>
          <div className="text-[14px] font-semibold text-white mb-1">
            {isEs ? "Todo listo." : "All set."}
          </div>
          <div className="text-[12px] text-slate-400 mb-3">
            {isEs ? `Entrando a ${platformName}…` : `Opening ${platformName}…`}
          </div>
        </>
      )}

      {redirecting && <Loader2 size={16} className="animate-spin text-[#00F5FF]" />}
    </div>
  );
};

export default RedirectPanel;
