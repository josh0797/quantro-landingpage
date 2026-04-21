import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Check, Zap } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

// Compact Dashboard Preview for Hero
export const HeroDashboardPreview = () => {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      {/* Glow effect behind dashboard */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#00F5FF]/10 via-transparent to-[#A020FF]/10 rounded-3xl blur-2xl" />

      <div className="relative bg-[#0F172A]/90 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Browser bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[10px] text-slate-500 font-mono">app.quantroos.com/dashboard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-slate-500">Live</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-4 space-y-3">
          {/* Alert */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="text-emerald-400" size={12} />
              </div>
              <span className="text-emerald-400 text-xs font-medium">
                {language === "es" ? "Plan de crecimiento activo" : "Growth plan active"}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {language === "es" ? "3 acciones ejecutándose" : "3 actions executing"}
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 mb-1">{language === "es" ? "Ingresos" : "Revenue"}</p>
              <p className="text-lg font-mono text-white font-medium">$847K</p>
              <p className="text-[10px] text-emerald-400">+12.4%</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 mb-1">{language === "es" ? "Margen" : "Margin"}</p>
              <p className="text-lg font-mono text-white font-medium">67.3%</p>
              <p className="text-[10px] text-emerald-400">+2.1%</p>
            </div>
          </div>

          {/* Action items */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">
              {language === "es" ? "Próximas acciones" : "Next actions"}
            </p>
            {[
              { done: true, text: language === "es" ? "Enviar propuestas" : "Send proposals" },
              { done: true, text: language === "es" ? "Optimizar gastos" : "Optimize costs" },
              { done: false, text: language === "es" ? "Revisar leads" : "Review leads" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                    item.done ? "bg-[#00F5FF]/20" : "bg-slate-700/50"
                  }`}
                >
                  {item.done && <Check className="text-[#00F5FF]" size={10} />}
                </div>
                <span className={item.done ? "text-slate-400 line-through" : "text-slate-300"}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -bottom-3 -left-3 bg-[#A020FF]/20 border border-[#A020FF]/30 rounded-lg px-3 py-1.5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-1.5">
          <Zap className="text-[#A020FF]" size={12} />
          <span className="text-[#A020FF] text-[11px] font-medium">Quantro Flow</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroDashboardPreview;
