import React, { useState, useEffect, useRef } from "react";
import "@/App.css";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  TrendingUp,
  Target,
  LineChart,
  Play,
  AlertCircle,
  BarChart3,
  Brain,
  Layers,
  Clock,
  ChevronRight,
  Menu,
  X,
  Gauge,
  Mountain,
  ListTodo,
  MessageSquare,
  Sparkles,
  Grid3X3,
  Scissors,
  Bot,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuantroMorningDemo from "@/components/QuantroMorningDemo";

// GA4 CTA Click Tracking
const trackCTAClick = (ctaLocation) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      event_category: "engagement",
      event_label: ctaLocation,
      cta_text: "Start Free Trial"
    });
  }
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Animated Section Wrapper
const AnimatedSection = ({ children, className = "", id = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Premium Quantro SVG Logo System
const QuantroLogoMark = ({
  size = 48,
  glow = false,
  transparent = true,
  className = "",
  strokeWidth = 1.8
}) => {
  const glowId = `quantro-glow-${size}-${glow ? "on" : "off"}`;
  const gradientId = `q-stroke-${size}`;
  const panelGradientId = `panel-fill-${size}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <>
          <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-2xl scale-125" />
          <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-3xl scale-150" />
        </>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        aria-label="Quantro logo"
      >
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56">
            <stop offset="0%" stopColor="#7DEBFF" />
            <stop offset="55%" stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>

          <linearGradient id={panelGradientId} x1="6" y1="6" x2="58" y2="58">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>

        {!transparent && (
          <rect
            x="6"
            y="6"
            width="52"
            height="52"
            rx="14"
            fill={`url(#${panelGradientId})`}
          />
        )}

        <rect
          x="8"
          y="8"
          width="48"
          height="48"
          rx="14"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          opacity="0.95"
          filter={glow ? `url(#${glowId})` : undefined}
        />

        <rect
          x="13"
          y="13"
          width="38"
          height="38"
          rx="10"
          stroke="#5EEBFF"
          strokeWidth="0.8"
          opacity="0.18"
        />

        <path
          d="M32 19.5C24.82 19.5 19 25.32 19 32.5C19 39.68 24.82 45.5 32 45.5C35.06 45.5 37.88 44.44 40.1 42.66"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={glow ? `url(#${glowId})` : undefined}
        />
        <path
          d="M32 19.5C39.18 19.5 45 25.32 45 32.5C45 35.96 43.65 39.1 41.45 41.43"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.95"
          filter={glow ? `url(#${glowId})` : undefined}
        />
        <path
          d="M38.5 38.5L47 49"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={glow ? `url(#${glowId})` : undefined}
        />
      </svg>
    </div>
  );
};

const HeroQuantroLogo = () => (
  <div className="relative flex items-center justify-center">
    <div className="absolute w-[280px] h-[280px] rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="absolute w-[360px] h-[360px] rounded-full bg-blue-500/8 blur-[120px]" />
    <div className="absolute w-[220px] h-[220px] rounded-full border border-cyan-300/10" />
    <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-300/5" />

    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative z-10"
    >
      <QuantroLogoMark size={176} glow transparent />
    </motion.div>
  </div>
);

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-3" : "py-5"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3" data-testid="logo">
          <QuantroLogoMark size={40} glow={false} transparent />
          <span className="text-xl font-medium text-white tracking-tight">
            Quantro
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("solution")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-solution"
          >
            Solution
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-features"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("product")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-product"
          >
            Product
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
            data-testid="nav-pricing"
          >
            Pricing
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => {
              trackCTAClick("navbar");
              scrollToSection("early-access");
            }}
            className="btn-primary text-sm"
            data-testid="nav-cta"
          >
            Start Free Trial
          </button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("solution")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                Solution
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("product")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                Product
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-slate-400 hover:text-white transition-colors text-left py-2"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  trackCTAClick("mobile_menu");
                  scrollToSection("early-access");
                }}
                className="btn-primary text-sm w-full mt-2"
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Particle Background Component
const ParticleBackground = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="particle-container">
      {particles.map((i) => (
        <div key={i} className="particle" />
      ))}
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center hero-void-bg overflow-hidden"
      data-testid="hero-section"
    >
      <ParticleBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1C]/80 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-16 md:mb-20"
        >
          <HeroQuantroLogo />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-satoshi font-bold text-white text-5xl sm:text-7xl lg:text-[100px] leading-[1.05] tracking-tight mb-8 md:mb-10 text-glow-cyan headline-outline"
          data-testid="hero-headline"
        >
          Quantro runs your business.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-inter text-[#00F5FF] text-xl sm:text-2xl lg:text-[32px] font-medium leading-relaxed mb-8 md:mb-10 max-w-3xl mx-auto"
          data-testid="hero-subheadline"
        >
          From data to decisions to execution — automatically.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="text-white/60 text-base sm:text-lg lg:text-xl leading-relaxed mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          Data overload ends here. Just clear actions to grow your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <button
            onClick={() => {
              trackCTAClick("hero_waitlist");
              scrollToSection("early-access");
            }}
            className="btn-cyan min-w-[320px] md:min-w-[400px]"
            data-testid="hero-cta-waitlist"
          >
            Join the waitlist
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#00F5FF]/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-[#00F5FF]/50 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

// Problem Section
const ProblemSection = () => {
  const problems = [
    {
      icon: <BarChart3 className="text-blue-400" size={24} />,
      title: "Data Overload",
      description:
        "Drowning in dashboards, reports, and metrics. More data than you can ever act on."
    },
    {
      icon: <Clock className="text-blue-400" size={24} />,
      title: "Slow Consulting",
      description:
        "Waiting weeks for insights while opportunities slip away. Analysis paralysis is real."
    },
    {
      icon: <AlertCircle className="text-blue-400" size={24} />,
      title: "Gut Decisions",
      description:
        "Multi-million dollar choices made on intuition. Hope isn't a strategy."
    }
  ];

  return (
    <AnimatedSection className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            The Problem
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Businesses don't fail from lack of data.
          </h2>
          <p className="text-lg text-slate-400">
            They fail from the inability to turn that data into action—fast
            enough, smart enough, at scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 card-hover"
              data-testid={`problem-card-${i}`}
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                {problem.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                {problem.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Solution Section
const SolutionSection = () => {
  const solutionCards = [
    {
      icon: <Gauge className="text-blue-400" size={24} />,
      title: "Live Scorecard",
      description: "Real-time metrics that matter"
    },
    {
      icon: <Mountain className="text-emerald-400" size={24} />,
      title: "90-Day Rocks",
      description: "Strategic priorities at a glance"
    },
    {
      icon: <ListTodo className="text-blue-400" size={24} />,
      title: "Issues Tracker",
      description: "Surface and solve blockers fast"
    },
    {
      icon: <MessageSquare className="text-emerald-400" size={24} />,
      title: "AI Meeting Extractor",
      description: "Turn meetings into action items"
    }
  ];

  return (
    <AnimatedSection id="solution" className="py-24 px-6 relative">
      <div className="gradient-orb gradient-orb-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            The Solution
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            An OS that shows you exactly where to focus.
          </h2>
          <p className="text-lg text-slate-400">
            Quantro connects your operations, finances, and strategy in one
            place — then surfaces the insights and actions that actually move
            the needle.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl"
          data-testid="solution-cards"
        >
          {solutionCards.map((card, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 card-hover text-center"
              data-testid={`solution-card-${i}`}
            >
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mx-auto mb-4">
                {card.icon}
              </div>
              <h3 className="text-sm font-medium text-white mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500">{card.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Star Features Section
const StarFeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="text-blue-400" size={24} />,
      name: "Smart Yield",
      tagline: "Know where your money actually comes from.",
      description:
        "Quintile Matrix classifies every customer and product by revenue and margin — showing exactly which to grow, re-price, or cut.",
      accentColor: "blue"
    },
    {
      icon: <Grid3X3 className="text-emerald-400" size={24} />,
      name: "Quintile Matrix",
      tagline: "Your 5×5 value map.",
      description:
        "An interactive heatmap that reveals where 80% of your business value lives — and where the complexity is killing your margins.",
      accentColor: "green"
    },
    {
      icon: <Scissors className="text-blue-400" size={24} />,
      name: "Dirty Dozen",
      tagline: "12 tactics. One click.",
      description:
        "Apply proven simplification actions — eliminate low-margin products, set minimum orders, stop discounting B customers — directly to your workflow.",
      accentColor: "blue"
    },
    {
      icon: <Bot className="text-emerald-400" size={24} />,
      name: "EMS Coach AI",
      tagline: "Your 24/7 strategic consultant.",
      description:
        'Ask "What should I eliminate this month?" or "How do I improve Quad 2 margins?" — and get answers grounded in your actual business data.',
      accentColor: "green"
    }
  ];

  return (
    <AnimatedSection id="features" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Star Features
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Tools that drive real decisions.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 card-hover"
              data-testid={`star-feature-${i}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    feature.accentColor === "blue"
                      ? "bg-blue-500/10"
                      : "bg-emerald-500/10"
                  }`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">
                    {feature.name}
                  </h3>
                  <p
                    className={`text-sm font-medium mb-2 ${
                      feature.accentColor === "blue"
                        ? "text-blue-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {feature.tagline}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Capabilities Section
const CapabilitiesSection = () => {
  const capabilities = [
    {
      icon: <LineChart className="text-blue-400" size={24} />,
      title: "See what matters",
      description:
        "Cut through noise to surface the metrics that actually drive your business.",
      tag: "Scorecard"
    },
    {
      icon: <Brain className="text-blue-400" size={24} />,
      title: "Know what to do",
      description:
        "AI-generated action plans ranked by impact, risk, and feasibility.",
      tag: "Decision AI"
    },
    {
      icon: <Layers className="text-blue-400" size={24} />,
      title: "Simulate before acting",
      description:
        "Model outcomes across scenarios before committing resources.",
      tag: "Scenario Lab"
    },
    {
      icon: <Target className="text-emerald-400" size={24} />,
      title: "Focus with confidence",
      description:
        "Clear priorities and insights to guide your team's decisions.",
      tag: "Clarity Engine"
    }
  ];

  return (
    <AnimatedSection className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Built for clarity and action.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 card-hover group"
              data-testid={`capability-card-${i}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                  {cap.icon}
                </div>
                <span className="text-xs font-mono text-slate-600 px-2 py-1 bg-slate-800/50 rounded">
                  {cap.tag}
                </span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                {cap.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Product Preview Section
const ProductPreviewSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = {
    0: {
      kpis: [
        { label: "Monthly Revenue", value: "$847.2K", change: "+12.4%", positive: true },
        { label: "Gross Margin", value: "67.3%", change: "+2.1%", positive: true },
        { label: "Cash Runway", value: "18 mo", change: "-2 mo", positive: false },
        { label: "Burn Multiple", value: "1.2x", change: "+0.3x", positive: false }
      ],
      actions: [
        { priority: "high", action: "Renegotiate AWS contract", impact: "+$24K/yr" },
        { priority: "high", action: "Convert 12 trial users", impact: "+$8.4K MRR" },
        { priority: "medium", action: "Optimize ad spend in APAC", impact: "+31% ROI" },
        { priority: "low", action: "Update payment terms", impact: "+5 days DSO" }
      ]
    },
    1: {
      kpis: [
        { label: "Total Revenue", value: "$2.4M", change: "+18.2%", positive: true },
        { label: "Net Margin", value: "42.1%", change: "+3.8%", positive: true },
        { label: "EBITDA", value: "$892K", change: "+22.4%", positive: true },
        { label: "DSO", value: "34 days", change: "-5 days", positive: true }
      ],
      actions: [
        { priority: "high", action: "Review Q4 budget allocation", impact: "+$42K savings" },
        { priority: "medium", action: "Accelerate AR collection", impact: "-8 days DSO" },
        { priority: "medium", action: "Renegotiate vendor terms", impact: "+$18K/yr" },
        { priority: "low", action: "Update expense categories", impact: "Better tracking" }
      ]
    },
    2: {
      kpis: [
        { label: "Team Velocity", value: "94%", change: "+6.2%", positive: true },
        { label: "Avg Cycle Time", value: "4.2 days", change: "-1.1 days", positive: true },
        { label: "Support SLA", value: "98.4%", change: "+0.8%", positive: true },
        { label: "Open Issues", value: "23", change: "+5", positive: false }
      ],
      actions: [
        { priority: "high", action: "Resolve P1 customer issue", impact: "Retention risk" },
        { priority: "high", action: "Complete Q4 hiring plan", impact: "+3 engineers" },
        { priority: "medium", action: "Update runbooks", impact: "-15min MTTR" },
        { priority: "low", action: "Schedule team retro", impact: "Team health" }
      ]
    },
    3: {
      kpis: [
        { label: "New MRR", value: "$48.2K", change: "+24.1%", positive: true },
        { label: "Churn Rate", value: "2.1%", change: "-0.4%", positive: true },
        { label: "NPS Score", value: "72", change: "+8", positive: true },
        { label: "Trial Conv.", value: "18.4%", change: "+2.1%", positive: true }
      ],
      actions: [
        { priority: "high", action: "Launch enterprise campaign", impact: "+$120K pipeline" },
        { priority: "high", action: "Onboard 5 enterprise leads", impact: "+$35K MRR" },
        { priority: "medium", action: "Improve onboarding flow", impact: "+3% conversion" },
        { priority: "low", action: "Update case studies", impact: "Social proof" }
      ]
    },
    4: {
      kpis: [
        { label: "Best Case", value: "$3.2M", change: "+42%", positive: true },
        { label: "Base Case", value: "$2.6M", change: "+18%", positive: true },
        { label: "Conservative", value: "$2.1M", change: "+8%", positive: true },
        { label: "Risk Score", value: "Low", change: "Stable", positive: true }
      ],
      actions: [
        { priority: "high", action: "Model price increase impact", impact: "+$180K ARR" },
        { priority: "medium", action: "Simulate churn scenario", impact: "Risk analysis" },
        { priority: "medium", action: "Test expansion revenue", impact: "+$95K potential" },
        { priority: "low", action: "Update assumptions", impact: "Accuracy" }
      ]
    }
  };

  const tabs = ["Overview", "Financials", "Operations", "Growth", "Scenarios"];
  const currentData = tabData[activeTab];

  const taskItems = [
    { status: "running", name: "Generating Q4 forecast", progress: 67 },
    { status: "queued", name: "Updating margin analysis", progress: 0 },
    { status: "completed", name: "Customer segment report", progress: 100 }
  ];

  const heatmapLabels = ["Revenue", "Margin", "OKRs", "Cash"];
  const weekLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];

  const heatmapData = [
    [0.85, 0.72, 0.88, 0.65, 0.78, 0.92, 0.71],
    [0.45, 0.52, 0.38, 0.61, 0.55, 0.48, 0.42],
    [0.92, 0.88, 0.75, 0.82, 0.95, 0.78, 0.89],
    [0.25, 0.35, 0.42, 0.28, 0.55, 0.62, 0.48]
  ];

  const getHeatmapColor = (val) => {
    if (val >= 0.8) return "#10B981";
    if (val >= 0.6) return "#22D3EE";
    if (val >= 0.4) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <AnimatedSection id="product" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Product
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Live Business Snapshot
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to understand and run your business—in one intelligent interface.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="dashboard-window overflow-hidden"
          data-testid="product-preview"
        >
          <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QuantroLogoMark size={32} glow={false} transparent />
              <span className="font-medium text-white">Business OS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 min-h-[500px]">
            <div className="dashboard-sidebar p-4 hidden lg:block">
              <div className="space-y-2">
                {tabs.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all duration-200 ${
                      i === activeTab
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                    }`}
                    data-testid={`tab-${item.toLowerCase()}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 p-6 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {currentData.kpis.map((kpi, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 kpi-card"
                    data-testid={`kpi-card-${i}`}
                  >
                    <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                    <div className="font-mono text-xl text-white">{kpi.value}</div>
                    <div
                      className={`text-xs flex items-center gap-1 mt-1 ${
                        kpi.positive ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {kpi.positive ? <TrendingUp size={12} /> : <AlertCircle size={12} />}
                      {kpi.change}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="text-sm font-medium text-white mb-4">
                    Performance Heatmap
                  </div>

                  <div className="flex mb-2">
                    <div className="w-16" />
                    {weekLabels.map((week, j) => (
                      <div key={j} className="flex-1 text-center text-xs text-slate-500">
                        {week}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    {heatmapData.map((row, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-16 text-xs text-slate-500 pr-2 text-right">
                          {heatmapLabels[i]}
                        </div>
                        {row.map((val, j) => (
                          <div
                            key={j}
                            className="flex-1 h-8 rounded-sm transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: getHeatmapColor(val) }}
                            title={`${heatmapLabels[i]} - ${weekLabels[j]}: ${Math.round(
                              val * 100
                            )}%`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-red-500" /> Poor
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-amber-500" /> Warning
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-cyan-400" /> Good
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Excellent
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="text-sm font-medium text-white mb-4">
                    Suggested Actions
                  </div>
                  <div className="space-y-3">
                    {currentData.actions.map((item, i) => (
                      <div
                        key={i}
                        className="action-item flex items-center justify-between p-2 rounded cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.priority === "high"
                                ? "bg-red-400"
                                : item.priority === "medium"
                                ? "bg-amber-400"
                                : "bg-slate-500"
                            }`}
                          />
                          <span className="text-sm text-slate-300">{item.action}</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400">
                          {item.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-white">Task Queue</div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    3 Active
                  </span>
                </div>
                <div className="space-y-3">
                  {taskItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.status === "completed"
                            ? "bg-emerald-500/20"
                            : item.status === "running"
                            ? "bg-blue-500/20"
                            : "bg-slate-700"
                        }`}
                      >
                        {item.status === "completed" ? (
                          <Check className="text-emerald-400" size={12} />
                        ) : item.status === "running" ? (
                          <Play className="text-blue-400" size={12} />
                        ) : (
                          <Clock className="text-slate-500" size={12} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-300">{item.name}</span>
                          <span className="text-xs text-slate-500">{item.progress}%</span>
                        </div>
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              item.status === "completed" ? "bg-emerald-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Differentiation Section
const DifferentiationSection = () => {
  const features = [
    "Data aggregation",
    "Real-time analytics",
    "AI recommendations",
    "Scenario modeling",
    "Decision support",
    "Continuous learning"
  ];

  const comparisons = {
    traditional: [true, false, false, false, false, false],
    point: [true, true, true, false, false, false],
    quantro: [true, true, true, true, true, true]
  };

  return (
    <AnimatedSection className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Why Quantro
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Not another dashboard.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp} className="overflow-x-auto" data-testid="comparison-table">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div />
              <div className="text-center text-sm text-slate-400 font-medium p-4">
                Traditional BI
              </div>
              <div className="text-center text-sm text-slate-400 font-medium p-4">
                Point Solutions
              </div>
              <div className="comparison-highlight text-center text-sm text-blue-400 font-medium p-4 rounded-t-lg">
                Quantro OS
              </div>
            </div>

            {features.map((feature, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 border-b border-slate-800/50 py-4">
                <div className="text-sm text-slate-300 px-4">{feature}</div>
                <div className="text-center">
                  {comparisons.traditional[i] ? (
                    <Check className="inline text-slate-600" size={18} />
                  ) : (
                    <X className="inline text-slate-700" size={18} />
                  )}
                </div>
                <div className="text-center">
                  {comparisons.point[i] ? (
                    <Check className="inline text-slate-600" size={18} />
                  ) : (
                    <X className="inline text-slate-700" size={18} />
                  )}
                </div>
                <div className="comparison-highlight text-center">
                  <Check className="inline text-emerald-400" size={18} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Pricing Section
const PricingSection = () => {
  const tiers = [
  {
    name: "Starter",
    price: "$59",
    period: "",
    description: "For solo operators and small teams.",
    features: [
    "Scorecard",
    "Rocks (90-day priorities)",
    "Issues Tracker",
    "To-Dos",
    "Full Accounting Integration"],

    highlighted: false
  },
  {
    name: "Pro",
    price: "$299",
    period: "",
    description: "For growing teams.",
    features: [
    "Everything in Starter",
    "Org Chart",
    "AI Meeting Extractor",
    "AI Agents",
    "Priority Support"],

    highlighted: true
  },
  {
    name: "Enterprise",
    price: "$599+",
    period: "",
    description: "For scaling businesses.",
    features: [
    "Everything in Pro",
    "Smart Yield",
    "Lean Analysis",
    "Multi-user (5 seats)",
    "Dedicated Success Manager"],

    highlighted: false
  }];



  return (
    <AnimatedSection id="pricing" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">Pricing</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Invest in outcomes, not tools.
          </h2>
          <p className="text-lg text-slate-400">
            Simple, transparent pricing that scales with your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) =>
          <motion.div
            key={i}
            variants={fadeInUp}
            className={`rounded-xl p-8 ${
            tier.highlighted ?
            "pricing-highlight bg-slate-900 border-2 border-blue-500/30" :
            "bg-slate-900/50 border border-slate-800"}`
            }
            data-testid={`pricing-tier-${i}`}>

              {tier.highlighted &&
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full mb-4">
                  Most Popular
                </span>
            }
              <h3 className="text-xl font-medium text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-mono text-4xl text-white">{tier.price}</span>
                <span className="text-slate-500">{tier.period}</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">{tier.description}</p>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) =>
              <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="text-emerald-400 flex-shrink-0" size={16} />
                    {feature}
                  </li>
              )}
              </ul>

              <button className={`w-full py-3 rounded-full font-medium transition-colors ${
            tier.highlighted ?
            "bg-blue-600 text-white hover:bg-blue-500" :
            "bg-slate-800 text-white hover:bg-slate-700"}`
            }>
                {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedSection>);

};

// Final CTA Section
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FinalCTASection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    // Track CTA click
    trackCTAClick('footer_form');
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/early-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.detail || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedSection id="early-access" className="py-32 px-6 relative">
      <div className="gradient-orb gradient-orb-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
      
      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div variants={fadeInUp}>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6" data-testid="final-cta-headline">
            Stop analyzing.<br />
            <span className="gradient-text">Start executing.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join thousands of businesses using Quantro to gain clarity and make better decisions.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          {!submitted ?
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" data-testid="early-access-form">
              <Input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 h-12 px-4 rounded-full focus:border-blue-500 focus:ring-blue-500/20"
              required
              disabled={loading}
              data-testid="email-input" />

              <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 h-12 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-button">

                {loading ? "Submitting..." : "Start Free Trial"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form> :

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 max-w-md mx-auto" data-testid="success-message">
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <Check size={24} />
                <span className="text-lg font-medium">You're on the list!</span>
              </div>
              <p className="text-slate-400 mt-2 text-sm">We'll be in touch soon with your free trial access.</p>
            </div>
          }
          {error &&
          <div className="mt-4 text-red-400 text-sm text-center" data-testid="error-message">
              {error}
            </div>
          }
        </motion.div>
      </div>
    </AnimatedSection>);

};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-slate-800" data-testid="footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#0A0F1C] border border-[#00F5FF]/30 flex items-center justify-center">
            <span className="font-satoshi font-bold text-sm text-[#00F5FF]">Q</span>
          </div>
          <span className="text-lg font-medium text-white">Quantro</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>

        <div className="text-sm text-slate-600">
          © 2026 Quantro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

// ========== NEW SECTIONS FOR QUANTRO FLOW ==========

// Hero Transition Section (Two Systems)
const HeroTransitionSection = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatedSection className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#00F5FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#A020FF]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2
          variants={fadeInUp}
          className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-8"
        >
          Un sistema para entender tu negocio.
          <br />
          <span className="text-[#00F5FF]">Otro para operarlo.</span>
        </motion.h2>
        
        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          <span className="text-white">Quantro OS</span> analiza tu negocio, detecta oportunidades y propone acciones. 
          <span className="text-[#A020FF]"> Quantro Flow</span> responde y da seguimiento automáticamente en tu operación diaria, liberando tu carga de trabajo.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              trackCTAClick('explore_quantro');
              scrollToSection("product-comparison");
            }}
            className="btn-cyan"
            data-testid="cta-explore"
          >
            Explorar Quantro
          </button>
          <button
            onClick={() => scrollToSection("morning-snapshot")}
            className="px-8 py-4 rounded-xl border border-slate-600 text-white font-medium hover:border-[#00F5FF]/50 hover:bg-[#00F5FF]/5 transition-all"
            data-testid="cta-how-it-works"
          >
            Ver cómo funciona
          </button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Product Comparison Section (Side by Side)
const ProductComparisonSection = () => {
  return (
    <AnimatedSection id="product-comparison" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quantro OS Card */}
          <motion.div
            variants={fadeInUp}
            className="product-card-os rounded-2xl p-8 md:p-10 transition-all duration-300"
            data-testid="product-card-os"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center">
                <Brain className="text-[#00F5FF]" size={24} />
              </div>
              <div>
                <h3 className="font-satoshi font-bold text-2xl text-white">Quantro OS</h3>
                <p className="text-[#00F5FF] text-sm font-medium">Te da claridad</p>
              </div>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#00F5FF]" />
                Entiende tu negocio
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#00F5FF]" />
                Detecta oportunidades
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#00F5FF]" />
                Propone acciones
              </li>
            </ul>
          </motion.div>

          {/* Quantro Flow Card */}
          <motion.div
            variants={fadeInUp}
            className="product-card-flow rounded-2xl p-8 md:p-10 transition-all duration-300"
            data-testid="product-card-flow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#A020FF]/10 border border-[#A020FF]/30 flex items-center justify-center">
                <Zap className="text-[#A020FF]" size={24} />
              </div>
              <div>
                <h3 className="font-satoshi font-bold text-2xl text-white">Quantro Flow</h3>
                <p className="text-[#A020FF] text-sm font-medium">Hace que todo avance</p>
              </div>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#A020FF]" />
                Responde
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#A020FF]" />
                Organiza
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-[#A020FF]" />
                Da seguimiento
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Better Together Section
const BetterTogetherSection = () => {
  const benefits = [
    { trigger: "Detectas oportunidades", result: "se ejecutan automáticamente" },
    { trigger: "Defines prioridades", result: "se convierten en seguimiento real" },
    { trigger: "Tomas decisiones", result: "impactan la operación sin fricción" }
  ];

  return (
    <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-transparent via-[#0A0F1C]/50 to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          variants={fadeInUp}
          className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6"
        >
          Mejor juntos
        </motion.h2>
        
        <motion.p
          variants={fadeInUp}
          className="text-lg text-slate-400 max-w-2xl mx-auto mb-12"
        >
          <span className="text-[#00F5FF]">Quantro OS</span> te da claridad y dirección. 
          <span className="text-[#A020FF]"> Quantro Flow</span> convierte esas decisiones en acciones reales dentro de tu operación diaria.
        </motion.p>

        <motion.div variants={fadeInUp} className="space-y-4">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-4 text-left bg-slate-900/30 border border-slate-800 rounded-xl px-6 py-4 max-w-xl mx-auto"
            >
              <span className="text-[#00F5FF] font-medium">{item.trigger}</span>
              <ArrowRight className="text-slate-600 flex-shrink-0" size={20} />
              <span className="text-[#A020FF]">{item.result}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Quantro Intelligence Section
const QuantroIntelligenceSection = () => {
  const capabilities = [
    "Tendencias actuales y futuras",
    "Dónde tienes oportunidad",
    "Qué priorizar primero",
    "Qué hacer a continuación"
  ];

  return (
    <AnimatedSection className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp}>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#00F5FF] mb-4 block">
              Quantro Intelligence
            </span>
            <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
              Tu negocio sigue avanzando mientras duermes.
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Quantro Intelligence analiza tu mercado y te propone acciones listas para avanzar cada día.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {capabilities.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="text-[#00F5FF]" size={16} />
                  </div>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/10 to-[#A020FF]/10 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900/80 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-[#00F5FF]" size={20} />
                <span className="text-white font-medium">Análisis de hoy</span>
                <span className="text-xs text-slate-500 ml-auto">hace 4 min</span>
              </div>
              <div className="space-y-3">
                <div className="bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-lg p-3">
                  <p className="text-sm text-slate-300">📈 Oportunidad: El segmento Enterprise creció 23% este mes</p>
                </div>
                <div className="bg-[#A020FF]/5 border border-[#A020FF]/20 rounded-lg p-3">
                  <p className="text-sm text-slate-300">⚡ Acción: Enviar propuesta a 5 leads calificados</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-sm text-slate-300">✅ Prioridad: Cerrar renovación con cliente clave</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Morning Snapshot Section
// Morning Snapshot Section - Interactive Demo
const MorningSnapshotSection = () => {
  const { t } = useLanguage();

  return (
    <AnimatedSection id="morning-snapshot" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            {t('morning.title')}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t('morning.subtitle')}
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <QuantroMorningDemo mode="demo" />
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Success Stories Section
const SuccessStoriesSection = () => {
  const stories = [
    {
      title: "De caos operativo a control total",
      quote: "Ahora cada lead tiene seguimiento automático y el equipo sabe qué hacer cada día.",
      metric: "+40%",
      metricLabel: "conversión"
    },
    {
      title: "Decisiones más rápidas, sin juntas eternas",
      quote: "Pasaron de analizar datos manualmente a recibir acciones claras cada mañana.",
      metric: "4x",
      metricLabel: "más rápido"
    },
    {
      title: "Su operación sigue, incluso cuando no están",
      quote: "Por primera vez siento que mi empresa trabaja para mí, no al revés. Identifiqué que el 30% de mis proyectos consumían el 70% del tiempo y además no generaban utilidad.",
      metric: "30%",
      metricLabel: "ahorro de tiempo"
    }
  ];

  return (
    <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-[#0A0F1C]/50 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">
            Casos de éxito
          </span>
          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
            Lo que ya están logrando nuestros clientes
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="success-card"
              data-testid={`success-story-${i}`}
            >
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-[#00F5FF]">{story.metric}</span>
                <span className="text-sm text-slate-500">{story.metricLabel}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{story.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">"{story.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Main App Component
// App Content Component
function AppContent() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      <Navbar />
      <HeroSection />
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