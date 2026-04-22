import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLanguage } from "../../hooks/useLanguage";

/**
 * Inline auth form (login + signup) used inside PlatformAccessScreen.
 * Uses Supabase auth directly. Dark premium aesthetic consistent with
 * the rest of the Quantro landing.
 */

const INPUT_CLS =
  "w-full bg-slate-900/60 border border-slate-800 rounded-lg px-10 py-2.5 text-[13px] text-white placeholder-slate-600 focus:outline-none focus:border-[#00F5FF]/50 focus:ring-2 focus:ring-[#00F5FF]/15 transition-all";

export const AuthForm = ({ onBack, onAuthenticated, hideBackButton = false }) => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email || !password) {
      setError(isEs ? "Email y contraseña son requeridos." : "Email and password are required.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError(
        isEs ? "La contraseña debe tener al menos 8 caracteres." : "Password must be at least 8 characters."
      );
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        onAuthenticated?.();
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        // If email confirmation is disabled, session is returned immediately.
        if (data?.session) {
          onAuthenticated?.();
        } else {
          setInfo(
            isEs
              ? "Cuenta creada. Revisa tu correo para confirmar el acceso."
              : "Account created. Check your inbox to confirm access."
          );
        }
      }
    } catch (err) {
      const raw = err?.message || "";
      // Supabase-js surfaces unparseable 500s as "Failed to execute 'json' on 'Response': body stream already read"
      const friendly =
        /body stream already read|Failed to execute|fetch failed|Network/i.test(raw)
          ? isEs
            ? "El servicio de autenticación no respondió. Intenta de nuevo en unos segundos."
            : "The authentication service didn't respond. Please try again in a moment."
          : raw || (isEs ? "Error al autenticar" : "Authentication error");
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md mx-auto"
      data-testid="auth-form"
    >
      {!hideBackButton && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-white mb-5 transition-colors"
          data-testid="auth-back"
        >
          <ArrowLeft size={12} /> {isEs ? "Volver" : "Back"}
        </button>
      )}

      <h2 className="font-satoshi font-bold text-2xl text-white tracking-tight mb-1">
        {mode === "login"
          ? isEs
            ? "Accede a tu cuenta"
            : "Sign in"
          : isEs
          ? "Crea tu cuenta"
          : "Create your account"}
      </h2>
      <p className="text-[12px] text-slate-400 mb-6">
        {mode === "login"
          ? isEs
            ? "Usa el correo con el que te registraste."
            : "Use the email you signed up with."
          : isEs
          ? "Con tu cuenta obtienes acceso a Quantro OS y Quantro Flow."
          : "Your account unlocks both Quantro OS and Quantro Flow."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEs ? "tú@empresa.com" : "you@company.com"}
            className={INPUT_CLS}
            data-testid="auth-email"
            required
          />
        </div>
        <div className="relative">
          <Lock
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEs ? "Contraseña" : "Password"}
            className={INPUT_CLS}
            data-testid="auth-password"
            required
          />
        </div>

        {error && (
          <div
            className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2"
            data-testid="auth-error"
          >
            {error}
          </div>
        )}
        {info && (
          <div
            className="text-[11px] text-[#00F5FF] bg-[#00F5FF]/8 border border-[#00F5FF]/25 rounded-lg px-3 py-2"
            data-testid="auth-info"
          >
            {info}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-[13px] bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
          data-testid="auth-submit"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {mode === "login"
            ? isEs
              ? "Entrar"
              : "Sign in"
            : isEs
            ? "Crear cuenta"
            : "Create account"}
        </button>
      </form>

      <div className="mt-5 text-center text-[11px] text-slate-500">
        {mode === "login" ? (
          <>
            {isEs ? "¿No tienes cuenta?" : "No account yet?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
                setInfo(null);
              }}
              className="text-[#00F5FF] hover:underline"
              data-testid="auth-switch-signup"
            >
              {isEs ? "Crear una" : "Create one"}
            </button>
          </>
        ) : (
          <>
            {isEs ? "¿Ya tienes cuenta?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setInfo(null);
              }}
              className="text-[#00F5FF] hover:underline"
              data-testid="auth-switch-login"
            >
              {isEs ? "Entrar" : "Sign in"}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AuthForm;
