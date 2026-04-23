import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Brain,
  Workflow,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useUserBillingState } from "../hooks/useUserBillingState";
import { useLanguage } from "../hooks/useLanguage";
import { PLATFORMS, getPlatformRedirectUrl, mapTierToPlan } from "../lib/platformRoutes";
import { resolveNextStep } from "../lib/billingGuards";
import { saveIntent, patchIntent, clearIntent, loadIntent } from "../lib/checkoutResume";
import { startStripeCheckout } from "../lib/stripe";
import { trackCTAClick, trackCheckoutStarted } from "../lib/analytics";
import { AUTH_ROUTES, resolveAuthRoute } from "../lib/authRoutes";
import AuthForm from "./auth/AuthForm";

/**
 * Full-screen modal that orchestrates the real production flow:
 *   pick platform → auth → pick plan → redirect
 *
 * Uses Supabase as source of truth via useUserBillingState.
 * Persists the user's intent across the Stripe redirect via checkoutResume.
 */

const OVERLAY_BG =
  "linear-gradient(180deg, rgba(3, 7, 18, 0.85) 0%, rgba(3, 7, 18, 0.95) 100%)";

const PLAN_TIERS = (isEs) => [
  {
    key: "essential",
    plan: "essential",
    name: "Essential",
    price: "$59",
    period: isEs ? "/mes" : "/mo",
    tagline: isEs ? "Deja el caos atrás y gana claridad" : "Leave the chaos behind",
    features: isEs
      ? ["Automatizaciones básicas", "Dashboard esencial", "Agentes IA básicos"]
      : ["Basic automations", "Essential dashboard", "Basic AI agents"],
    highlighted: false,
    accent: "#94A3B8",
  },
  {
    key: "pro",
    plan: "pro",
    name: "Pro",
    price: "$209",
    period: isEs ? "/mes" : "/mo",
    tagline: isEs ? "Escala con inteligencia, no con esfuerzo" : "Scale with intelligence",
    features: isEs
      ? ["Quantro OS + Flow completos", "Quantro Intelligence activo", "Multiusuario · 3 asientos"]
      : ["Full Quantro OS + Flow", "Quantro Intelligence active", "Multi-user · 3 seats"],
    highlighted: true,
    accent: "#00F5FF",
  },
  {
    key: "enterprise",
    plan: "enterprise",
    name: "Enterprise",
    price: "$499",
    period: isEs ? "/mes" : "/mo",
    tagline: isEs
      ? "Automatización y control en su máxima expresión"
      : "Automation and control at their peak",
    features: isEs
      ? ["Todo en Pro", "Quantro Revenue", "Multiusuario · 10 asientos"]
      : ["Everything in Pro", "Quantro Revenue", "Multi-user · 10 seats"],
    highlighted: false,
    accent: "#C084FC",
  },
];

const PlatformCard = ({ platform, onChoose, disabled, isEs, labelOverride }) => {
  const Icon = platform.id === "os" ? Brain : Workflow;
  const isReady = platform.available && platform.url;
  const actualDisabled = disabled || !isReady;

  return (
    <motion.button
      whileHover={actualDisabled ? undefined : { y: -3 }}
      whileTap={actualDisabled ? undefined : { y: 0 }}
      transition={{ duration: 0.2 }}
      type="button"
      onClick={() => !actualDisabled && onChoose(platform.id)}
      disabled={actualDisabled}
      className="relative text-left rounded-2xl p-5 transition-all"
      style={{
        background:
          "linear-gradient(160deg, rgba(12, 18, 34, 0.92), rgba(5, 10, 24, 0.82))",
        border: `1px solid ${platform.accent}3A`,
        boxShadow: actualDisabled
          ? "none"
          : `0 20px 48px -20px ${platform.accent}55, inset 0 1px 0 rgba(255,255,255,0.04)`,
        opacity: actualDisabled ? 0.55 : 1,
        cursor: actualDisabled ? "not-allowed" : "pointer",
      }}
      data-testid={`platform-card-${platform.id}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${platform.accent}2A, ${platform.accent}08)`,
            border: `1px solid ${platform.accent}55`,
          }}
        >
          <Icon size={18} style={{ color: platform.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-bold tracking-[0.2em] uppercase"
              style={{ color: platform.accent }}
            >
              {labelOverride ||
                (!isReady ? (isEs ? "Próximamente" : "Coming soon") : "Core")}
            </span>
          </div>
          <div className="font-satoshi font-bold text-[18px] text-white leading-tight tracking-tight mt-0.5">
            {platform.name}
          </div>
          <div className="text-[12px] text-slate-400 leading-snug mt-1">
            {platform.tagline[isEs ? "es" : "en"]}
          </div>
          <div className="text-[11.5px] text-slate-500 leading-snug mt-2">
            {platform.description[isEs ? "es" : "en"]}
          </div>
        </div>
        {!actualDisabled && (
          <ArrowRight
            size={14}
            className="text-slate-500 flex-shrink-0 mt-1"
            style={{ color: platform.accent }}
          />
        )}
        {!isReady && (
          <Lock size={12} className="text-slate-500 flex-shrink-0 mt-1" />
        )}
      </div>
    </motion.button>
  );
};

const StepIndicator = ({ step, isEs }) => {
  const steps = useMemo(
    () =>
      isEs
        ? ["Plataforma", "Acceso", "Plan", "Listo"]
        : ["Platform", "Access", "Plan", "Ready"],
    [isEs]
  );
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                backgroundColor: active ? "#00F5FF" : done ? "#22D3EE" : "#334155",
                boxShadow: active ? "0 0 8px #00F5FF" : "none",
              }}
            />
            <span
              className={`text-[10px] tracking-wider uppercase ${
                active ? "text-white" : done ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="text-slate-700 mx-1">·</span>}
          </div>
        );
      })}
    </div>
  );
};

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

  // Track the user intent as they progress through the flow
  const [intent, setIntent] = useState(() => loadIntent() || { platform: null });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [stage, setStage] = useState("choose_platform");
  const [authMode, setAuthMode] = useState("login");
  const [autoOpenedForced, setAutoOpenedForced] = useState(false);

  // Detect fresh purchase (plan_updated_at within last 6 minutes) so we can
  // render a personalized welcome instead of a bare "opening…".
  const isFreshPurchase = useMemo(() => {
    if (!profile?.plan_updated_at) return false;
    const age = Date.now() - new Date(profile.plan_updated_at).getTime();
    return Number.isFinite(age) && age >= 0 && age < 6 * 60 * 1000;
  }, [profile?.plan_updated_at]);

  const firstName = useMemo(() => {
    const raw = profile?.company_name || user?.email || "";
    if (!raw) return "";
    if (raw.includes("@")) return raw.split("@")[0].split(/[._-]/)[0];
    return raw.split(" ")[0];
  }, [profile?.company_name, user?.email]);

  const planLabel = useMemo(() => {
    const map = { essential: "Starter", pro: "Pro", enterprise: "Scale" };
    return profile?.plan ? map[profile.plan] || profile.plan : "";
  }, [profile?.plan]);

  const platformName = intent?.platform ? PLATFORMS[intent.platform]?.name : "";

  // Recompute stage whenever the underlying auth/profile/intent changes
  useEffect(() => {
    if (!open) return;
    if (isLoading) return;
    // If the modal was opened with a forced stage (e.g. from /iniciar-sesion),
    // respect it until the user completes that stage.
    if (initial?.stage === "auth" && !session) {
      setStage("auth");
      return;
    }
    const next = resolveNextStep({ session, profile, intent });
    setStage(next);
  }, [open, isLoading, session, profile, intent, initial?.stage]);

  // Sync initial authMode when modal is opened from an auth route
  useEffect(() => {
    if (!open) return;
    if (initial?.authMode === "login" || initial?.authMode === "signup") {
      setAuthMode(initial.authMode);
    }
  }, [open, initial?.authMode]);

  // Push URL when stage becomes 'auth' and current URL isn't already an auth route.
  // Pull URL change → update authMode when location changes underneath.
  useEffect(() => {
    if (!open) return;
    if (stage !== "auth") return;
    const currentMatch = resolveAuthRoute(location.pathname);
    if (currentMatch) {
      // URL is already the auth route; sync authMode from it
      if (currentMatch.mode !== authMode) setAuthMode(currentMatch.mode);
      return;
    }
    // Not on an auth route — push one matching current authMode + language
    const key = authMode === "signup" ? "signUp" : "signIn";
    const target = AUTH_ROUTES[key][language];
    if (target && target !== location.pathname) {
      navigate(target, { replace: false });
    }
  }, [open, stage, authMode, language, location.pathname, navigate]);

  // When user toggles mode inside the form while on an auth route, push the
  // equivalent URL so browser history stays truthful.
  const handleAuthModeChange = (nextMode) => {
    setAuthMode(nextMode);
    const onAuthRoute = resolveAuthRoute(location.pathname);
    if (!onAuthRoute) return;
    const key = nextMode === "signup" ? "signUp" : "signIn";
    const target = AUTH_ROUTES[key][language];
    if (target && target !== location.pathname) {
      navigate(target, { replace: true });
    }
  };

  // When authenticated while the user was on an auth route, leave the auth
  // URL: jump back to the intended location (state.from) or home.
  useEffect(() => {
    if (!open) return;
    if (!session) return;
    const onAuthRoute = resolveAuthRoute(location.pathname);
    if (!onAuthRoute) return;
    const dest = location.state?.from?.pathname || "/";
    navigate(dest, { replace: true });
  }, [open, session, location.pathname, location.state, navigate]);

  // Auto-redirect when we reach 'redirect' stage.
  // Extra delay when it's a fresh purchase so the user can read the welcome.
  useEffect(() => {
    if (!open) return;
    if (stage !== "redirect") return;
    if (!intent?.platform) return;
    const url = getPlatformRedirectUrl(intent.platform);
    if (!url) return;
    setRedirecting(true);
    trackCTAClick(`platform_redirect_${intent.platform}`);
    clearIntent();
    const delay = isFreshPurchase ? 2800 : 700;
    const id = setTimeout(() => {
      window.location.href = url;
    }, delay);
    return () => clearTimeout(id);
  }, [open, stage, intent, isFreshPurchase]);

  // Persist intent changes
  useEffect(() => {
    if (intent && (intent.platform || intent.plan)) {
      saveIntent(intent);
    }
  }, [intent]);

  const choosePlatform = (platformId) => {
    setIntent((prev) => ({ ...prev, platform: platformId }));
  };

  const backToPlatform = () => {
    setIntent((prev) => ({ ...prev, platform: null }));
    clearIntent();
    setStage("choose_platform");
  };

  const handleTierPick = async (tier) => {
    if (!user) return;
    const planCode = tier.plan; // essential | pro | enterprise
    setCheckoutLoading(true);

    const source = `platform_access_${intent.platform}_${tier.key}`;
    trackCTAClick(source);
    trackCheckoutStarted({ packageId: planCode, source });

    patchIntent({ tier: tier.key, plan: planCode, billing_cycle: "monthly" });

    try {
      await startStripeCheckout({
        plan: planCode,
        billingCycle: "monthly",
        email: user.email,
        language,
      });
      // startStripeCheckout redirects; control should not reach here.
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Checkout failed:", err);
      setCheckoutLoading(false);
    }
  };

  const stepIndex = useMemo(() => {
    switch (stage) {
      case "choose_platform":
        return 0;
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
  }, [stage]);

  // After auth succeeds, refresh profile so we re-evaluate stage
  const handleAuthenticated = async () => {
    await refresh();
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
                background:
                  "linear-gradient(180deg, #070D1C 0%, #050A18 100%)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
                boxShadow:
                  "0 40px 80px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 245, 255, 0.04), 0 0 80px -10px rgba(0, 245, 255, 0.15)",
              }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  // If the modal was opened directly via an auth route, leave
                  // the URL (go home) so the user isn't stuck on /iniciar-sesion.
                  if (resolveAuthRoute(location.pathname)) {
                    navigate("/", { replace: true });
                  }
                  onClose();
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-10"
                aria-label={isEs ? "Cerrar" : "Close"}
                data-testid="platform-access-close"
              >
                <X size={18} />
              </button>

              {/* Back (only on auth stage) */}
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
                {/* Header */}
                <div className="mb-7">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/[0.06] mb-4">
                    <Sparkles size={11} className="text-[#00F5FF]" />
                    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#00F5FF]">
                      {isEs ? "Acceso a plataforma" : "Platform access"}
                    </span>
                  </div>
                  <h2 className="font-satoshi font-bold text-3xl sm:text-4xl text-white leading-tight tracking-tight mb-2">
                    {stage === "choose_platform" &&
                      (isEs ? "¿A dónde quieres entrar?" : "Where do you want to go?")}
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
                    {stage === "choose_platform" &&
                      (isEs
                        ? "Elige la plataforma que quieres abrir. Te acompañamos paso a paso si aún no tienes cuenta o plan."
                        : "Pick the platform you want to open. We'll guide you through auth and plan selection if needed.")}
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
                </div>

                {/* Body by stage */}
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
                    <div className="grid sm:grid-cols-2 gap-4">
                      <PlatformCard
                        platform={PLATFORMS.os}
                        onChoose={choosePlatform}
                        isEs={isEs}
                      />
                      <PlatformCard
                        platform={PLATFORMS.flow}
                        onChoose={choosePlatform}
                        isEs={isEs}
                      />
                    </div>
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
                    <div className="grid sm:grid-cols-3 gap-3">
                      {PLAN_TIERS(isEs).map((tier) => (
                        <motion.button
                          key={tier.key}
                          type="button"
                          onClick={() => handleTierPick(tier)}
                          disabled={checkoutLoading}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                          className={`relative rounded-xl p-4 text-left transition-all disabled:opacity-60 ${
                            tier.highlighted ? "ring-1" : ""
                          }`}
                          style={{
                            background:
                              "linear-gradient(160deg, rgba(12,18,34,0.88), rgba(5,10,24,0.78))",
                            border: `1px solid ${tier.accent}${tier.highlighted ? "55" : "28"}`,
                            boxShadow: tier.highlighted
                              ? `0 16px 40px -18px ${tier.accent}88`
                              : "none",
                          }}
                          data-testid={`platform-plan-${tier.plan}`}
                        >
                          {tier.highlighted && (
                            <span
                              className="absolute -top-2 left-4 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase"
                              style={{
                                background:
                                  "linear-gradient(90deg, #00F5FF, #22D3EE)",
                                color: "#0A0F1C",
                              }}
                            >
                              {isEs ? "Recomendado" : "Recommended"}
                            </span>
                          )}
                          <div
                            className="text-[10px] font-semibold tracking-wider uppercase mb-0.5"
                            style={{ color: tier.accent }}
                          >
                            {tier.name}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-snug mb-3">
                            {tier.tagline}
                          </div>
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="font-satoshi font-bold text-2xl text-white tabular-nums">
                              {tier.price}
                            </span>
                            <span className="text-[10px] text-slate-500">{tier.period}</span>
                          </div>
                          <ul className="space-y-1.5 mb-3">
                            {tier.features.map((f) => (
                              <li
                                key={f}
                                className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-snug"
                              >
                                <Check
                                  size={11}
                                  className="flex-shrink-0 mt-0.5"
                                  style={{ color: tier.accent }}
                                />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <div
                            className="text-[11px] font-medium text-center py-1.5 rounded-md"
                            style={{
                              background: tier.highlighted
                                ? "linear-gradient(90deg, #00F5FF, #22D3EE)"
                                : "rgba(148,163,184,0.06)",
                              color: tier.highlighted ? "#0A0F1C" : "#E2E8F0",
                              border: tier.highlighted
                                ? "none"
                                : "1px solid rgba(148,163,184,0.12)",
                            }}
                          >
                            {checkoutLoading ? (
                              <Loader2 size={12} className="animate-spin inline" />
                            ) : isEs ? (
                              "Empezar por $1"
                            ) : (
                              "Start for $1"
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {!isLoading && stage === "onboarding" && (
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
                        onClick={() => setStage("redirect")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[12px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all"
                        data-testid="platform-onboarding-continue"
                      >
                        {isEs ? "Ir a Quantro OS" : "Go to Quantro OS"}{" "}
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}

                  {!isLoading && stage === "redirect" && (
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
                            {isEs
                              ? `Entrando a ${platformName}…`
                              : `Opening ${platformName}…`}
                          </div>
                        </>
                      )}
                      {redirecting && (
                        <Loader2 size={16} className="animate-spin text-[#00F5FF]" />
                      )}
                    </div>
                  )}
                </div>

                {/* Footer — status strip */}
                {!isLoading && (
                  <div
                    className="mt-8 pt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500"
                    style={{ borderTop: "1px solid rgba(148,163,184,0.08)" }}
                  >
                    <div className="flex items-center gap-2">
                      {isAuthenticated ? (
                        <>
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          {isEs ? "Sesión activa" : "Signed in"} ·{" "}
                          <span className="text-slate-400">{user?.email}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          {isEs ? "Sin sesión" : "Not signed in"}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {hasPaidPlan ? (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#00F5FF]" />
                          {isEs ? "Plan" : "Plan"}:{" "}
                          <span className="text-white font-medium capitalize">
                            {profile?.plan}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          {isEs ? "Sin plan activo" : "No active plan"}
                        </>
                      )}
                    </div>
                  </div>
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
