# Quantro Landing Page - PRD

## Original Problem Statement
Create a premium SaaS landing page for a fintech/AI startup called "Quantro" - an "Autonomous Business Operating System" that analyzes data, makes decisions, and executes actions automatically for businesses. Style: ultra-clean, minimal, high-end (Apple/Stripe/Linear), dark theme with electric blue + subtle green/violet accents. Includes Hero, Problem, Solution, Capabilities, Product Preview, Differentiation, Investor, Pricing sections, interactive dashboard mockups, smooth scrolling, micro-animations, and ES/EN localization.

## User Personas
- **Enterprise businesses** - Looking for autonomous operations
- **Investors** - Seeking investment opportunities in fintech/AI
- **C-level executives** - Decision makers for enterprise software
- **Business analysts** - Evaluating business intelligence tools

## Core Requirements (Static)
### Style
- Ultra clean, minimal, high-end (Apple/Stripe/Linear style)
- Dark theme (deep navy/black background)
- Accent colors: Electric blue (#00F5FF / #22D3EE) + violet (#A020FF) + emerald
- Professional, enterprise-grade look

### Typography
- Headings: DM Serif Display / Satoshi
- Body: Inter
- Mono: JetBrains Mono

### Language Preference
- User writes/prefers SPANISH. Agent should respond in Spanish.

## Code Architecture (as of Feb 2026 — post-refactor)
```
/app/frontend/src/
├── App.js                              # slim orchestrator (~50 lines)
├── hooks/useLanguage.js                # i18n context + ES/EN hook
├── i18n/index.js                       # ES/EN translation dictionary
├── lib/
│   ├── animations.js                   # fadeInUp, staggerContainer
│   └── analytics.js                    # trackCTAClick (GA4)
└── components/
    ├── AnimatedSection.jsx             # scroll-triggered motion wrapper
    ├── QuantroLogoMark.jsx             # SVG logo
    ├── HeroDashboardPreview.jsx        # compact dashboard card in hero
    ├── Navbar.jsx
    ├── LanguageSwitcher.jsx
    ├── QuantroMorningDemo.jsx          # interactive demo (mock data)
    └── sections/
        ├── HeroSection.jsx
        ├── HeroTransitionSection.jsx
        ├── ProductComparisonSection.jsx
        ├── BetterTogetherSection.jsx
        ├── QuantroIntelligenceSection.jsx
        ├── MorningSnapshotSection.jsx
        ├── SuccessStoriesSection.jsx
        ├── StarFeaturesSection.jsx
        ├── DifferentiationSection.jsx
        ├── PricingSection.jsx
        ├── FinalCTASection.jsx
        └── Footer.jsx
```

## What's Been Implemented

### Feb 21, 2026 — App.js Refactor
- Broke down monolithic App.js (1850 lines) into 12 section components + 4 shared components + 2 lib files
- App.js is now a ~50-line slim orchestrator
- Removed dead code: ProblemSection, SolutionSection, CapabilitiesSection, ProductPreviewSection (never rendered)
- Updated stale `hero.*` i18n keys to reflect current copy
- All sections verified to render correctly in Spanish

### March 22, 2026 (earlier session)
**Frontend (React + Tailwind)**
- Full landing page with all sections (Hero 2-col Apple/Stripe style, HeroTransition, ProductComparison, BetterTogether, QuantroIntelligence, MorningSnapshot demo, SuccessStories, StarFeatures, Differentiation, Pricing, FinalCTA, Footer)
- DM Serif Display / Satoshi / Inter / JetBrains Mono fonts
- Framer-motion scroll animations
- Dark theme with #00F5FF / #A020FF accents
- Spanish copy: "Despierta con decisiones listas para actuar" + "Empieza por $1 USD"
- Interactive QuantroMorningDemo (mock data)
- Multi-language toggle (ES/EN) via useLanguage hook
- GA4 snippet + SEO meta tags
- Mobile responsive with hamburger menu

**Backend (FastAPI + MongoDB)**
- POST /api/early-access - Email signup with validation
- GET /api/early-access - Retrieve all signups

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Landing page structure
- [x] Email capture functionality
- [x] Mobile responsiveness
- [x] Hero redesign with Spanish copy
- [x] App.js modular refactor (Feb 21, 2026)

### P1 (Important)
- [ ] **Stripe integration for $1 USD charge** (user prefers this over Typeform for waitlist CTAs)
- [ ] Connect demo CTAs to Stripe checkout / payment link
- [ ] Implement email confirmation (SendGrid/Resend)

### P2 (Nice to Have)
- [ ] Replace GA4 placeholder `G-XXXXXXXXXX` with real Measurement ID
- [ ] Connect QuantroMorningDemo to live API (currently mock state)
- [ ] Localize Footer links (Privacidad/Términos) to pages
- [ ] Add investor deck PDF download
- [ ] Localize Pricing, StarFeatures, Differentiation sections (currently English-only)

## Next Tasks
1. **Stripe $1 USD checkout integration** — user's next priority. Requires integration_playbook_expert_v2 call.
2. Localize remaining English-only sections (Pricing, StarFeatures, Differentiation) via i18n keys
3. Replace GA4 placeholder ID
4. Wire QuantroMorningDemo to live backend data
