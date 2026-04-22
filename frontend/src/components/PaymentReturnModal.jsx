import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { useUserBillingState } from "../hooks/useUserBillingState";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { trackCheckoutPaid, trackCheckoutCancelled } from "../lib/analytics";
import { loadIntent, clearIntent } from "../lib/checkoutResume";
import { getPlatformRedirectUrl, PLATFORMS } from "../lib/platformRoutes";
import { supabase } from "../lib/supabase";

/**
 * Reads ?checkout=success|cancel from URL and shows feedback modal.
 *
 * Architecture:
 *   Stripe success redirect → /?checkout=success
 *   Supabase Edge Function `stripe-webhook` already updated profiles.plan.
 *   We poll `profiles` from the client (with session auth) until the plan
 *   flips to a paid value, then show the welcome state and resume the
 *   platform-access flow.
 *
 * We never fetch checkout-status from our own backend — Supabase is the
 * single source of truth.
 */

const POLL_INTERVAL_MS = 1500;
const POLL_MAX_ATTEMPTS = 12; // ≈18s total

export const PaymentReturnModal = () => {
  const { language, t } = useLanguage();
  const isEs = language === "es";
  const { refresh, session } = useUserBillingState();
  const { open: openPlatformAccess } = usePlatformAccess();
  const [state, setState] = useState("hidden"); // hidden | polling | success | cancel | error
  const [resumeUrl, setResumeUrl] = useState(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const flag = params.get("checkout") || params.get("payment");

    if (flag === "cancel") {
      startedRef.current = true;
      setState("cancel");
      trackCheckoutCancelled({ sessionId: null });
      return;
    }

    if (flag !== "success") return;

    startedRef.current = true;
    setState("polling");

    let attempts = 0;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      attempts += 1;

      try {
        // Always refresh from Supabase — profiles is the source of truth.
        await refresh();
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        if (!userId) {
          // User session missing — likely signed out or session not restored yet.
          if (attempts < POLL_MAX_ATTEMPTS) {
            setTimeout(poll, POLL_INTERVAL_MS);
          } else {
            setState("error");
          }
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("plan, billing_cycle, stripe_subscription_id")
          .eq("id", userId)
          .maybeSingle();

        if (profile?.plan) {
          trackCheckoutPaid({
            sessionId: null,
            amount: 1.0,
            currency: "usd",
            plan: profile.plan,
          });
          const intent = loadIntent();
          const url = getPlatformRedirectUrl(intent?.platform) || null;
          setResumeUrl(url);
          setState("success");
          return;
        }

        if (attempts < POLL_MAX_ATTEMPTS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          // Webhook didn't finish within the window — show a soft error.
          setState("error");
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[PaymentReturnModal] poll error:", err);
        if (attempts < POLL_MAX_ATTEMPTS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setState("error");
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
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

  const copy = {
    polling: {
      icon: <Loader2 className="text-[#00F5FF] animate-spin" size={32} />,
      title: t("payment.polling"),
      body: isEs
        ? "Sincronizando tu plan con Supabase…"
        : "Syncing your plan with Supabase…",
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
      icon: <AlertCircle className="text-amber-400" size={32} />,
      title: isEs ? "Estamos verificando tu pago" : "We're verifying your payment",
      body: isEs
        ? "Stripe confirmó el cobro pero la sincronización tardó más de lo normal. Recarga en unos segundos o contáctanos."
        : "Stripe confirmed the charge but the sync took longer than usual. Refresh in a few seconds or reach out.",
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
              {copy.icon}
            </div>
            <h3
              className="font-satoshi font-bold text-2xl text-white mb-2"
              data-testid="payment-modal-title"
            >
              {copy.title}
            </h3>
            {copy.body && (
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{copy.body}</p>
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
