import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useUserBillingState } from "../hooks/useUserBillingState";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { pollCheckoutStatus } from "../lib/stripe";
import { trackCheckoutPaid, trackCheckoutCancelled } from "../lib/analytics";
import { loadIntent, clearIntent } from "../lib/checkoutResume";
import { getPlatformRedirectUrl, PLATFORMS } from "../lib/platformRoutes";

/**
 * Reads ?payment=success|cancel&session_id=... from URL and shows feedback modal.
 * On success:
 *   1. Polls Stripe session until `paid`
 *   2. Updates profiles.plan + billing_cycle directly (RLS scoped to user)
 *   3. Refreshes useUserBillingState so Navbar/Pricing re-render with new plan
 *   4. Resumes the platform-access flow if the user had intent before checkout
 */
export const PaymentReturnModal = () => {
  const { language, t } = useLanguage();
  const isEs = language === "es";
  const { refresh } = useUserBillingState();
  const { open: openPlatformAccess } = usePlatformAccess();
  const [state, setState] = useState("hidden"); // hidden | polling | success | cancel | error
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentFlag = params.get("payment");
    const sessionId = params.get("session_id");

    if (paymentFlag === "cancel") {
      setState("cancel");
      trackCheckoutCancelled({ sessionId });
      return;
    }

    if (paymentFlag === "success" && sessionId) {
      setState("polling");

      pollCheckoutStatus(sessionId, async (update) => {
        if (update.state === "paid") {
          const amount = update.data?.amount_total
            ? update.data.amount_total / 100
            : 1.0;
          const currency = update.data?.currency || "usd";
          trackCheckoutPaid({ sessionId, amount, currency });

          // Backend has already synced profiles.plan via service-role key
          // (see /api/stripe/checkout-status — server-side sync). We only need
          // to pull the fresh profile into the client hook.
          try {
            await refresh();
          } catch {
            /* non-fatal */
          }

          const intent = loadIntent();
          const url = getPlatformRedirectUrl(intent?.platform);
          setResumeUrl(url || null);

          setState("success");
        } else if (update.state === "error" || update.state === "expired") {
          setState("error");
        } else if (update.state === "timeout") {
          setState("error");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    url.searchParams.delete("session_id");
    window.history.replaceState({}, "", url.toString());
  };

  const close = () => {
    setState("hidden");
    clearUrl();
    clearIntent();
  };

  const continueToPlatform = () => {
    const intent = loadIntent();
    const url = getPlatformRedirectUrl(intent?.platform);
    clearIntent();
    clearUrl();
    if (url) {
      window.location.href = url;
    } else {
      setState("hidden");
      openPlatformAccess();
    }
  };

  if (state === "hidden") return null;

  const intent = loadIntent();
  const platformName = intent?.platform ? PLATFORMS[intent.platform]?.name : null;

  const content = {
    polling: {
      icon: <Loader2 className="text-[#00F5FF] animate-spin" size={32} />,
      title: t("payment.polling"),
      body: "",
    },
    success: {
      icon: <Check className="text-emerald-400" size={32} />,
      title: t("payment.success.title"),
      body: t("payment.success.body"),
    },
    cancel: {
      icon: <X className="text-slate-400" size={32} />,
      title: t("payment.cancel.title"),
      body: t("payment.cancel.body"),
    },
    error: {
      icon: <AlertCircle className="text-red-400" size={32} />,
      title: t("payment.error.title"),
      body: t("payment.error.body"),
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
            <h3
              className="font-satoshi font-bold text-2xl text-white mb-2"
              data-testid="payment-modal-title"
            >
              {content.title}
            </h3>
            {content.body && (
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{content.body}</p>
            )}

            {state === "success" && platformName && (
              <p className="text-[12px] text-slate-500 mb-5">
                {isEs
                  ? `Continuarás en ${platformName}.`
                  : `You'll continue in ${platformName}.`}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {state === "success" && resumeUrl ? (
                <>
                  <button
                    onClick={continueToPlatform}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-satoshi font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all"
                    data-testid="payment-modal-continue"
                  >
                    {isEs ? `Continuar a ${platformName}` : `Continue to ${platformName}`}
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={close}
                    className="flex-1 px-6 py-2.5 border border-slate-700 text-slate-300 font-medium text-sm rounded-xl hover:bg-slate-800/40 transition-all"
                    data-testid="payment-modal-close"
                  >
                    {isEs ? "Cerrar" : "Close"}
                  </button>
                </>
              ) : state !== "polling" ? (
                <button
                  onClick={close}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-satoshi font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all"
                  data-testid="payment-modal-close"
                >
                  {t("payment.close")}
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentReturnModal;
