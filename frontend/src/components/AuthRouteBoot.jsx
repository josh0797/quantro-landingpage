import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { useLanguage } from "../hooks/useLanguage";
import { resolveAuthRoute, AUTH_PAGE_TITLES } from "../lib/authRoutes";

/**
 * Invisible boot component that reacts to /iniciar-sesion, /sign-in,
 * /crear-cuenta and /sign-up routes:
 *   1. Auto-opens the PlatformAccessScreen at the 'auth' stage with the
 *      correct mode (login / signup).
 *   2. Updates document.title for SEO + tab clarity.
 *
 * Must live INSIDE the PlatformAccessProvider tree.
 */
export const AuthRouteBoot = () => {
  const location = useLocation();
  const { open, close, isOpen } = usePlatformAccess();
  const { setLanguage, language } = useLanguage();
  const bootedRef = useRef(false);
  const lastPathRef = useRef(null);

  useEffect(() => {
    const match = resolveAuthRoute(location.pathname);

    if (!match) {
      // Left an auth route: restore default title, close modal if we opened it
      if (lastPathRef.current && resolveAuthRoute(lastPathRef.current)) {
        document.title = "Quantro — Inteligencia autónoma para tu negocio";
        if (isOpen && bootedRef.current) close();
        bootedRef.current = false;
      }
      lastPathRef.current = location.pathname;
      return;
    }

    // Sync language with URL language if they diverge
    if (match.lang !== language) {
      setLanguage(match.lang);
    }

    // Sync document.title
    const title = AUTH_PAGE_TITLES[match.mode]?.[match.lang];
    if (title) document.title = title;

    // Open modal if not already open (idempotent)
    if (!isOpen) {
      open({ stage: "auth", authMode: match.mode });
      bootedRef.current = true;
    }

    lastPathRef.current = location.pathname;
    // Intentionally exclude open/close from deps — they're stable callbacks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, language]);

  return null;
};

export default AuthRouteBoot;
