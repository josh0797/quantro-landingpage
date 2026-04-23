import React, { useState } from "react";
import { Settings, CreditCard, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useLanguage } from "../hooks/useLanguage";
import { getUserInitials } from "../lib/userIdentity";
import { trackCTAClick } from "../lib/analytics";
import { supabase } from "../lib/supabase";
import { PLATFORMS } from "../lib/platformRoutes";

/**
 * Account avatar button that opens a small popover with:
 *   • Header — initials + full_name + email
 *   • Active plan badge (+ billing cycle)
 *   • Actions dropdown — Settings / Billing / Logout
 *
 * Avatar is a SEPARATE tap target from "Ver mi plan".
 */

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-[11px]",
  md: "w-9 h-9 text-[12px]",
};

const PLAN_LABELS = {
  essential: { es: "Essential", en: "Essential" },
  pro: { es: "Pro", en: "Pro" },
  enterprise: { es: "Enterprise", en: "Enterprise" },
};

const CYCLE_LABELS = {
  monthly: { es: "mensual", en: "monthly" },
  annual: { es: "anual", en: "annual" },
};

export const UserAvatarPopover = ({
  user,
  profile,
  size = "sm",
  onChangePlan,
  onSignOut,
  source = "navbar",
  align = "end",
}) => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [open, setOpen] = useState(false);

  const initials = getUserInitials(user, profile);
  const email = profile?.email || user?.email || "";
  const fullName = profile?.full_name || null;
  const plan = profile?.plan || null;
  const cycle = profile?.billing_cycle || null;

  if (!initials) return null;

  const planLabel = plan
    ? (PLAN_LABELS[plan]?.[language] ?? plan)
    : isEs
    ? "Sin plan activo"
    : "No active plan";
  const cycleLabel = cycle ? CYCLE_LABELS[cycle]?.[language] ?? cycle : null;

  const closeWith = (fn) => () => {
    setOpen(false);
    // Defer to let popover animate out first
    setTimeout(() => {
      try {
        fn?.();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[UserAvatarPopover] action error:", err?.message || err);
      }
    }, 80);
  };

  const handleBilling = closeWith(() => {
    trackCTAClick(`${source}_avatar_billing`);
    if (typeof onChangePlan === "function") {
      onChangePlan();
    } else {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  const handleSettings = closeWith(() => {
    trackCTAClick(`${source}_avatar_settings`);
    // Open Quantro OS where user settings live
    const url = PLATFORMS?.os?.url;
    if (url && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  });

  const handleSignOut = closeWith(async () => {
    trackCTAClick(`${source}_avatar_sign_out`);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("signOut failed:", err?.message || err);
    }
    if (typeof onSignOut === "function") onSignOut();
  });

  const handleOpenChange = (next) => {
    if (next) trackCTAClick(`${source}_avatar_open`);
    setOpen(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-testid={`${source}-user-avatar`}
          aria-label={fullName || email || "account"}
          className={`inline-flex items-center justify-center ${SIZE_CLASSES[size] || SIZE_CLASSES.sm} rounded-full bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-bold tracking-wide ring-2 ring-white/10 hover:ring-white/30 hover:shadow-[0_0_0_4px_rgba(0,245,255,0.08)] focus:outline-none focus:ring-2 focus:ring-[#00F5FF]/60 transition-all`}
        >
          {initials}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={10}
        className="w-72 bg-[#0B1220] border-white/10 text-white shadow-xl shadow-black/40 p-0 overflow-hidden"
        data-testid={`${source}-user-avatar-popover`}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-white/5 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[13px] font-bold">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            {fullName ? (
              <p className="text-[13px] font-semibold text-white truncate leading-tight">
                {fullName}
              </p>
            ) : null}
            <p
              className={`text-[11px] text-slate-400 truncate leading-tight ${
                fullName ? "mt-0.5" : ""
              }`}
              data-testid={`${source}-avatar-email`}
            >
              {email}
            </p>
          </div>
        </div>

        {/* Plan row */}
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-1.5">
            {isEs ? "Plan activo" : "Active plan"}
          </p>
          <div className="flex items-center gap-2" data-testid={`${source}-avatar-plan`}>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                plan
                  ? "bg-[#00F5FF]/10 text-[#7FF5FF] border border-[#00F5FF]/20"
                  : "bg-white/5 text-slate-400 border border-white/10"
              }`}
            >
              {plan && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.6)]" />
              )}
              {planLabel}
            </span>
            {cycleLabel && (
              <span className="text-[11px] text-slate-500">· {cycleLabel}</span>
            )}
          </div>
        </div>

        {/* Actions dropdown */}
        <div className="py-1" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={handleSettings}
            data-testid={`${source}-avatar-settings`}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-slate-200 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            <Settings size={14} className="text-slate-400" />
            <span className="flex-1 text-left">
              {isEs ? "Ajustes" : "Settings"}
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleBilling}
            data-testid={`${source}-avatar-billing`}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-slate-200 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            <CreditCard size={14} className="text-slate-400" />
            <span className="flex-1 text-left">
              {isEs ? "Pagar" : "Billing"}
            </span>
          </button>
          <div className="h-px bg-white/5 mx-3 my-1" />
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            data-testid={`${source}-avatar-sign-out`}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-rose-300 hover:bg-rose-500/[0.06] hover:text-rose-200 transition-colors"
          >
            <LogOut size={14} />
            <span className="flex-1 text-left">
              {isEs ? "Salir" : "Sign out"}
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatarPopover;
