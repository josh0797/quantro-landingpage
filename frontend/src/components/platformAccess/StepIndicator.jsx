import React, { useMemo } from "react";

/**
 * Step indicator for the platform access flow.
 * 4 phases: Plataforma · Acceso · Plan · Listo
 */
export const StepIndicator = ({ step, isEs }) => {
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

export default StepIndicator;
