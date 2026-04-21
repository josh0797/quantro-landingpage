import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { pollCheckoutStatus } from "../lib/stripe";

// Reads ?payment=success|cancel&session_id=... from URL and shows feedback modal.
// On success, polls backend to verify payment_status = "paid" before confirming.
export const PaymentReturnModal = () => {
  const { t } = useLanguage();
  const [state, setState] = useState("hidden"); // hidden | polling | success | cancel | error

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentFlag = params.get("payment");
    const sessionId = params.get("session_id");

    if (paymentFlag === "cancel") {
      setState("cancel");
      return;
    }

    if (paymentFlag === "success" && sessionId) {
      setState("polling");
      pollCheckoutStatus(sessionId, (update) => {
        if (update.state === "paid") setState("success");
        else if (update.state === "error" || update.state === "expired") setState("error");
        else if (update.state === "timeout") setState("error");
      });
    }
  }, []);

  const close = () => {
    setState("hidden");
    // Clean query params so refresh doesn't re-open
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    url.searchParams.delete("session_id");
    window.history.replaceState({}, "", url.toString());
  };

  if (state === "hidden") return null;

  const content = {
    polling: {
      icon: <Loader2 className="text-[#00F5FF] animate-spin" size={32} />,
      title: t("payment.polling"),
      body: "",
      accent: "cyan",
    },
    success: {
      icon: <Check className="text-emerald-400" size={32} />,
      title: t("payment.success.title"),
      body: t("payment.success.body"),
      accent: "emerald",
    },
    cancel: {
      icon: <X className="text-slate-400" size={32} />,
      title: t("payment.cancel.title"),
      body: t("payment.cancel.body"),
      accent: "slate",
    },
    error: {
      icon: <AlertCircle className="text-red-400" size={32} />,
      title: t("payment.error.title"),
      body: t("payment.error.body"),
      accent: "red",
    },
  }[state];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        data-testid="payment-return-modal"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
          className="relative bg-[#0F172A] border border-slate-700/60 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-5">
              {content.icon}
            </div>
            <h3 className="font-satoshi font-bold text-2xl text-white mb-2" data-testid="payment-modal-title">
              {content.title}
            </h3>
            {content.body && (
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{content.body}</p>
            )}
            {state !== "polling" && (
              <button
                onClick={close}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-satoshi font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all"
                data-testid="payment-modal-close"
              >
                {t("payment.close")}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentReturnModal;
