import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/index.css";
import App from "@/App";
import { LanguageProvider } from "@/hooks/useLanguage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import ContactPage from "@/pages/ContactPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
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
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
