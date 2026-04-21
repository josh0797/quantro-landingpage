# Quantro Landing Page - PRD

## Original Problem Statement
Premium SaaS landing page for "Quantro" — an "Autonomous Business Operating System" that analyzes data, makes decisions, and executes actions automatically. Style: ultra-clean, minimal, high-end (Apple/Stripe/Linear), dark theme with electric blue + subtle green/violet accents. Spanish primary language, ES/EN toggle.

## User Personas
- Enterprise businesses looking for autonomous operations
- Investors seeking fintech/AI opportunities
- C-level executives and business analysts

## Core Tech Stack
- Frontend: React + Tailwind + Framer Motion + Shadcn UI
- Backend: FastAPI + MongoDB + Motor + emergentintegrations (Stripe)
- i18n: custom hook-based (ES default, EN toggle)

## Code Architecture (post-refactor Feb 2026)
```
/app/frontend/src/
├── App.js                              # slim orchestrator (~55 lines)
├── hooks/useLanguage.js                # i18n context (ES default)
├── i18n/index.js                       # ES/EN translations
├── lib/
│   ├── animations.js                   # framer-motion variants
│   ├── analytics.js                    # GA4 trackCTAClick
│   └── stripe.js                       # startStripeCheckout, pollCheckoutStatus
└── components/
    ├── AnimatedSection.jsx             # scroll-triggered motion wrapper (fwds testids)
    ├── QuantroLogoMark.jsx
    ├── HeroDashboardPreview.jsx
    ├── Navbar.jsx
    ├── LanguageSwitcher.jsx
    ├── QuantroMorningDemo.jsx          # interactive demo (MOCKED state)
    ├── PaymentReturnModal.jsx          # reads ?payment=success|cancel
    └── sections/
        ├── HeroSection.jsx             # Stripe CTA wired
        ├── SocialProofSection.jsx      # live animated counter
        ├── HeroTransitionSection.jsx
        ├── ProductComparisonSection.jsx
        ├── BetterTogetherSection.jsx
        ├── QuantroIntelligenceSection.jsx
        ├── MorningSnapshotSection.jsx
        ├── SuccessStoriesSection.jsx
        ├── StarFeaturesSection.jsx     # localized
        ├── DifferentiationSection.jsx  # localized
        ├── PricingSection.jsx          # localized + Stripe CTA
        ├── FinalCTASection.jsx
        └── Footer.jsx
```

## Backend APIs
- `POST /api/early-access` — email waitlist signup
- `POST /api/stripe/create-checkout` — creates $1 USD Stripe session; body `{package_id, origin_url, email?}`
- `GET /api/stripe/checkout-status/{session_id}` — polls payment status (idempotent)
- `POST /api/webhook/stripe` — Stripe webhook handler (idempotent)
- `GET /api/stripe/payments/count` — returns `{count: N+127}` for live social proof

## MongoDB Collections
- `early_access` — email signups
- `payment_transactions` — Stripe session records (pending/paid/expired)

## What's Been Implemented

### Feb 21, 2026 — Stripe + i18n + Social Proof (P1/P2/P3)
- **P1 Stripe Checkout ($1 USD)**: Backend endpoints via `emergentintegrations`, Hero CTA wired to redirect to Stripe, PaymentReturnModal for success/cancel, transaction tracking in Mongo with idempotent updates. Security: amount fixed server-side (`STRIPE_PACKAGES`), dynamic success/cancel URLs from frontend origin. Pricing tier CTAs (Starter/Pro) also trigger Stripe checkout.
- **P2 Localization**: Pricing, StarFeatures, Differentiation sections fully wired to `t()` / i18n keys. New keys: `pricing.*.f1..f5`, `starfeatures.*`, `diff.*`, `payment.*`, `social.*`.
- **P3 Live Social Proof**: `SocialProofSection` with pulsing dot + animated tween counter fetching `/api/stripe/payments/count` every 30s.
- Testing: 100% pass on backend (6/6) + frontend E2E (iteration_5.json).

### Feb 21, 2026 — App.js Modular Refactor
- `App.js`: 1850 → ~55 lines. Split into 12 section components + shared lib/components.
- Removed dead code (unused sections).

### March 22, 2026 — Initial MVP
- Full landing page with Hero, Transition, ProductComparison, BetterTogether, QuantroIntelligence, MorningSnapshot demo, SuccessStories, StarFeatures, Differentiation, Pricing, FinalCTA, Footer.
- ES/EN toggle, GA4, SEO, Apple/Stripe premium aesthetic.

## Prioritized Backlog

### P0 - DONE
- [x] Landing page structure and copy
- [x] Email capture + Stripe $1 USD checkout
- [x] Mobile responsiveness
- [x] Hero Apple/Stripe 2-col redesign
- [x] Modular component architecture

### P1 - DONE
- [x] Stripe $1 USD integration
- [x] Localize Pricing / StarFeatures / Differentiation
- [x] Live social proof

### P2 - Remaining
- [ ] Connect QuantroMorningDemo to live backend data (currently MOCKED)
- [ ] Wire Footer Privacy/Terms/Contact links to real pages
- [ ] Add investor deck PDF download
- [ ] Email confirmation (SendGrid/Resend) after payment

### P3 - Ideas
- [x] Track Stripe checkout funnel events in GA4 (Feb 21, 2026) — `checkout_started`/`begin_checkout`, `checkout_paid`/`purchase`, `checkout_cancelled`
- [ ] A/B test Hero primary CTA copy
- [ ] Add testimonial carousel / logo row on scroll

## GA4 Configuration
- Measurement ID: `G-NLF6B56ZG6` (production)
- Standard events emitted: `page_view`, `cta_click`, `checkout_started`, `begin_checkout`, `checkout_paid`, `purchase`, `checkout_cancelled`
