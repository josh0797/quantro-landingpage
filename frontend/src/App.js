import React from "react";
import "@/App.css";
import Navbar from "@/components/Navbar";
import PaymentReturnModal from "@/components/PaymentReturnModal";
import SupportChatWidget from "@/components/SupportChatWidget";
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
import ValueStackSection from "@/components/sections/ValueStackSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";

// Landing page (routed at "/"). LanguageProvider + Router live in index.js.
export default function App() {
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
      <ValueStackSection />
      <PricingSection />
      <FAQSection />
      <Footer />

      {/* Stripe return modal — reads ?payment=success|cancel from URL */}
      <PaymentReturnModal />

      {/* Floating AI support chat */}
      <SupportChatWidget />
    </div>
  );
}
