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
import InventoryIntelligenceSection from "@/components/sections/InventoryIntelligenceSection";
import PeopleOSSection from "@/components/sections/PeopleOSSection";
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection";
import StarFeaturesSection from "@/components/sections/StarFeaturesSection";
import DifferentiationSection from "@/components/sections/DifferentiationSection";
import ComparisonSummarySection from "@/components/sections/ComparisonSummarySection";
import SwitchToQuantroSection from "@/components/sections/SwitchToQuantroSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import QuantroProductPill from "@/components/QuantroProductPill";
import useSectionDepthTracker from "@/hooks/useSectionDepthTracker";

/**
 * Landing page (routed at "/").
 * LanguageProvider + PlatformAccessProvider + AuthRouteBoot + Router live in index.js.
 */

const LandingShell = () => {
  // GA4 funnel telemetry — fires `section_view` once per section the first
  // time it crosses 50% visibility, and a final `scroll_depth_section` when
  // the tab is hidden. Needs `[data-section]` on target <section> nodes.
  useSectionDepthTracker();

  return (
    <div className="min-h-screen bg-[#030712]">
    <div className="noise-overlay" />

    <AnnouncementBanner />
    <Navbar />
    <QuantroProductPill />

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

    {/* Act 5.5 — New capability: Inventory Intelligence keynote */}
    <InventoryIntelligenceSection />

    {/* Act 5.6 — New capability: People OS */}
    <PeopleOSSection />

    {/* Proof + Offer */}
    <SuccessStoriesSection />
    <StarFeaturesSection />
    <DifferentiationSection />

    {/* Act 6 — Silent objection: "how is this different from what I already use?" */}
    <ComparisonSummarySection />

    {/* Act 7 — Remove the migration fear: "it's easy to switch" */}
    <SwitchToQuantroSection />

    <PricingSection />
    <FAQSection />
    <Footer />

    {/* Stripe return modal + chat */}
    <PaymentReturnModal />
    <SupportChatWidget />
  </div>
  );
};

const AppContent = () => <LandingShell />;

export default function App() {
  return <AppContent />;
}
