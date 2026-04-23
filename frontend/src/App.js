import React from "react";
import "@/App.css";
import Navbar from "@/components/Navbar";
import PaymentReturnModal from "@/components/PaymentReturnModal";
import SupportChatWidget from "@/components/SupportChatWidget";
import HeroSection from "@/components/sections/HeroSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import ProblemSystemSection from "@/components/sections/ProblemSystemSection";
import ValueStackSection from "@/components/sections/ValueStackSection";
import InteractiveDemoSection from "@/components/sections/InteractiveDemoSection";
import CinematicTransitionSection from "@/components/sections/CinematicTransitionSection";
import AmanecerSection from "@/components/sections/AmanecerSection";
import IntelligenceSection from "@/components/sections/IntelligenceSection";
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection";
import StarFeaturesSection from "@/components/sections/StarFeaturesSection";
import DifferentiationSection from "@/components/sections/DifferentiationSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import { PlatformAccessProvider } from "@/hooks/usePlatformAccess";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import AuthRouteBoot from "@/components/AuthRouteBoot";

/**
 * Landing page (routed at "/").
 * LanguageProvider + Router live in index.js.
 *
 * Structure:
 *   App (infrastructure: providers)
 *     └─ AppContent (hooks / guards)
 *          └─ LandingShell (the actual marketing page)
 *
 * Supabase auth + profiles state are read on demand via useUserBillingState
 * from any CTA or modal. The PlatformAccessProvider mounts the global
 * platform-access modal so every "Comenzar" / pricing CTA opens the same
 * real flow (pick platform → auth → pick plan → redirect).
 */

const LandingShell = () => (
  <div className="min-h-screen bg-[#030712]">
    <div className="noise-overlay" />

    <AnnouncementBanner />
    <Navbar />

    {/* Hook */}
    <HeroSection />
    <SocialProofSection />

    {/* Act 1 — Problem → System */}
    <ProblemSystemSection />

    {/* Act 2 — From many tools to one system */}
    <ValueStackSection />

    {/* Act 3 — Product in action */}
    <InteractiveDemoSection />

    {/* Cinematic pause */}
    <CinematicTransitionSection />

    {/* Act 4 — Living the outcome */}
    <AmanecerSection />

    {/* Act 5 — Reveal: the system behind it all */}
    <IntelligenceSection />

    {/* Proof + Offer */}
    <SuccessStoriesSection />
    <StarFeaturesSection />
    <DifferentiationSection />
    <PricingSection />
    <FAQSection />
    <Footer />

    {/* Stripe return modal + chat */}
    <PaymentReturnModal />
    <SupportChatWidget />
  </div>
);

const AppContent = () => <LandingShell />;

export default function App() {
  return (
    <PlatformAccessProvider>
      <AuthRouteBoot />
      <AppContent />
    </PlatformAccessProvider>
  );
}
