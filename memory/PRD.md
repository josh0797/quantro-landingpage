# Quantro Landing Page - PRD

## Original Problem Statement
Premium SaaS landing page for "Quantro" — "Autonomous Business Operating System". Dark theme, Apple/Stripe premium style. Spanish primary, ES/EN toggle. Features: Hero, Problem, Solution, Capabilities, Product Preview, Differentiation, Investor, Pricing sections, interactive dashboard mockups, smooth scrolling, micro-animations, i18n.

## Tech Stack
- Frontend: React + Tailwind + Framer Motion + Shadcn UI + react-i18n (custom hook)
- Backend: FastAPI + MongoDB + emergentintegrations (Stripe) + Resend (transactional email)

## Code Architecture
```
/app/backend/
├── server.py            # Main FastAPI app with Stripe + early-access
├── emails.py            # Resend welcome email template + send helper
├── .env                 # STRIPE_API_KEY, RESEND_API_KEY, SENDER_EMAIL

/app/frontend/
├── public/
│   └── assets/quantro-os-overview.pdf
└── src/
    ├── App.js                      # slim orchestrator (~50 lines)
    ├── hooks/useLanguage.js        # ES/EN context (ES default)
    ├── i18n/index.js               # translations dictionary
    ├── lib/
    │   ├── animations.js           # framer-motion variants
    │   ├── analytics.js            # GA4 event helpers
    │   └── stripe.js               # checkout helpers
    └── components/
        ├── AnimatedSection.jsx
        ├── Navbar.jsx              # CTA → Stripe direct
        ├── PaymentReturnModal.jsx  # ?payment=success|cancel
        ├── LanguageSwitcher.jsx
        ├── QuantroLogoMark.jsx
        ├── HeroDashboardPreview.jsx
        ├── QuantroMorningDemo.jsx  # interactive demo (MOCKED state)
        └── sections/
            ├── HeroSection.jsx                # PDF download link
            ├── SocialProofSection.jsx         # animated live counter
            ├── HeroTransitionSection.jsx
            ├── ProductComparisonSection.jsx
            ├── BetterTogetherSection.jsx
            ├── QuantroIntelligenceSection.jsx
            ├── MorningSnapshotSection.jsx
            ├── SuccessStoriesSection.jsx
            ├── StarFeaturesSection.jsx        # localized
            ├── DifferentiationSection.jsx     # localized
            ├── PricingSection.jsx             # Monthly/Annual toggle + Stripe/mailto CTAs
            └── Footer.jsx
```

## Backend APIs
- `POST /api/early-access` — email waitlist (deprecated but still live for legacy)
- `POST /api/stripe/create-checkout` — creates $1 USD Stripe session; body `{package_id, origin_url, email?}`
- `GET /api/stripe/checkout-status/{session_id}` — polls status; idempotently updates DB and sends welcome email on first paid transition
- `POST /api/webhook/stripe` — Stripe webhook; same idempotent + email send logic
- `GET /api/stripe/payments/count` — `{count: paid_transactions + 127}` for social proof

## MongoDB Collections
- `early_access` — legacy email signups
- `payment_transactions` — Stripe sessions: `{session_id, package_id, amount, currency, email, metadata, payment_status, status, welcome_email_sent, welcome_email_id, ...}`

## What's Been Implemented

### Feb 21, 2026 — P2 PDF + Email + P3 Pricing toggle + Remove FinalCTA
- **PDF Download**: `/public/assets/quantro-os-overview.pdf` (15KB) linked from Hero (`hero-pdf-link` testid)
- **Resend email**: Welcome email in Spanish with Quantro branding sent from `no-reply@quantroos.com` on first paid transition (idempotent via `welcome_email_sent` flag)
- **Removed FinalCTASection**: Navbar CTA now triggers Stripe directly; Enterprise CTA → `mailto:ventas@quantroos.com`
- **Pricing Monthly/Annual toggle**: pill selector (`billing-toggle-monthly`/`billing-toggle-annual`), "2 meses gratis" badge on annual, animated price swap (`AnimatedPrice` with framer-motion), card min-h to prevent layout shift
- Testing: 11/11 pytest backend + full frontend E2E (iteration_6.json)

### Feb 21, 2026 — GA4 Funnel Tracking (P3)
- Real GA4 ID: `G-NLF6B56ZG6`
- Events: `checkout_started` + `begin_checkout` on CTA click, `checkout_paid` + `purchase` on success, `checkout_cancelled` on cancel

### Feb 21, 2026 — Stripe + i18n + Social Proof (P1/P2/P3)
- Stripe $1 USD checkout, localized 3 sections, live social proof counter

### Feb 21, 2026 — App.js Modular Refactor
- 1850 → 50 lines; 12 section components + shared lib/components

### March 22, 2026 — Initial MVP
- Full landing page, ES/EN toggle, SEO, Apple/Stripe aesthetic

## Prioritized Backlog

### P0/P1/P2/P3 DONE
- [x] Landing page structure
- [x] Stripe $1 USD integration + funnel tracking
- [x] i18n (ES/EN) across all sections
- [x] Live social proof
- [x] Modular architecture
- [x] PDF overview download
- [x] Resend post-payment welcome email
- [x] Pricing Monthly/Annual toggle
- [x] Remove FinalCTA section

### Remaining
- [ ] Connect QuantroMorningDemo to live backend data (currently MOCKED)
- [ ] Wire Footer Privacy/Terms/Contact links to real pages
- [ ] Add investor deck PDF download (separate from overview)
- [ ] A/B test Hero primary CTA copy
- [ ] Testimonial carousel / logo row
