import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useLanguage } from "../hooks/useLanguage";
import { getUserInitials } from "../lib/userIdentity";
import { trackCTAClick } from "../lib/analytics";

/**
 * Account avatar button that opens a small popover with:
 *   • Full name (when available) + initials
 *   • Email
 *   • Active plan badge (+ billing cycle)
 *   • "Cambiar plan" link that scrolls to #pricing
 *
 * Fully self-contained. The parent Navbar passes user + profile and handlers.
 * The avatar is a separate clickable element — it is NOT nested inside the
 * "Ver mi plan" CTA, so tapping initials vs the CTA are two distinct actions.
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

  const handleChangePlan = () => {
    trackCTAClick(`${source}_avatar_change_plan`);
    setOpen(false);
    if (typeof onChangePlan === "function") {
      onChangePlan();
    } else {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  };

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

        <button
          type="button"
          onClick={handleChangePlan}
          data-testid={`${source}-avatar-change-plan`}
          className="w-full text-left px-4 py-3 text-[12px] font-medium text-[#00F5FF] hover:bg-white/[0.04] hover:text-[#7FF5FF] transition-colors flex items-center justify-between"
        >
          <span>{isEs ? "Cambiar plan" : "Change plan"}</span>
          <span aria-hidden="true" className="text-[#00F5FF]/60">
            →
          </span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatarPopover;
