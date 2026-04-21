import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";

// Quantro Intelligence Section
export const QuantroIntelligenceSection = () => {
  const capabilities = [
    "Tendencias actuales y futuras",
    "Dónde tienes oportunidad",
    "Qué priorizar primero",
    "Qué hacer a continuación"
  ];

  return (
    <AnimatedSection className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp}>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#00F5FF] mb-4 block">
              Quantro Intelligence
            </span>
            <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
              Tu negocio sigue avanzando mientras duermes.
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Quantro Intelligence analiza tu mercado y te propone acciones listas para avanzar cada día.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {capabilities.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="text-[#00F5FF]" size={16} />
                  </div>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/10 to-[#A020FF]/10 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-[#00F5FF]" size={20} />
                <span className="text-white font-medium">Análisis de hoy</span>
                <span className="text-xs text-slate-500 ml-auto">hace 4 min</span>
              </div>
              <div className="space-y-3">
                <div className="bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-lg p-3">
                  <p className="text-sm text-slate-300">📈 Oportunidad: El segmento Enterprise creció 23% este mes</p>
                </div>
                <div className="bg-[#A020FF]/5 border border-[#A020FF]/20 rounded-lg p-3">
                  <p className="text-sm text-slate-300">⚡ Acción: Enviar propuesta a 5 leads calificados</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-sm text-slate-300">✅ Prioridad: Cerrar renovación con cliente clave</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default QuantroIntelligenceSection;
