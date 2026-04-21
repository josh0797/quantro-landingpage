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

// Landing page (routed at "/"). LanguageProvider + Router live in index.js.
// Narrative: Problem → System → Value → Product → Cinematic → Real day → Proof → Price
export default function App() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="noise-overlay" />

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
}
