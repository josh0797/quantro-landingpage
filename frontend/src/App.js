import React from "react";
import "@/App.css";
import { LanguageProvider } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import PaymentReturnModal from "@/components/PaymentReturnModal";
import HeroSection from "@/components/sections/HeroSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import HeroTransitionSection from "@/components/sections/HeroTransitionSection";
import ProductComparisonSection from "@/components/sections/ProductComparisonSection";
import BetterTogetherSection from "@/components/sections/BetterTogetherSection";
import QuantroIntelligenceSection from "@/components/sections/QuantroIntelligenceSection";
import MorningSnapshotSection from "@/components/sections/MorningSnapshotSection";
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection";
import StarFeaturesSection from "@/components/sections/StarFeaturesSection";
import DifferentiationSection from "@/components/sections/DifferentiationSection";
import PricingSection from "@/components/sections/PricingSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import Footer from "@/components/sections/Footer";

function AppContent() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <HeroTransitionSection />
      <ProductComparisonSection />
      <BetterTogetherSection />
      <QuantroIntelligenceSection />
      <MorningSnapshotSection />
      <SuccessStoriesSection />
      <StarFeaturesSection />
      <DifferentiationSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />

      {/* Stripe return modal — reads ?payment=success|cancel from URL */}
      <PaymentReturnModal />
    </div>
  );
}

// Main App Component with Language Provider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
