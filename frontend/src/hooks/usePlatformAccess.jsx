import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import PlatformAccessScreen from "../components/PlatformAccessScreen";

/**
 * Global provider exposing openPlatformAccess() so any CTA on the landing
 * (Navbar, Hero, Pricing, Footer, etc.) can trigger the same modal flow.
 */

const PlatformAccessContext = createContext({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export const PlatformAccessProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <PlatformAccessContext.Provider value={value}>
      {children}
      <PlatformAccessScreen open={isOpen} onClose={close} />
    </PlatformAccessContext.Provider>
  );
};

export const usePlatformAccess = () => useContext(PlatformAccessContext);
