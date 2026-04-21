import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Inbox, Sparkles, Sun } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

// "Así amanece tu empresa con Quantro" — 5-frame narrative
export const AmanecerSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      id="amanecer"
      data-testid="amanecer-section"
      style={{
        background:
          "radial-gradient(ellipse at center top, rgba(0, 245, 255, 0.08) 0%, transparent 40%), #030712",
      }}
    >
      <div className="relative max-w-5xl mx-auto">
        {/* FRAME 1: Opening */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-28"
          data-testid="amanecer-frame-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/25 mb-8">
            <Sun size={14} className="text-[#00F5FF]" />
            <span className="text-xs font-medium text-[#00F5FF] tracking-wider uppercase">
              {isEs ? "Un día con Quantro" : "A day with Quantro"}
            </span>
          </div>
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-4">
            {isEs
              ? "Así amanece tu empresa con Quantro."
              : "This is how your company wakes up with Quantro."}
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            {isEs
              ? "Antes de que empieces el día, todo ya está claro."
              : "Before your day starts, everything is already clear."}
          </p>
        </motion.div>

        {/* FRAME 2: Dashboard detection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-10 items-center mb-28"
          data-testid="amanecer-frame-2"
        >
          <div>
            <h3 className="font-satoshi font-semibold text-2xl sm:text-3xl text-white mb-3 tracking-tight">
              {isEs ? "Detectamos esto mientras dormías." : "We detected this while you slept."}
            </h3>
            <p className="text-base text-slate-400 leading-relaxed">
              {isEs
                ? "Y esto es lo que deberías hacer hoy."
                : "And this is what you should do today."}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#00F5FF]/10 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0A0F1C] border border-slate-800/70 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-amber-400" size={18} />
                <span className="text-xs font-medium text-amber-400 tracking-wider uppercase">
                  {isEs ? "Riesgo financiero detectado" : "Financial risk detected"}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-1">
                  {isEs ? "Exposición estimada" : "Estimated exposure"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-satoshi font-bold text-4xl text-white tabular-nums">
                    $1,399
                  </span>
                  <span className="text-xs text-slate-500">
                    {isEs ? "/ cuentas por cobrar vencidas" : "/ overdue receivables"}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 pt-3 border-t border-slate-800/60">
                {(isEs
                  ? [
                      "3 facturas con >30 días sin pago",
                      "Cliente top con actividad decreciente",
                      "Margen Q2 por debajo del forecast",
                    ]
                  : [
                      "3 invoices >30 days unpaid",
                      "Top client with decreasing activity",
                      "Q2 margin below forecast",
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* FRAME 3: Action plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-10 items-center mb-28"
          data-testid="amanecer-frame-3"
        >
          <div className="md:order-2">
            <h3 className="font-satoshi font-semibold text-2xl sm:text-3xl text-white mb-3 tracking-tight">
              {isEs ? "No solo ves el problema." : "You don't just see the problem."}
            </h3>
            <p className="text-base text-slate-400 leading-relaxed">
              {isEs ? "Recibes el plan." : "You get the plan."}
            </p>
          </div>

          <div className="relative md:order-1">
            <div className="bg-[#0A0F1C] border border-slate-800/70 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
                <CheckCircle2 className="text-[#00F5FF]" size={16} />
                <span className="text-sm font-medium text-white">
                  {isEs ? "Plan de acción · hoy" : "Action plan · today"}
                </span>
                <span className="ml-auto text-[10px] text-[#00F5FF] bg-[#00F5FF]/10 border border-[#00F5FF]/25 rounded px-1.5 py-0.5">
                  {isEs ? "Auto-generado" : "Auto-generated"}
                </span>
              </div>
              <div className="space-y-2.5">
                {(isEs
                  ? [
                      { task: "Enviar recordatorio a 3 clientes vencidos", done: true },
                      { task: "Agendar llamada con cliente top", done: true },
                      { task: "Revisar forecast Q2", done: false },
                      { task: "Actualizar scorecard", done: false },
                    ]
                  : [
                      { task: "Send reminder to 3 overdue clients", done: true },
                      { task: "Schedule call with top client", done: true },
                      { task: "Review Q2 forecast", done: false },
                      { task: "Update scorecard", done: false },
                    ]
                ).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.35 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/40"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                        item.done ? "bg-[#00F5FF]" : "border border-slate-600"
                      }`}
                    >
                      {item.done && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2 5 L4 7 L8 3"
                            stroke="#0A0F1C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        item.done ? "text-slate-500 line-through" : "text-slate-300"
                      }`}
                    >
                      {item.task}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* FRAME 4: Flow working in parallel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-10 items-center mb-28"
          data-testid="amanecer-frame-4"
        >
          <div>
            <h3 className="font-satoshi font-semibold text-2xl sm:text-3xl text-white mb-3 tracking-tight">
              {isEs ? "Y mientras decides…" : "And while you decide…"}
            </h3>
            <p className="text-base text-slate-400 leading-relaxed">
              {isEs
                ? "tu operación sigue avanzando."
                : "your operation keeps moving forward."}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#A020FF]/10 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0A0F1C] border border-slate-800/70 rounded-2xl p-5 space-y-3">
              {/* Inbox activity */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <div className="flex items-center gap-2 mb-2">
                  <Inbox size={12} className="text-[#C084FC]" />
                  <span className="text-xs text-white font-medium">Inbox</span>
                  <motion.span
                    className="ml-auto text-[10px] text-emerald-400 font-medium"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    {isEs ? "respondiendo" : "replying"}
                  </motion.span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>✓ {isEs ? "3 mensajes respondidos" : "3 messages replied"}</div>
                  <div>✓ {isEs ? "1 lead creado" : "1 lead created"}</div>
                </div>
              </div>

              {/* Pipeline movement */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-[#C084FC]" />
                  <span className="text-xs text-white font-medium">Pipeline</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-slate-400">Prospección</span>
                  <span className="text-[#C084FC]">→</span>
                  <span className="text-white">{isEs ? "Propuesta" : "Proposal"}</span>
                  <span className="ml-auto text-emerald-400">+$42K</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FRAME 5: Closing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center pt-8"
          data-testid="amanecer-frame-5"
        >
          <div className="inline-block relative">
            <div className="absolute -inset-10 bg-gradient-to-r from-[#00F5FF]/15 via-[#A020FF]/15 to-[#00F5FF]/15 rounded-full blur-3xl" />
            <div className="relative">
              <p className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.05] tracking-tight mb-4">
                {isEs ? "Tu negocio no se detiene." : "Your business doesn't stop."}
              </p>
              <p className="font-satoshi text-2xl sm:text-3xl bg-gradient-to-r from-[#00F5FF] via-[#22D3EE] to-[#A020FF] bg-clip-text text-transparent tracking-tight">
                {isEs ? "Evoluciona todos los días." : "It evolves every day."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AmanecerSection;
