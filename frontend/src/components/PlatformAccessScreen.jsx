import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ArrowLeft, Loader2 } from "lucide-react";
import { useUserBillingState } from "../hooks/useUserBillingState";
import { useLanguage } from "../hooks/useLanguage";
import { getPlatformRedirectUrl, PLATFORMS } from "../lib/platformRoutes";
import { resolveNextStep } from "../lib/billingGuards";
import { saveIntent, patchIntent, clearIntent, loadIntent } from "../lib/checkoutResume";
import { startStripeCheckout } from "../lib/stripe";
import { trackCTAClick, trackCheckoutStarted } from "../lib/analytics";
import { AUTH_ROUTES, resolveAuthRoute, resolvePickerRoute } from "../lib/authRoutes";
import AuthForm from "./auth/AuthForm";
import LanguageSwitcher from "./LanguageSwitcher";
import AccessPickerPanel from "./AccessPickerPanel";
import PlatformAccessHeader from "./platformAccess/PlatformAccessHeader";
import ChoosePlanPanel from "./platformAccess/ChoosePlanPanel";
import OnboardingPanel from "./platformAccess/OnboardingPanel";
import RedirectPanel from "./platformAccess/RedirectPanel";
import StatusFooter from "./platformAccess/StatusFooter";

/**
 * Modal orchestrator for the production access flow.
 *
 * Stages: choose_platform → auth → choose_plan → onboarding → redirect.
 * Each stage's UI lives in its own panel under ./platformAccess/. This file
 * is purely the state machine + URL sync + modal shell.
 *
 * Source of truth: Supabase via useUserBillingState.
 * Intent persistence: localStorage via checkoutResume (survives Stripe).
 */

const OVERLAY_BG =
  "linear-gradient(180deg, rgba(3, 7, 18, 0.85) 0%, rgba(3, 7, 18, 0.95) 100%)";

const FRESH_PURCHASE_WINDOW_MS = 6 * 60 * 1000;
const REDIRECT_DELAY_MS = 700;
const REDIRECT_DELAY_FRESH_MS = 2800;

const stageToStepIndex = (stage) => {
  switch (stage) {
    case "auth":
      return 1;
    case "choose_plan":
    case "onboarding":
      return 2;
    case "redirect":
      return 3;
    default:
      return 0;
  }
};

const deriveFirstName = (profile, user) => {
  const raw = profile?.full_name || profile?.company_name || user?.email || "";
  if (!raw) return "";
  if (raw.includes("@")) return raw.split("@")[0].split(/[._-]/)[0];
  return raw.split(" ")[0];
};

const PLAN_LABEL_MAP = { essential: "Starter", pro: "Pro", enterprise: "Scale" };

export const PlatformAccessScreen = ({ open, onClose, initial = null }) => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const navigate = useNavigate();
  const location = useLocation();
  const {
    session,
    profile,
    user,
    isAuthenticated,
    hasPaidPlan,
    isLoading,
    refresh,
  } = useUserBillingState();

  const [intent, setIntent] = useState(() => loadIntent() || { platform: null });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [stage, setStage] = useState("choose_platform");
  const [authMode, setAuthMode] = useState("login");

  const isFreshPurchase = useMemo(() => {
    if (!profile?.plan_updated_at) return false;
    const age = Date.now() - new Date(profile.plan_updated_at).getTime();
    return Number.isFinite(age) && age >= 0 && age < FRESH_PURCHASE_WINDOW_MS;
  }, [profile?.plan_updated_at]);

  const firstName = useMemo(() => deriveFirstName(profile, user), [profile, user]);
  const planLabel = profile?.plan ? PLAN_LABEL_MAP[profile.plan] || profile.plan : "";
  const platformName = intent?.platform ? PLATFORMS[intent.platform]?.name : "";
  const stepIndex = useMemo(() => stageToStepIndex(stage), [stage]);

  // === Stage machine ============================================
  useEffect(() => {
    if (!open || isLoading) return;
    if (initial?.stage === "auth" && !session) {
      setStage("auth");
      return;
    }
    setStage(resolveNextStep({ session, profile, intent }));
  }, [open, isLoading, session, profile, intent, initial?.stage]);

  // Force initial authMode when modal is opened from an auth route
  useEffect(() => {
    if (!open) return;
    if (initial?.authMode === "login" || initial?.authMode === "signup") {
      setAuthMode(initial.authMode);
    }
  }, [open, initial?.authMode]);

  // === URL ↔ stage sync =========================================
  // Push auth URL when we enter the 'auth' stage and current URL isn't already one.
  useEffect(() => {
    if (!open || stage !== "auth") return;
    const currentMatch = resolveAuthRoute(location.pathname);
    if (currentMatch) {
      if (currentMatch.mode !== authMode) setAuthMode(currentMatch.mode);
      return;
    }
    const key = authMode === "signup" ? "signUp" : "signIn";
    const target = AUTH_ROUTES[key][language];
    if (target && target !== location.pathname) {
      navigate(target, { replace: false });
    }
  }, [open, stage, authMode, language, location.pathname, navigate]);

  // After auth on a routed URL, leave the route → home (or state.from).
  useEffect(() => {
    if (!open || !session) return;
    if (!resolveAuthRoute(location.pathname)) return;
    const dest = location.state?.from?.pathname || "/";
    navigate(dest, { replace: true });
  }, [open, session, location.pathname, location.state, navigate]);

  // === Auto-redirect at 'redirect' stage ========================
  useEffect(() => {
    if (!open || stage !== "redirect" || !intent?.platform) return;
    const url = getPlatformRedirectUrl(intent.platform);
    if (!url) return;
    setRedirecting(true);
    trackCTAClick(`platform_redirect_${intent.platform}`);
    clearIntent();
    const delay = isFreshPurchase ? REDIRECT_DELAY_FRESH_MS : REDIRECT_DELAY_MS;
    const id = setTimeout(() => {
      window.location.href = url;
    }, delay);
    return () => clearTimeout(id);
  }, [open, stage, intent, isFreshPurchase]);

  // Persist intent across reloads / Stripe redirect
  useEffect(() => {
    if (intent && (intent.platform || intent.plan)) saveIntent(intent);
  }, [intent]);

  // === Handlers =================================================
  const choosePlatform = (platformId) => {
    // Pricing-driven flow: keep orchestration (auth → plan → pay).
    if (intent?.tier) {
      setIntent((prev) => ({ ...prev, platform: platformId }));
      return;
    }
    // Direct access: each app handles its own auth — bounce out immediately.
    const url = getPlatformRedirectUrl(platformId);
    if (url) {
      trackCTAClick(`direct_access_${platformId}`);
      window.location.href = url;
    }
  };

  const backToPlatform = () => {
    setIntent((prev) => ({ ...prev, platform: null }));
    clearIntent();
    setStage("choose_platform");
  };

  const handleAuthModeChange = (nextMode) => {
    setAuthMode(nextMode);
    if (!resolveAuthRoute(location.pathname)) return;
    const key = nextMode === "signup" ? "signUp" : "signIn";
    const target = AUTH_ROUTES[key][language];
    if (target && target !== location.pathname) {
      navigate(target, { replace: true });
    }
  };

  const handleAuthenticated = async () => {
    await refresh();
  };

  const handleTierPick = async (tier) => {
    if (!user) return;
    setCheckoutLoading(true);
    const source = `platform_access_${intent.platform}_${tier.key}`;
    trackCTAClick(source);
    trackCheckoutStarted({ packageId: tier.plan, source });
    patchIntent({ tier: tier.key, plan: tier.plan, billing_cycle: "monthly" });
    try {
      await startStripeCheckout({
        plan: tier.plan,
        billingCycle: "monthly",
        email: user.email,
        language,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Checkout failed:", err);
      setCheckoutLoading(false);
    }
  };

  const handleClose = () => {
    if (
      resolveAuthRoute(location.pathname) ||
      resolvePickerRoute(location.pathname)
    ) {
      navigate("/", { replace: true });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] overflow-y-auto"
          style={{ background: OVERLAY_BG, backdropFilter: "blur(10px)" }}
          data-testid="platform-access-screen"
          role="dialog"
          aria-modal="true"
        >
          <div className="min-h-full flex items-start sm:items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[880px] rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #070D1C 0%, #050A18 100%)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
                boxShadow:
                  "0 40px 80px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 245, 255, 0.04), 0 0 80px -10px rgba(0, 245, 255, 0.15)",
              }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-10"
                aria-label={isEs ? "Cerrar" : "Close"}
                data-testid="platform-access-close"
              >
                <X size={18} />
              </button>

              {/* Language switcher (overlay hides the navbar one on auth routes) */}
              <div className="absolute top-3.5 right-14 z-10 scale-[0.85] origin-right">
                <LanguageSwitcher />
              </div>

              {/* Back (auth stage only) */}
              <AnimatePresence>
                {stage === "auth" && (
                  <motion.button
                    key="modal-back"
                    type="button"
                    onClick={backToPlatform}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-10"
                    aria-label={isEs ? "Volver" : "Back"}
                    data-testid="platform-access-back"
                  >
                    <ArrowLeft size={13} />
                    {isEs ? "Volver" : "Back"}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Ambient glow */}
              <div
                aria-hidden
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-[640px] h-[220px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0, 245, 255, 0.18), transparent 70%)",
                  filter: "blur(40px)",
                }}
              />

              <div className="relative p-6 sm:p-10">
                <PlatformAccessHeader
                  stage={stage}
                  authMode={authMode}
                  isEs={isEs}
                  stepIndex={stepIndex}
                />

                <div className="min-h-[280px]">
                  {isLoading && (
                    <div
                      className="flex items-center justify-center py-16 text-slate-500 text-[12px] gap-2"
                      data-testid="platform-access-loading"
                    >
                      <Loader2 size={14} className="animate-spin" />
                      {isEs ? "Cargando sesión…" : "Loading session…"}
                    </div>
                  )}

                  {!isLoading && stage === "choose_platform" && (
                    <AccessPickerPanel isEs={isEs} onPick={choosePlatform} />
                  )}

                  {!isLoading && stage === "auth" && (
                    <AuthForm
                      onBack={backToPlatform}
                      onAuthenticated={handleAuthenticated}
                      hideBackButton
                      initialMode={authMode}
                      onModeChange={handleAuthModeChange}
                    />
                  )}

                  {!isLoading && stage === "choose_plan" && (
                    <ChoosePlanPanel
                      isEs={isEs}
                      onPickTier={handleTierPick}
                      loading={checkoutLoading}
                    />
                  )}

                  {!isLoading && stage === "onboarding" && (
                    <OnboardingPanel
                      isEs={isEs}
                      onContinue={() => setStage("redirect")}
                    />
                  )}

                  {!isLoading && stage === "redirect" && (
                    <RedirectPanel
                      isEs={isEs}
                      isFreshPurchase={isFreshPurchase}
                      firstName={firstName}
                      planLabel={planLabel}
                      platformName={platformName}
                      redirecting={redirecting}
                    />
                  )}
                </div>

                {!isLoading && (
                  <StatusFooter
                    isEs={isEs}
                    isAuthenticated={isAuthenticated}
                    userEmail={user?.email}
                    hasPaidPlan={hasPaidPlan}
                    plan={profile?.plan}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlatformAccessScreen;
