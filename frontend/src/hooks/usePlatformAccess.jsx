import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import PlatformAccessScreen from "../components/PlatformAccessScreen";

/**
 * Global provider exposing openPlatformAccess() so any CTA on the landing
 * (Navbar, Hero, Pricing, Footer, etc.) can trigger the same modal flow.
 *
 * Accepts optional { stage, authMode } to skip straight to a specific step.
 * Used by the auth route pages (/iniciar-sesion, /sign-up, ...) to deep-link.
 */

const PlatformAccessContext = createContext({
  open: () => {},
  close: () => {},
  isOpen: false,
  initial: null,
});

export const PlatformAccessProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initial, setInitial] = useState(null);

  const open = useCallback((params = null) => {
    setInitial(params || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setInitial(null);
  }, []);

  const value = useMemo(
    () => ({ open, close, isOpen, initial }),
    [open, close, isOpen, initial]
  );

  return (
    <PlatformAccessContext.Provider value={value}>
      {children}
      <PlatformAccessScreen open={isOpen} onClose={close} initial={initial} />
    </PlatformAccessContext.Provider>
  );
};

export const usePlatformAccess = () => useContext(PlatformAccessContext);
