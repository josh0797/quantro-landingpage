import React from "react";
import { motion } from "framer-motion";
import {
  PackageSearch,
  PackageX,
  MoveRight,
  ShoppingCart,
  Bell,
  MapPin,
  ArrowDown,
  Moon,
  Sun,
  TrendingDown,
  Sparkles,
  Boxes,
  Zap,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";
import InventoryMotionLoop from "./InventoryMotionLoop";

/**
 * Inventory Intelligence — a feature reveal section for Quantro OS.
 *
 * Apple-keynote narrative:
 *   1) Hero statement  — "Y ahora, tu inventario también piensa contigo."
 *   2) Four capabilities
 *   3) Fulfillment Inteligente — recommendation demo (loss detection → move)
 *   4) Business impact bullets
 *   5) Quantro Intelligence connection ("mientras duermes")
 *   6) Hero closing
 */

const fadeInStagger = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Capability = ({ icon: Icon, title, copy, idx, accent = "#00F5FF" }) => (
  <motion.div
    custom={idx}
    variants={fadeInStagger}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    className="relative rounded-2xl p-5 border border-white/[0.08] bg-white/[0.015] hover:border-white/15 transition-colors"
    data-testid={`inventory-capability-${idx}`}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
      style={{
        background: `linear-gradient(135deg, ${accent}24, ${accent}06)`,
        border: `1px solid ${accent}36`,
      }}
    >
      <Icon size={16} style={{ color: accent }} />
    </div>
    <h3 className="font-satoshi font-semibold text-white text-[15px] leading-tight tracking-tight mb-1.5">
      {title}
    </h3>
    <p className="text-[12.5px] text-slate-400 leading-snug">{copy}</p>
  </motion.div>
);

const ImpactRow = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5 text-[13px] text-slate-300">
    <span className="w-6 h-6 rounded-md bg-[#00F5FF]/10 border border-[#00F5FF]/25 flex items-center justify-center flex-shrink-0">
      <Icon size={12} className="text-[#00F5FF]" />
    </span>
    <span>{label}</span>
  </div>
);

export const InventoryIntelligenceSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  const capabilities = [
    {
      icon: PackageX,
      title: isEs ? "Faltantes de stock" : "Stock-outs",
      copy: isEs
        ? "Los detecta antes de que cuesten una venta."
        : "Detects them before they cost a sale.",
    },
    {
      icon: Boxes,
      title: isEs ? "Exceso de inventario" : "Overstock",
      copy: isEs
        ? "Identifica el capital detenido en tus bodegas."
        : "Identifies capital sitting idle in your warehouses.",
    },
    {
      icon: MoveRight,
      title: isEs ? "Movimientos óptimos" : "Optimal moves",
      copy: isEs
        ? "Recomienda transferencias entre ubicaciones."
        : "Recommends transfers between locations.",
    },
    {
      icon: ShoppingCart,
      title: isEs ? "Compras inteligentes" : "Smart purchases",
      copy: isEs
        ? "Sugiere qué ordenar según la demanda real."
        : "Suggests what to order based on real demand.",
    },
  ];

  return (
    <AnimatedSection
      id="inventory-intelligence"
      className="relative py-28 px-6 overflow-hidden"
      data-testid="inventory-intelligence-section"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.05) 0%, transparent 55%), #030712",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 60%, rgba(0,245,255,0.045), transparent 45%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          variants={fadeInUp}
          className="flex justify-center mb-6"
          data-testid="inventory-eyebrow"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/[0.05] text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]">
            <Sparkles size={11} />
            {isEs ? "Nuevo · Quantro OS" : "New · Quantro OS"}
          </span>
        </motion.div>

        {/* Hero statement */}
        <motion.h2
          variants={fadeInUp}
          className="font-satoshi font-bold text-white text-4xl sm:text-5xl lg:text-6xl text-center leading-[1.05] tracking-tight max-w-4xl mx-auto"
          data-testid="inventory-hero"
        >
          {isEs ? (
            <>
              Y ahora, tu inventario{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                también piensa contigo.
              </span>
            </>
          ) : (
            <>
              And now, your inventory{" "}
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                thinks with you too.
              </span>
            </>
          )}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-center text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mt-5"
        >
          {isEs
            ? "Quantro observa tu operación en tiempo real, detecta lo que está fuera de lugar y te dice exactamente qué hacer."
            : "Quantro watches your operation in real time, spots what's out of place and tells you exactly what to do."}
        </motion.p>

        {/* Capabilities */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16" data-testid="inventory-capabilities">
          {capabilities.map((c, i) => (
            <Capability
              key={c.title}
              icon={c.icon}
              title={c.title}
              copy={c.copy}
              idx={i}
            />
          ))}
        </div>

        {/* Fulfillment Inteligente — divider */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center gap-3 mt-24 mb-10"
        >
          <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-[#00F5FF]/40" />
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]/80">
            {isEs ? "Fulfillment Inteligente" : "Smart Fulfillment"}
          </span>
          <span className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-[#00F5FF]/40" />
        </motion.div>

        <motion.h3
          variants={fadeInUp}
          className="font-satoshi font-bold text-white text-2xl sm:text-3xl lg:text-4xl text-center leading-tight tracking-tight max-w-3xl mx-auto mb-3"
        >
          {isEs
            ? "No solo detecta problemas. Propone la solución."
            : "It doesn't just spot problems. It proposes the fix."}
        </motion.h3>
        <motion.p
          variants={fadeInUp}
          className="text-center text-[14px] text-slate-400 max-w-xl mx-auto mb-12"
        >
          {isEs
            ? "Cada aviso llega con un movimiento concreto que puedes aprobar con un clic."
            : "Every alert arrives with a concrete move you can approve in one click."}
        </motion.p>

        {/* Demo — recommendation card */}
        <motion.div
          variants={fadeInUp}
          className="max-w-xl mx-auto"
          data-testid="inventory-demo"
        >
          {/* Alert / problem */}
          <div
            className="relative rounded-2xl p-5 border overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(12, 18, 34, 0.9), rgba(5, 10, 24, 0.82))",
              borderColor: "rgba(0, 245, 255, 0.22)",
              boxShadow: "0 20px 50px -20px rgba(0, 245, 255, 0.35)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                <Bell size={14} className="text-rose-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-300/90 mb-1">
                  {isEs ? "Detectado · Hace 2 min" : "Detected · 2 min ago"}
                </div>
                <p className="text-[14px] text-white leading-snug font-medium">
                  {isEs ? "Estás perdiendo ventas en " : "You're losing sales in "}
                  <span className="text-rose-300">CDMX</span>.
                </p>
                <p className="text-[12.5px] text-slate-400 leading-snug mt-1">
                  {isEs ? "Hay stock disponible en " : "Stock is available at "}
                  <span className="text-white">{isEs ? "Bodega Central" : "Central Warehouse"}</span>.{" "}
                  {isEs
                    ? "Mover 25 unidades resolvería el problema."
                    : "Moving 25 units would solve it."}
                </p>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center py-4">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="w-8 h-8 rounded-full bg-[#00F5FF]/8 border border-[#00F5FF]/30 flex items-center justify-center"
            >
              <ArrowDown size={14} className="text-[#00F5FF]" />
            </motion.div>
          </div>

          {/* Solution — move card */}
          <div
            className="relative rounded-2xl p-5 border overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(0, 245, 255, 0.08), rgba(14, 22, 40, 0.92))",
              borderColor: "rgba(0, 245, 255, 0.4)",
              boxShadow: "0 24px 60px -20px rgba(0, 245, 255, 0.55)",
            }}
            data-testid="inventory-move-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]">
                {isEs ? "Mover stock" : "Move stock"}
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[10px] font-semibold text-[#7FF5FF]">
                <span className="w-1 h-1 rounded-full bg-[#00F5FF] shadow-[0_0_6px_rgba(0,245,255,0.8)]" />
                {isEs ? "25 unidades" : "25 units"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500 w-8">
                  {isEs ? "De" : "From"}
                </span>
                <div className="flex items-center gap-2 flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2">
                  <MapPin size={13} className="text-slate-400" />
                  <span className="text-[13px] text-white font-medium">
                    {isEs ? "Bodega Central" : "Central Warehouse"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500 w-8">
                  {isEs ? "A" : "To"}
                </span>
                <div className="flex items-center gap-2 flex-1 rounded-lg bg-[#00F5FF]/[0.06] border border-[#00F5FF]/25 px-3 py-2">
                  <MapPin size={13} className="text-[#00F5FF]" />
                  <span className="text-[13px] text-white font-medium">
                    {isEs ? "Tienda CDMX" : "CDMX Store"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[13px] font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all flex items-center justify-center gap-1.5"
              data-testid="inventory-approve-move"
            >
              {isEs ? "Aprobar movimiento" : "Approve move"}
              <MoveRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* Motion loop — animated reveal of the recommendation cycle */}
        <motion.div
          variants={fadeInUp}
          className="max-w-xl mx-auto mt-12"
          data-testid="inventory-motion-loop-wrapper"
        >
          <p className="text-center text-[11px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-3">
            {isEs ? "Cómo se ve cada ciclo" : "What every cycle looks like"}
          </p>
          <InventoryMotionLoop isEs={isEs} />
        </motion.div>

        {/* Impact — three benefits */}
        <motion.div
          variants={fadeInUp}
          className="grid sm:grid-cols-3 gap-4 mt-20 max-w-4xl mx-auto"
          data-testid="inventory-impact"
        >
          <div className="rounded-xl p-5 bg-white/[0.015] border border-white/[0.06]">
            <ImpactRow
              icon={TrendingDown}
              label={isEs ? "Menos pérdidas por falta de stock" : "Fewer losses from stock-outs"}
            />
          </div>
          <div className="rounded-xl p-5 bg-white/[0.015] border border-white/[0.06]">
            <ImpactRow
              icon={PackageSearch}
              label={isEs ? "Mejor uso del inventario existente" : "Better use of existing inventory"}
            />
          </div>
          <div className="rounded-xl p-5 bg-white/[0.015] border border-white/[0.06]">
            <ImpactRow
              icon={Zap}
              label={isEs ? "Decisiones más rápidas y claras" : "Faster, clearer decisions"}
            />
          </div>
        </motion.div>

        {/* Intelligence connection — while you sleep */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-24 rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(14, 22, 40, 0.8) 0%, rgba(5, 10, 24, 0.75) 100%)",
            border: "1px solid rgba(0, 245, 255, 0.14)",
            boxShadow: "0 30px 80px -30px rgba(0, 245, 255, 0.25)",
          }}
          data-testid="inventory-night-card"
        >
          {/* Starfield / night ambient */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.12), transparent 60%)",
            }}
          />

          <div className="relative px-6 sm:px-12 py-12 text-center">
            {/* Moon → Sun cross-fade animation.
                Triggered on viewport entry; repeats on a gentle 7s loop so
                the "night-to-morning" story reads clearly without being
                distracting. Respects prefers-reduced-motion via Framer's
                automatic handling. */}
            <div
              className="relative inline-flex items-center justify-center w-14 h-14 mb-5"
              data-testid="inventory-moon-sun-icon"
              aria-hidden
            >
              {/* Warm sunrise glow (fades in with the sun) */}
              <motion.span
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0 }}
                whileInView={{
                  opacity: [0, 0, 0.75, 0.75, 0],
                }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{
                  duration: 7,
                  times: [0, 0.42, 0.58, 0.9, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255, 190, 120, 0.55), rgba(255, 150, 80, 0.0) 65%)",
                  filter: "blur(6px)",
                }}
              />

              {/* Moon layer */}
              <motion.span
                className="absolute inset-0 rounded-full bg-[#00F5FF]/[0.08] border border-[#00F5FF]/25 flex items-center justify-center"
                initial={{ opacity: 1, rotate: 0, scale: 1 }}
                whileInView={{
                  opacity: [1, 1, 0, 0, 1],
                  rotate: [0, 0, -35, -35, 0],
                  scale: [1, 1, 0.85, 0.85, 1],
                }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{
                  duration: 7,
                  times: [0, 0.42, 0.55, 0.9, 1],
                  ease: [0.22, 1, 0.36, 1],
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
              >
                <Moon size={22} className="text-[#00F5FF]" />
              </motion.span>

              {/* Sun layer */}
              <motion.span
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255, 176, 102, 0.12)",
                  border: "1px solid rgba(255, 176, 102, 0.4)",
                  boxShadow: "0 0 28px rgba(255, 176, 102, 0.35)",
                }}
                initial={{ opacity: 0, rotate: 35, scale: 0.85 }}
                whileInView={{
                  opacity: [0, 0, 1, 1, 0],
                  rotate: [35, 35, 0, 0, 35],
                  scale: [0.85, 0.85, 1, 1, 0.85],
                }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{
                  duration: 7,
                  times: [0, 0.45, 0.6, 0.88, 1],
                  ease: [0.22, 1, 0.36, 1],
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
              >
                <Sun size={22} className="text-amber-300" />
              </motion.span>
            </div>

            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#00F5FF]/80 mb-3">
              {isEs ? "Mientras tú duermes" : "While you sleep"}
            </p>

            <h3 className="font-satoshi font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight max-w-3xl mx-auto">
              {isEs ? (
                <>
                  Despiertas sabiendo exactamente{" "}
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                    qué mover, qué comprar y dónde actuar.
                  </span>
                </>
              ) : (
                <>
                  You wake up knowing exactly{" "}
                  <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                    what to move, what to buy and where to act.
                  </span>
                </>
              )}
            </h3>

            <p className="text-[14px] text-slate-400 leading-relaxed max-w-xl mx-auto mt-5">
              {isEs
                ? "Quantro Intelligence analiza tu inventario toda la noche. Tú solo decides."
                : "Quantro Intelligence analyzes your inventory all night. You just decide."}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default InventoryIntelligenceSection;
