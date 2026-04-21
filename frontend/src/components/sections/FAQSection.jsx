import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

// FAQ content — inline bilingual data (kept here for maintainability)
const FAQS = [
  {
    q: {
      es: "¿Qué es Quantro OS y por qué funciona?",
      en: "What is Quantro OS and why does it work?",
    },
    a: {
      es: "Quantro OS te muestra qué está pasando en tu negocio y qué hacer después.\nSin reportes complejos. Sin interpretaciones largas. Solo claridad.",
      en: "Quantro OS shows you what's happening in your business and what to do next.\nNo complex reports. No long interpretations. Just clarity.",
    },
  },
  {
    q: {
      es: "¿Qué es Quantro Flow?",
      en: "What is Quantro Flow?",
    },
    a: {
      es: "Quantro Flow se encarga de que las cosas pasen.\nResponde, organiza y da seguimiento automáticamente, para que tu operación no dependa de estar encima de todo.",
      en: "Quantro Flow makes sure things get done.\nIt replies, organizes and follows up automatically, so your operation doesn't depend on you being on top of everything.",
    },
  },
  {
    q: {
      es: "¿Cómo trabajan juntos Quantro OS y Quantro Flow?",
      en: "How do Quantro OS and Quantro Flow work together?",
    },
    a: {
      es: "Uno te da dirección.\nEl otro hace que avance.\n\nLo que antes era análisis + ejecución manual, ahora se convierte en un flujo continuo.",
      en: "One gives you direction.\nThe other makes it move.\n\nWhat used to be analysis + manual execution now becomes a continuous flow.",
    },
  },
  {
    q: {
      es: "¿Quantro reemplaza mis otras herramientas?",
      en: "Does Quantro replace my other tools?",
    },
    a: {
      es: "En muchos casos, sí.\nNo porque tenga más funciones, sino porque conecta lo que antes estaba separado.\n\nMenos herramientas. Más claridad.",
      en: "In many cases, yes.\nNot because it has more features, but because it connects what used to be separated.\n\nFewer tools. More clarity.",
    },
  },
  {
    q: {
      es: "¿Cuánto tiempo toma empezar?",
      en: "How long does it take to get started?",
    },
    a: {
      es: "Desde el primer día ya ves valor.\nNo necesitas implementar procesos largos para empezar a entender y mejorar tu negocio.",
      en: "From day one you see value.\nYou don't need long implementation processes to start understanding and improving your business.",
    },
  },
  {
    q: {
      es: "¿Funciona para empresas pequeñas?",
      en: "Does it work for small companies?",
    },
    a: {
      es: "Sí. De hecho, es donde más impacto tiene.\n\nPorque te da estructura, claridad y ejecución sin necesidad de crecer el equipo.",
      en: "Yes. In fact, that's where it has the biggest impact.\n\nBecause it gives you structure, clarity and execution without having to grow your team.",
    },
  },
  {
    q: {
      es: "¿Qué pasa si quiero cancelar?",
      en: "What if I want to cancel?",
    },
    a: {
      es: "Puedes hacerlo en cualquier momento.\nSin fricción. Sin procesos innecesarios.",
      en: "You can do it anytime.\nNo friction. No unnecessary processes.",
    },
  },
  {
    q: {
      es: "¿Quantro toma decisiones por mí?",
      en: "Does Quantro make decisions for me?",
    },
    a: {
      es: "Quantro detecta, propone y puede avanzar automáticamente.\nTú decides hasta dónde quieres delegar.",
      en: "Quantro detects, proposes and can move forward automatically.\nYou decide how much you want to delegate.",
    },
  },
  {
    q: {
      es: "¿Necesito conocimientos técnicos?",
      en: "Do I need technical knowledge?",
    },
    a: {
      es: "No, para nada. Está diseñado para entenderse desde el primer momento.",
      en: "Not at all. It's designed to be understood from the first moment.",
    },
  },
  {
    q: {
      es: "¿Puedo empezar con uno y después usar ambos?",
      en: "Can I start with one and later use both?",
    },
    a: {
      es: "Sí. Puedes empezar con claridad y después llevarlo a ejecución, cuando tenga sentido para tu negocio.",
      en: "Yes. You can start with clarity and later move to execution, when it makes sense for your business.",
    },
  },
];

const FaqItem = ({ item, index, isOpen, onToggle, tObj }) => {
  return (
    <div
      className={`border-b border-slate-800/60 transition-colors ${
        isOpen ? "bg-slate-900/30" : ""
      }`}
      data-testid={`faq-item-${index}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-6 text-left py-7 px-2 sm:px-4 hover:bg-slate-900/20 transition-colors group"
        data-testid={`faq-question-${index}`}
      >
        <span
          className={`font-satoshi text-lg sm:text-xl leading-snug tracking-tight transition-colors ${
            isOpen ? "text-white" : "text-slate-200 group-hover:text-white"
          }`}
        >
          {tObj(item.q)}
        </span>

        <span
          className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "border-[#00F5FF]/50 bg-[#00F5FF]/10"
              : "border-slate-700 group-hover:border-slate-500"
          }`}
        >
          <Plus
            size={18}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-45 text-[#00F5FF]" : "text-slate-400"
            }`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div
              className="pb-7 px-2 sm:px-4 text-slate-400 text-base sm:text-lg leading-relaxed max-w-3xl whitespace-pre-line"
              data-testid={`faq-answer-${index}`}
            >
              {tObj(item.a)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection = () => {
  const { tObj, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0); // first one open by default

  const handleToggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  const header = {
    eyebrow: "FAQ",
    title: language === "es" ? "Antes de empezar" : "Before you begin",
    subtitle:
      language === "es"
        ? "Respuestas claras para tomar una decisión."
        : "Clear answers to help you decide.",
  };

  return (
    <AnimatedSection id="faq" className="py-24 px-6" data-testid="faq-section">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeInUp} className="mb-12">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            {header.eyebrow}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-5">
            {header.title}
          </h2>
          <p className="text-lg text-slate-400">{header.subtitle}</p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="border-t border-slate-800/60"
          data-testid="faq-list"
        >
          {FAQS.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
              tObj={tObj}
            />
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default FAQSection;
