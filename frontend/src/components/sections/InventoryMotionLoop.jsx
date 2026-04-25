import React from "react";
import { motion } from "framer-motion";
import { Package, Bell, Check, MapPin } from "lucide-react";

/**
 * Inventory motion loop — visualizes the recommendation cycle:
 *
 *   Phase 1 (0.0–0.6s)  alert pulses on destination
 *   Phase 2 (0.6–1.4s)  approve check appears
 *   Phase 3 (1.4–2.7s)  package travels along curved path source → dest
 *   Phase 4 (2.7–3.4s)  source bar drops, dest bar fills, "Resuelto" badge
 *   Phase 5 (3.4–4.5s)  hold + reset
 *
 * Cycle: 4.5s, repeats forever. Pure CSS/SVG/framer-motion (no images).
 */

const CYCLE = 4.5; // seconds

// Bar fill keyframes — framer-motion supports `times` for bezier alignment
const sourceBarFrames = [1, 1, 1, 1, 0.6, 0.6, 1]; // last = reset
const destBarFrames = [0.2, 0.2, 0.2, 0.2, 0.95, 0.95, 0.2];
const barTimes = [0, 0.18, 0.32, 0.55, 0.62, 0.78, 1];

const Pin = ({ label, sublabel, accent, fillFrames, side }) => (
  <div
    className={`flex flex-col items-center gap-2 ${side === "right" ? "items-end" : "items-start"}`}
  >
    {/* Stack bar */}
    <div
      className="relative w-9 h-12 rounded-md overflow-hidden border"
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        borderColor: `${accent}33`,
      }}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ scaleY: fillFrames[0] }}
        animate={{ scaleY: fillFrames }}
        transition={{
          duration: CYCLE,
          times: barTimes,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
          transformOrigin: "bottom",
          height: "100%",
        }}
      />
      {/* Tick marks */}
      {[0.25, 0.5, 0.75].map((t) => (
        <span
          key={t}
          aria-hidden
          className="absolute left-0 right-0 h-px bg-white/[0.08]"
          style={{ bottom: `${t * 100}%` }}
        />
      ))}
    </div>

    {/* Pin */}
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-md"
      style={{
        background: `${accent}10`,
        border: `1px solid ${accent}40`,
      }}
    >
      <MapPin size={10} style={{ color: accent }} />
      <div className="text-left">
        <div className="text-[10px] font-semibold text-white leading-none">{label}</div>
        <div className="text-[9px] text-slate-500 leading-none mt-0.5">{sublabel}</div>
      </div>
    </div>
  </div>
);

export const InventoryMotionLoop = ({ isEs = true }) => {
  return (
    <div
      className="relative rounded-2xl p-5 sm:p-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, rgba(12, 18, 34, 0.92), rgba(5, 10, 24, 0.84))",
        border: "1px solid rgba(0, 245, 255, 0.18)",
        boxShadow: "0 24px 60px -24px rgba(0, 245, 255, 0.35)",
      }}
      data-testid="inventory-motion-loop"
    >
      {/* Header strip — phase 1 alert + phase 2 approve */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <motion.span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full"
            initial={{ scale: 1, backgroundColor: "rgba(244, 63, 94, 0.12)" }}
            animate={{
              scale: [1, 1.15, 1, 1, 1, 1],
              backgroundColor: [
                "rgba(244, 63, 94, 0.12)",
                "rgba(244, 63, 94, 0.28)",
                "rgba(244, 63, 94, 0.12)",
                "rgba(0, 245, 255, 0.12)",
                "rgba(0, 245, 255, 0.12)",
                "rgba(244, 63, 94, 0.12)",
              ],
            }}
            transition={{
              duration: CYCLE,
              times: [0, 0.07, 0.14, 0.32, 0.85, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ border: "1px solid rgba(244, 63, 94, 0.4)" }}
            data-testid="motion-alert-icon"
          >
            <Bell size={12} className="text-rose-300" />
          </motion.span>
          <div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-500">
              {isEs ? "Sistema en vivo" : "Live system"}
            </div>
            <motion.div
              className="text-[12px] font-semibold leading-tight"
              animate={{
                color: [
                  "#FCA5A5",
                  "#FCA5A5",
                  "#FCA5A5",
                  "#7FF5FF",
                  "#7FF5FF",
                  "#FCA5A5",
                ],
              }}
              transition={{
                duration: CYCLE,
                times: [0, 0.18, 0.32, 0.4, 0.85, 1],
                repeat: Infinity,
              }}
            >
              <motion.span
                animate={{
                  opacity: [1, 1, 0, 0, 0, 1],
                }}
                transition={{
                  duration: CYCLE,
                  times: [0, 0.28, 0.32, 0.85, 0.95, 1],
                  repeat: Infinity,
                }}
                style={{ display: "inline-block" }}
              >
                {isEs ? "Faltante detectado" : "Stock-out detected"}
              </motion.span>
              <motion.span
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0, 0],
                }}
                transition={{
                  duration: CYCLE,
                  times: [0, 0.32, 0.4, 0.85, 0.95, 1],
                  repeat: Infinity,
                }}
              >
                {isEs ? "Movimiento aprobado" : "Move approved"}
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Approve check badge */}
        <motion.span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0, 1, 1, 0, 0],
            scale: [0.8, 0.8, 1, 1, 0.9, 0.8],
          }}
          transition={{
            duration: CYCLE,
            times: [0, 0.3, 0.38, 0.85, 0.95, 1],
            repeat: Infinity,
          }}
          style={{
            background: "rgba(34, 211, 238, 0.12)",
            border: "1px solid rgba(34, 211, 238, 0.4)",
            color: "#7FF5FF",
          }}
          data-testid="motion-approve-badge"
        >
          <Check size={10} /> {isEs ? "Aprobado" : "Approved"}
        </motion.span>
      </div>

      {/* Map area: 2 pins with curved path between them */}
      <div className="relative h-[120px] sm:h-[140px]">
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Pin
            label={isEs ? "Bodega Central" : "Central Warehouse"}
            sublabel={isEs ? "Origen" : "Source"}
            accent="#94A3B8"
            fillFrames={sourceBarFrames}
            side="left"
          />
          <Pin
            label={isEs ? "Tienda CDMX" : "CDMX Store"}
            sublabel={isEs ? "Destino" : "Destination"}
            accent="#00F5FF"
            fillFrames={destBarFrames}
            side="right"
          />
        </div>

        {/* SVG path + animated package */}
        <svg
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          aria-hidden="true"
        >
          {/* Background dotted curve */}
          <path
            d="M 60 60 Q 200 0 340 60"
            stroke="rgba(148, 163, 184, 0.18)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            fill="none"
          />
          {/* Active progress path that fills as package travels */}
          <motion.path
            d="M 60 60 Q 200 0 340 60"
            stroke="#00F5FF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 0, 0, 1, 1, 0],
              opacity: [0, 0, 0.9, 0.9, 0.4, 0],
            }}
            transition={{
              duration: CYCLE,
              times: [0, 0.32, 0.36, 0.62, 0.85, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 4px rgba(0,245,255,0.6))",
            }}
          />

          {/* Traveling package — uses motion path technique */}
          <motion.g
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "0%", "0%", "100%", "100%", "0%"],
              opacity: [0, 0, 1, 1, 0, 0],
            }}
            transition={{
              duration: CYCLE,
              times: [0, 0.32, 0.38, 0.62, 0.7, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              offsetPath: "path('M 60 60 Q 200 0 340 60')",
              offsetRotate: "0deg",
            }}
          >
            <circle cx="0" cy="0" r="14" fill="rgba(0, 245, 255, 0.18)" />
            <circle cx="0" cy="0" r="9" fill="#00F5FF" />
            <foreignObject x="-7" y="-7" width="14" height="14">
              <div className="flex items-center justify-center w-full h-full">
                <Package size={11} color="#0A0F1C" strokeWidth={2.5} />
              </div>
            </foreignObject>
          </motion.g>
        </svg>

        {/* Floating "25 units" label — appears mid-travel */}
        <motion.div
          className="absolute left-1/2 top-2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold"
          initial={{ opacity: 0, y: 4 }}
          animate={{
            opacity: [0, 0, 1, 1, 0, 0],
            y: [4, 4, 0, 0, 4, 4],
          }}
          transition={{
            duration: CYCLE,
            times: [0, 0.36, 0.44, 0.6, 0.7, 1],
            repeat: Infinity,
          }}
          style={{
            background: "rgba(0, 245, 255, 0.12)",
            border: "1px solid rgba(0, 245, 255, 0.4)",
            color: "#7FF5FF",
          }}
          data-testid="motion-units-label"
        >
          25 {isEs ? "unidades" : "units"}
        </motion.div>
      </div>

      {/* Bottom strip — "Resuelto" final state */}
      <div className="mt-5 flex items-center justify-between">
        <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500">
          {isEs ? "Movimiento" : "Transfer"}
        </div>
        <motion.div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: [0, 0, 0, 0, 1, 1, 0],
            scale: [0.9, 0.9, 0.9, 0.9, 1, 1, 0.9],
          }}
          transition={{
            duration: CYCLE,
            times: [0, 0.18, 0.4, 0.62, 0.7, 0.88, 1],
            repeat: Infinity,
          }}
          style={{
            background: "rgba(34, 197, 94, 0.12)",
            border: "1px solid rgba(34, 197, 94, 0.4)",
            color: "#86EFAC",
          }}
          data-testid="motion-resolved-badge"
        >
          <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
          {isEs ? "Resuelto" : "Resolved"}
        </motion.div>
      </div>
    </div>
  );
};

export default InventoryMotionLoop;
