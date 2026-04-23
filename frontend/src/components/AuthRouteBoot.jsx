import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePlatformAccess } from "../hooks/usePlatformAccess";
import { useLanguage } from "../hooks/useLanguage";
import {
  resolveAuthRoute,
  resolvePickerRoute,
  AUTH_PAGE_TITLES,
  PICKER_PAGE_TITLES,
} from "../lib/authRoutes";

const DEFAULT_TITLE = "Quantro — Inteligencia autónoma para tu negocio";

/**
 * Invisible boot component that reacts to auth and platform-picker routes:
 *   /iniciar-sesion · /sign-in        → open modal at auth (login)
 *   /crear-cuenta   · /sign-up        → open modal at auth (signup)
 *   /acceso         · /access         → open modal at choose_platform
 *
 * Also keeps document.title in sync with the route+language.
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
    const authMatch = resolveAuthRoute(location.pathname);
    const pickerMatch = resolvePickerRoute(location.pathname);
    const anyMatch = authMatch || pickerMatch;

    if (!anyMatch) {
      // Left a routed modal screen: restore default title + close if we opened it
      if (
        lastPathRef.current &&
        (resolveAuthRoute(lastPathRef.current) ||
          resolvePickerRoute(lastPathRef.current))
      ) {
        document.title = DEFAULT_TITLE;
        if (isOpen && bootedRef.current) close();
        bootedRef.current = false;
      }
      lastPathRef.current = location.pathname;
      return;
    }

    // Sync language with URL language if they diverge
    const targetLang = authMatch?.lang || pickerMatch?.lang;
    if (targetLang && targetLang !== language) {
      setLanguage(targetLang);
    }

    // Sync document.title
    if (authMatch) {
      const title = AUTH_PAGE_TITLES[authMatch.mode]?.[authMatch.lang];
      if (title) document.title = title;
    } else if (pickerMatch) {
      const title = PICKER_PAGE_TITLES[pickerMatch.lang];
      if (title) document.title = title;
    }

    // Open modal if not already open (idempotent) — pass the right initial stage
    if (!isOpen) {
      if (authMatch) {
        open({ stage: "auth", authMode: authMatch.mode });
      } else {
        open({ stage: "choose_platform" });
      }
      bootedRef.current = true;
    }

    lastPathRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, language]);

  return null;
};

export default AuthRouteBoot;
