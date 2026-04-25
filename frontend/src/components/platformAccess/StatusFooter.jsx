import React from "react";

/**
 * Footer status strip — auth state on the left, plan state on the right.
 * Hidden while loading.
 */
export const StatusFooter = ({ isEs, isAuthenticated, userEmail, hasPaidPlan, plan }) => (
  <div
    className="mt-8 pt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500"
    style={{ borderTop: "1px solid rgba(148,163,184,0.08)" }}
  >
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <>
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          {isEs ? "Sesión activa" : "Signed in"} ·{" "}
          <span className="text-slate-400">{userEmail}</span>
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
          <span className="text-white font-medium capitalize">{plan}</span>
        </>
      ) : (
        <>
          <span className="w-1 h-1 rounded-full bg-slate-500" />
          {isEs ? "Sin plan activo" : "No active plan"}
        </>
      )}
    </div>
  </div>
);

export default StatusFooter;
