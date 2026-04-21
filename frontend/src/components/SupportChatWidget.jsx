import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STORAGE_KEY = "quantro-chat-session";

// Floating support chat — Intercom-style but minimalist dark
export const SupportChatWidget = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const [limitReached, setLimitReached] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const t = (k) => {
    const dict = {
      header: { es: "Soporte Quantro", en: "Quantro Support" },
      tagline: { es: "Respondemos al instante", en: "We reply instantly" },
      placeholder: {
        es: "Escribe tu pregunta…",
        en: "Type your question…",
      },
      greeting: {
        es: "¡Hola! Soy el asistente de Quantro. ¿En qué puedo ayudarte hoy?",
        en: "Hi! I'm Quantro's assistant. How can I help you today?",
      },
      suggest1: { es: "¿Qué es Quantro?", en: "What is Quantro?" },
      suggest2: { es: "¿Cuánto cuesta?", en: "How much does it cost?" },
      suggest3: { es: "¿Cómo empiezo?", en: "How do I get started?" },
      poweredBy: { es: "Asistido por IA", en: "AI-assisted" },
      error: {
        es: "Algo salió mal. Intenta de nuevo o escríbenos a soporte@quantroos.com.",
        en: "Something went wrong. Please try again or email soporte@quantroos.com.",
      },
      limitReached: {
        es: "Has alcanzado el límite. Para seguir, escríbenos a soporte@quantroos.com.",
        en: "You've reached the limit. To continue, email soporte@quantroos.com.",
      },
    };
    return dict[k]?.[language] || dict[k]?.es;
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !limitReached) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, limitReached]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading || limitReached) return;

    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          language,
        }),
      });

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t("limitReached"), id: Date.now() + 1 },
        ]);
        setLimitReached(true);
        return;
      }

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
        try {
          localStorage.setItem(STORAGE_KEY, data.session_id);
        } catch {
          /* ignore */
        }
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, id: Date.now() + 1 },
      ]);
      if (data.limit_reached) setLimitReached(true);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("error"), id: Date.now() + 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [t("suggest1"), t("suggest2"), t("suggest3")];

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] shadow-2xl shadow-[#00F5FF]/20 flex items-center justify-center"
            data-testid="chat-widget-trigger"
            aria-label="Open support chat"
          >
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#030712]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="fixed bottom-6 right-6 z-[90] w-[calc(100vw-3rem)] sm:w-[380px] h-[560px] max-h-[calc(100vh-4rem)] bg-[#0A0F1C] border border-slate-700/60 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            data-testid="chat-widget-panel"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-slate-900 to-[#0A0F1C] px-5 py-4 border-b border-slate-800/70 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#A020FF]/20 border border-[#00F5FF]/30 flex items-center justify-center">
                  <Sparkles className="text-[#00F5FF]" size={16} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0A0F1C]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-satoshi font-semibold text-sm" data-testid="chat-header-title">
                  {t("header")}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  {t("tagline")}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                data-testid="chat-close-button"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              data-testid="chat-messages"
            >
              {/* Greeting bubble (always shown first) */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#A020FF]/20 border border-[#00F5FF]/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-[#00F5FF]" size={12} />
                </div>
                <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                  <p className="text-sm text-slate-200 leading-relaxed">{t("greeting")}</p>
                </div>
              </motion.div>

              {/* Suggestions (only shown if no messages yet) */}
              {messages.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 pl-10 pt-1"
                >
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(sug)}
                      className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800/50 border border-slate-700/50 rounded-full hover:bg-[#00F5FF]/10 hover:border-[#00F5FF]/30 hover:text-[#00F5FF] transition-all"
                      data-testid={`chat-suggestion-${i}`}
                    >
                      {sug}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Conversation */}
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#A020FF]/20 border border-[#00F5FF]/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-[#00F5FF]" size={12} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] rounded-tr-sm font-medium"
                        : "bg-slate-800/70 border border-slate-700/50 text-slate-200 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#A020FF]/20 border border-[#00F5FF]/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-[#00F5FF]" size={12} />
                  </div>
                  <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl rounded-tl-sm px-3.5 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-slate-400"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="border-t border-slate-800/70 p-3"
            >
              <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full pl-4 pr-1 py-1 focus-within:border-[#00F5FF]/40 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("placeholder")}
                  disabled={loading || limitReached}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none py-2 disabled:opacity-50"
                  data-testid="chat-input"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading || limitReached}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] flex items-center justify-center hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  data-testid="chat-send-button"
                  aria-label="Send message"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-2">{t("poweredBy")}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatWidget;
