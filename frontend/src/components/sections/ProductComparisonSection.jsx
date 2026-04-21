import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";

// Product Comparison Section (Side by Side)
export const ProductComparisonSection = () => {
  return (
    <AnimatedSection id="product-comparison" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quantro OS Card */}
          <motion.div
            variants={fadeInUp}
            className="product-card-os rounded-2xl p-8 md:p-10 transition-all duration-300"
            data-testid="product-card-os"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center">
                <Brain className="text-[#00F5FF]" size={24} />
              </div>
              <div>
                <h3 className="font-satoshi font-bold text-2xl text-white">Quantro OS</h3>
                <p className="text-[#00F5FF] text-sm font-medium">Te da claridad</p>
              </div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#00F5FF]" />
                Entiende tu negocio
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#00F5FF]" />
                Detecta oportunidades
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#00F5FF]" />
                Propone acciones
              </li>
            </ul>
          </motion.div>

          {/* Quantro Flow Card */}
          <motion.div
            variants={fadeInUp}
            className="product-card-flow rounded-2xl p-8 md:p-10 transition-all duration-300"
            data-testid="product-card-flow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#A020FF]/10 border border-[#A020FF]/30 flex items-center justify-center">
                <Zap className="text-[#A020FF]" size={24} />
              </div>
              <div>
                <h3 className="font-satoshi font-bold text-2xl text-white">Quantro Flow</h3>
                <p className="text-[#A020FF] text-sm font-medium">Hace que todo avance</p>
              </div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#A020FF]" />
                Responde
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#A020FF]" />
                Organiza
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#A020FF]" />
                Da seguimiento
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ProductComparisonSection;
