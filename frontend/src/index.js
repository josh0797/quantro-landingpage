import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/index.css";
import App from "@/App";
import { LanguageProvider } from "@/hooks/useLanguage";
import { PlatformAccessProvider } from "@/hooks/usePlatformAccess";
import AuthRouteBoot from "@/components/AuthRouteBoot";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import ContactPage from "@/pages/ContactPage";
import ComparisonPage from "@/pages/ComparisonPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <PlatformAccessProvider>
          <AuthRouteBoot />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/iniciar-sesion" element={<App />} />
            <Route path="/crear-cuenta" element={<App />} />
            <Route path="/sign-in" element={<App />} />
            <Route path="/sign-up" element={<App />} />
            <Route path="/acceso" element={<App />} />
            <Route path="/access" element={<App />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Comparison page variants */}
            <Route path="/comparacion" element={<ComparisonPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/vs-ninety" element={<ComparisonPage focusKey="ninety" />} />
            <Route path="/vs-eos" element={<ComparisonPage focusKey="eos" />} />
            <Route path="/vs-notion" element={<ComparisonPage focusKey="notion" />} />
          </Routes>
        </PlatformAccessProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
