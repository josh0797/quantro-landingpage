import React, { useState, useEffect, useRef } from "react";
import "@/App.css";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  TrendingUp,
  Zap,
  Target,
  LineChart,
  Shield,
  Play,
  AlertCircle,
  Activity,
  BarChart3,
  Brain,
  Cpu,
  Layers,
  Clock,
  Users,
  DollarSign,
  Percent,
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
  Bot
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Animated Section Wrapper
const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}>

      {children}
    </motion.section>);

};

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
      scrolled ? "glass-nav py-3" : "py-5"}`
      }
      data-testid="navbar">

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2" data-testid="logo">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
            <span className="font-serif text-xl text-white">Q</span>
          </div>
          <span className="text-xl font-medium text-white">Quantro</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("solution")} className="text-slate-400 hover:text-white transition-colors text-sm" data-testid="nav-solution">Solution</button>
          <button onClick={() => scrollToSection("features")} className="text-slate-400 hover:text-white transition-colors text-sm" data-testid="nav-features">Features</button>
          <button onClick={() => scrollToSection("product")} className="text-slate-400 hover:text-white transition-colors text-sm" data-testid="nav-product">Product</button>
          <button onClick={() => scrollToSection("pricing")} className="text-slate-400 hover:text-white transition-colors text-sm" data-testid="nav-pricing">Pricing</button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => scrollToSection("early-access")} className="btn-primary text-sm" data-testid="nav-cta">
            Start Free Trial
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle">

          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-nav border-t border-white/5">

            <div className="px-6 py-4 flex flex-col gap-4">
              <button onClick={() => scrollToSection("solution")} className="text-slate-400 hover:text-white transition-colors text-left py-2">Solution</button>
              <button onClick={() => scrollToSection("features")} className="text-slate-400 hover:text-white transition-colors text-left py-2">Features</button>
              <button onClick={() => scrollToSection("product")} className="text-slate-400 hover:text-white transition-colors text-left py-2">Product</button>
              <button onClick={() => scrollToSection("pricing")} className="text-slate-400 hover:text-white transition-colors text-left py-2">Pricing</button>
              <button onClick={() => scrollToSection("early-access")} className="btn-primary text-sm w-full mt-2">Start Free Trial</button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

};

// Hero Section
const HeroSection = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: "+34%", label: "Margin Improvement" },
    { value: "4.2x", label: "Faster Decisions" },
    { value: "89%", label: "Less Meeting Follow-up" }
  ];

  const scorecardMetrics = [
    { label: "Revenue Growth", status: "green" },
    { label: "Cash Flow", status: "yellow" },
    { label: "Customer Retention", status: "green" }
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden" data-testid="hero-section">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg grid-mask opacity-60" />
      
      {/* Gradient Orbs */}
      <div className="gradient-orb gradient-orb-blue absolute top-1/4 -left-32" />
      <div className="gradient-orb gradient-orb-green absolute bottom-1/4 -right-32" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Business Operating System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6"
            data-testid="hero-headline">
            Your business.<br />
            <span className="gradient-text">Finally, clarity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-400 max-w-xl mb-8 leading-relaxed"
            data-testid="hero-subheadline">
            Quantro is the operating system for your business. Track what matters, identify where your value is, and let AI tell you exactly what to do next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => scrollToSection("early-access")}
              className="btn-primary flex items-center gap-2"
              data-testid="hero-cta-early-access">
              Start Free Trial
              <ArrowRight size={16} />
            </button>
            <a
              href="#investor-deck"
              download
              className="btn-secondary flex items-center gap-2"
              data-testid="hero-cta-investor-deck">
              <Download size={16} />
              View Investor Deck
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-left" data-testid={`hero-stat-${i}`}>
                <div className="font-mono text-2xl text-white font-medium">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Scorecard Widget */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="hidden lg:block">
          <div className="relative">
            <div className="dashboard-window p-6 glow-blue">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Gauge className="text-blue-400" size={20} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Business Scorecard</div>
                  <div className="text-xs text-slate-500">Updated 2s ago</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-1">Revenue</div>
                  <div className="font-mono text-xl text-white">$847.2K</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> +12.4%
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-1">Gross Margin</div>
                  <div className="font-mono text-xl text-white">67.3%</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> +2.1%
                  </div>
                </div>
              </div>

              {/* Scorecard Status Widget */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">Key Metrics Status</div>
                <div className="space-y-2">
                  {scorecardMetrics.map((metric, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{metric.label}</span>
                      <span className={`w-3 h-3 rounded-full ${
                        metric.status === "green" ? "bg-emerald-400" :
                        metric.status === "yellow" ? "bg-amber-400" : "bg-red-400"
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Insight Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-8 -left-8 bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Brain className="text-blue-400" size={14} />
                </div>
                <div>
                  <div className="text-sm text-white">AI Recommendation</div>
                  <div className="text-xs text-slate-500">Focus on Quad 2 margins</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Problem Section
const ProblemSection = () => {
  const problems = [
  {
    icon: <BarChart3 className="text-blue-400" size={24} />,
    title: "Data Overload",
    description: "Drowning in dashboards, reports, and metrics. More data than you can ever act on."
  },
  {
    icon: <Clock className="text-blue-400" size={24} />,
    title: "Slow Consulting",
    description: "Waiting weeks for insights while opportunities slip away. Analysis paralysis is real."
  },
  {
    icon: <AlertCircle className="text-blue-400" size={24} />,
    title: "Gut Decisions",
    description: "Multi-million dollar choices made on intuition. Hope isn't a strategy."
  }];


  return (
    <AnimatedSection className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">The Problem</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Businesses don't fail from lack of data.
          </h2>
          <p className="text-lg text-slate-400">
            They fail from the inability to turn that data into action—fast enough, smart enough, at scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) =>
          <motion.div
            key={i}
            variants={fadeInUp}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 card-hover"
            data-testid={`problem-card-${i}`}>

              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                {problem.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{problem.title}</h3>
              <p className="text-slate-400 leading-relaxed">{problem.description}</p>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedSection>);

};

// Solution Section with Feature Cards
const SolutionSection = () => {
  const solutionCards = [
    { icon: <Gauge className="text-blue-400" size={24} />, title: "Live Scorecard", description: "Real-time metrics that matter" },
    { icon: <Mountain className="text-emerald-400" size={24} />, title: "90-Day Rocks", description: "Strategic priorities at a glance" },
    { icon: <ListTodo className="text-blue-400" size={24} />, title: "Issues Tracker", description: "Surface and solve blockers fast" },
    { icon: <MessageSquare className="text-emerald-400" size={24} />, title: "AI Meeting Extractor", description: "Turn meetings into action items" }
  ];

  return (
    <AnimatedSection id="solution" className="py-24 px-6 relative">
      <div className="gradient-orb gradient-orb-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">The Solution</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            An OS that shows you exactly where to focus.
          </h2>
          <p className="text-lg text-slate-400">
            Quantro connects your operations, finances, and strategy in one place — then surfaces the insights and actions that actually move the needle.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl" data-testid="solution-cards">
          {solutionCards.map((card, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 card-hover text-center"
              data-testid={`solution-card-${i}`}>
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mx-auto mb-4">
                {card.icon}
              </div>
              <h3 className="text-sm font-medium text-white mb-1">{card.title}</h3>
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
      description: "Quintile Matrix classifies every customer and product by revenue and margin — showing exactly which to grow, re-price, or cut.",
      accentColor: "blue"
    },
    {
      icon: <Grid3X3 className="text-emerald-400" size={24} />,
      name: "Quintile Matrix",
      tagline: "Your 5×5 value map.",
      description: "An interactive heatmap that reveals where 80% of your business value lives — and where the complexity is killing your margins.",
      accentColor: "green"
    },
    {
      icon: <Scissors className="text-blue-400" size={24} />,
      name: "Dirty Dozen",
      tagline: "12 tactics. One click.",
      description: "Apply proven simplification actions — eliminate low-margin products, set minimum orders, stop discounting B customers — directly to your workflow.",
      accentColor: "blue"
    },
    {
      icon: <Bot className="text-emerald-400" size={24} />,
      name: "EMS Coach AI",
      tagline: "Your 24/7 strategic consultant.",
      description: "Ask \"What should I eliminate this month?\" or \"How do I improve Quad 2 margins?\" — and get answers grounded in your actual business data.",
      accentColor: "green"
    }
  ];

  return (
    <AnimatedSection id="features" className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">Star Features</span>
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
              data-testid={`star-feature-${i}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  feature.accentColor === "blue" ? "bg-blue-500/10" : "bg-emerald-500/10"
                }`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">{feature.name}</h3>
                  <p className={`text-sm font-medium mb-2 ${
                    feature.accentColor === "blue" ? "text-blue-400" : "text-emerald-400"
                  }`}>{feature.tagline}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
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
      description: "Cut through noise to surface the metrics that actually drive your business.",
      tag: "Scorecard"
    },
    {
      icon: <Brain className="text-blue-400" size={24} />,
      title: "Know what to do",
      description: "AI-generated action plans ranked by impact, risk, and feasibility.",
      tag: "Decision AI"
    },
    {
      icon: <Layers className="text-blue-400" size={24} />,
      title: "Simulate before acting",
      description: "Model outcomes across scenarios before committing resources.",
      tag: "Scenario Lab"
    },
    {
      icon: <Target className="text-emerald-400" size={24} />,
      title: "Focus with confidence",
      description: "Clear priorities and insights to guide your team's decisions.",
      tag: "Clarity Engine"
    }
  ];


  return (
    <AnimatedSection className="py-24 px-6 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">Capabilities</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Built for clarity and action.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) =>
          <motion.div
            key={i}
            variants={fadeInUp}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 card-hover group"
            data-testid={`capability-card-${i}`}>

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                  {cap.icon}
                </div>
                <span className="text-xs font-mono text-slate-600 px-2 py-1 bg-slate-800/50 rounded">{cap.tag}</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{cap.title}</h3>
              <p className="text-slate-400 leading-relaxed">{cap.description}</p>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedSection>);

};

// Product Preview Section
const ProductPreviewSection = () => {
  const kpis = [
  { label: "Monthly Revenue", value: "$847.2K", change: "+12.4%", positive: true },
  { label: "Gross Margin", value: "67.3%", change: "+2.1%", positive: true },
  { label: "Cash Runway", value: "18 mo", change: "-2 mo", positive: false },
  { label: "Burn Multiple", value: "1.2x", change: "+0.3x", positive: false }];


  const actions = [
  { priority: "high", action: "Renegotiate AWS contract", impact: "+$24K/yr" },
  { priority: "high", action: "Convert 12 trial users", impact: "+$8.4K MRR" },
  { priority: "medium", action: "Optimize ad spend in APAC", impact: "+31% ROI" },
  { priority: "low", action: "Update payment terms", impact: "+5 days DSO" }];


  const taskItems = [
    { status: "running", name: "Generating Q4 forecast", progress: 67 },
    { status: "queued", name: "Updating margin analysis", progress: 0 },
    { status: "completed", name: "Customer segment report", progress: 100 }
  ];


  // Generate heatmap data
  const heatmapData = Array(7).fill(null).map(() =>
  Array(12).fill(null).map(() => Math.random())
  );

  return (
    <AnimatedSection id="product" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">Product</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Live Business Snapshot
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to understand and run your business—in one intelligent interface.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="dashboard-window overflow-hidden" data-testid="product-preview">
          {/* Dashboard Header */}
          <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="font-serif text-sm text-white">Q</span>
              </div>
              <span className="font-medium text-white">Business OS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 min-h-[500px]">
            {/* Sidebar */}
            <div className="dashboard-sidebar p-4 hidden lg:block">
              <div className="space-y-2">
                {["Overview", "Financials", "Operations", "Growth", "Scenarios"].map((item, i) =>
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  i === 0 ? "bg-blue-500/10 text-blue-400" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"}`
                  }>

                    {item}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 p-6 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) =>
                <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 kpi-card" data-testid={`kpi-card-${i}`}>
                    <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
                    <div className="font-mono text-xl text-white">{kpi.value}</div>
                    <div className={`text-xs flex items-center gap-1 mt-1 ${kpi.positive ? "text-emerald-400" : "text-amber-400"}`}>
                      {kpi.positive ? <TrendingUp size={12} /> : <AlertCircle size={12} />}
                      {kpi.change}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Heatmap */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="text-sm font-medium text-white mb-4">Performance Heatmap</div>
                  <div className="space-y-1">
                    {heatmapData.map((row, i) =>
                    <div key={i} className="flex gap-1">
                        {row.map((val, j) =>
                      <div
                        key={j}
                        className="heatmap-cell"
                        style={{
                          backgroundColor: val > 0.7 ? "#10B981" : val > 0.4 ? "#2563EB" : val > 0.2 ? "#1E40AF" : "#1E293B",
                          opacity: 0.3 + val * 0.7
                        }} />

                      )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-slate-500">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Suggested Actions */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="text-sm font-medium text-white mb-4">Suggested Actions</div>
                  <div className="space-y-3">
                    {actions.map((item, i) =>
                    <div key={i} className="action-item flex items-center justify-between p-2 rounded cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                        item.priority === "high" ? "bg-red-400" :
                        item.priority === "medium" ? "bg-amber-400" : "bg-slate-500"}`
                        } />
                          <span className="text-sm text-slate-300">{item.action}</span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400">{item.impact}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Queue Panel */}
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
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === "completed" ? "bg-emerald-500/20" :
                        item.status === "running" ? "bg-blue-500/20" : "bg-slate-700"
                      }`}>
                        {item.status === "completed" ? <Check className="text-emerald-400" size={12} /> :
                         item.status === "running" ? <Play className="text-blue-400" size={12} /> :
                         <Clock className="text-slate-500" size={12} />}
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
    </AnimatedSection>);

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
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">Why Quantro</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            Not another dashboard.
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp} className="overflow-x-auto" data-testid="comparison-table">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div></div>
              <div className="text-center text-sm text-slate-400 font-medium p-4">Traditional BI</div>
              <div className="text-center text-sm text-slate-400 font-medium p-4">Point Solutions</div>
              <div className="comparison-highlight text-center text-sm text-blue-400 font-medium p-4 rounded-t-lg">Quantro OS</div>
            </div>

            {features.map((feature, i) =>
            <div key={i} className="grid grid-cols-4 gap-4 border-b border-slate-800/50 py-4">
                <div className="text-sm text-slate-300 px-4">{feature}</div>
                <div className="text-center">
                  {comparisons.traditional[i] ?
                <Check className="inline text-slate-600" size={18} /> :
                <X className="inline text-slate-700" size={18} />}
                </div>
                <div className="text-center">
                  {comparisons.point[i] ?
                <Check className="inline text-slate-600" size={18} /> :
                <X className="inline text-slate-700" size={18} />}
                </div>
                <div className="comparison-highlight text-center">
                  <Check className="inline text-emerald-400" size={18} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>);

};

// Investor Section
const InvestorSection = () => {
  const metrics = [
  { label: "TAM", value: "$2.2B", description: "Total Addressable Market" },
  { label: "SAM", value: "$590M", description: "Serviceable Market" },
  { label: "Target ARR", value: "$50M", description: "Year 3 Revenue Goal" },
  { label: "NRR", value: "135%", description: "Net Revenue Retention" }];


  const timeline = [
  { phase: "Phase 1", title: "Foundation", items: ["Core analytics engine", "Decision AI v1", "10 beta customers"] },
  { phase: "Phase 2", title: "Scale", items: ["Autonomous execution", "Industry verticals", "100 customers"] },
  { phase: "Phase 3", title: "Expand", items: ["Full automation suite", "Enterprise tier", "Global expansion"] }];


  return (
    <AnimatedSection id="investors" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500 mb-4 block">For Investors</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            The future of business operations.
          </h2>
          <p className="text-lg text-slate-400">
            We're building the infrastructure layer for autonomous business management.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, i) =>
          <div key={i} className="text-left" data-testid={`investor-metric-${i}`}>
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-slate-600 block mb-2">{metric.label}</span>
              <div className="font-mono text-4xl lg:text-5xl text-white mb-1">{metric.value}</div>
              <span className="text-sm text-slate-500">{metric.description}</span>
            </div>
          )}
        </motion.div>

        {/* Roadmap */}
        <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
          {timeline.map((phase, i) =>
          <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 card-hover" data-testid={`roadmap-phase-${i}`}>
              <span className="text-xs font-mono text-blue-400 mb-2 block">{phase.phase}</span>
              <h3 className="text-xl font-medium text-white mb-4">{phase.title}</h3>
              <ul className="space-y-2">
                {phase.items.map((item, j) =>
              <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                    <ChevronRight className="text-slate-600" size={14} />
                    {item}
                  </li>
              )}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatedSection>);

};

// Pricing Section
const PricingSection = () => {
  const tiers = [
    {
      name: "Starter",
      price: "Starting at $599",
      period: "",
      description: "For solo operators and small teams.",
      features: [
        "Scorecard",
        "Rocks (90-day priorities)",
        "Issues Tracker",
        "To-Dos",
        "Full Accounting Integration"
      ],
      highlighted: false
    },
    {
      name: "Pro",
      price: "Starting at $599",
      period: "",
      description: "For growing teams.",
      features: [
        "Everything in Starter",
        "Org Chart",
        "AI Meeting Extractor",
        "AI Agents",
        "Priority Support"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Starting at $599",
      period: "",
      description: "For scaling businesses.",
      features: [
        "Everything in Pro",
        "Smart Yield",
        "Lean Analysis",
        "Multi-user (5 seats)",
        "Dedicated Success Manager"
      ],
      highlighted: false
    }
  ];


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
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
            <span className="font-serif text-sm text-white">Q</span>
          </div>
          <span className="text-lg font-medium text-white">Quantro</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="text-sm text-slate-600">
          © 2024 Quantro. All rights reserved.
        </div>
      </div>
    </footer>);

};

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <StarFeaturesSection />
      <CapabilitiesSection />
      <ProductPreviewSection />
      <DifferentiationSection />
      <PricingSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}

export default App;