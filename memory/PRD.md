# Quantro Landing Page - PRD

## Original Problem Statement
Premium SaaS landing page for "Quantro" — "Autonomous Business Operating System". Dark theme, Apple/Stripe premium style. Spanish primary, ES/EN toggle. Features: Hero, Transition, ProductComparison, BetterTogether, QuantroIntelligence, MorningSnapshot demo, SuccessStories, StarFeatures, Differentiation, Pricing (Monthly/Annual toggle), FAQ, Footer + routed legal pages (/privacidad, /terminos, /contacto).

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

### Feb 22, 2026 — Smart CTA + Demo Easter egg + ValueStack redesign
- **Smart CTA logic (Msg 479)** via new hook `/app/frontend/src/hooks/useUserBillingState.js`:
  - States: `not_logged` (default) / `trial_active` / `active_subscription` / `expired`
  - Precedence: URL param `?userState=<state>` > localStorage (`quantro_user_state`) > default
  - Invalid values fall through to `not_logged`. URL param writes to localStorage so state persists across navigation within the session.
  - Helper `getCTAForState(state, lang)` returns `{ label, type: 'stripe'|'app'|'billing', href?, variant }`:
    - `not_logged` → "Comenzar" / "Get Started" (cyan gradient, Stripe)
    - `trial_active` / `active_subscription` → "Ir al sistema" / "Open app" (cyan gradient, opens https://app.quantroos.com in new tab)
    - `expired` → "Actualizar pago" / "Update payment" (amber gradient)
  - Applied to Navbar (desktop + mobile CTAs, `data-cta-state` attribute) and to all 3 PricingSection tier CTAs.
- **Easter egg onboarding hint in Interactive Demo**:
  - After 7s on the default Dashboard view, a cyan gradient tooltip appears below the "Agentes IA" tab pill with a pointing caret and pulsing ring around the pill
  - Copy: "Haz clic aquí para ver cómo Quantro piensa por ti ↑" / "Click here to see how Quantro thinks for you ↑"
  - Dismissed by: clicking any tab, clicking any sidebar item, or the × button. Dismissal persists for the session via `sessionStorage.quantro_demo_hint=dismissed`.
- **ValueStackSection redesign**:
  - Eyebrow + H2 + subheadline unchanged, but the canvas is now a two-layer "Before vs Now" composition.
  - Back layer: 8 external tools (CRM · WhatsApp · Email Marketing · Calendar · Analytics · Docs · Tasks · Automation) rendered as muted (50% opacity) floating pills with slow vertical drift — represents fragmentation.
  - Core layer: two protagonist cards centered on the canvas — Quantro OS (cyan, Brain icon, "Inteligencia del negocio") and Quantro Flow (violet, Workflow icon, "Ejecución automática") — with a gradient SVG arc connecting them to communicate they work together.
  - Top badges anchor the narrative: "Antes · disperso" (left, muted) / "Ahora · unificado" (right, cyan with glow).
  - ComparisonCard (right column) rewritten to user spec: "Antes / Múltiples herramientas separadas / Desde $399/mes" (strikethrough) → "Ahora con Quantro / Un solo sistema conectado / Desde $59/mes" (cyan gradient) → "Menos herramientas que pagar. Más resultados en marcha."
- Testing iteration_13: 42/42 frontend checks, 0 bugs.


- **InteractiveDemoSection** fully rebuilt as an Apple/Stripe/Linear-style Quantro OS product mock:
  - macOS-style window chrome with sidebar (Operaciones + Inteligencia groups, profile pill with `ENTERPRISE` badge, search hint ⌘K)
  - Topbar with `Quantro OS / <view>` breadcrumb, Q2 · LEVEL 10 gradient badge, CO avatar
  - 7 switchable views via tab pills AND sidebar nav: Dashboard · Scorecard · Rocks · Issues · To-Dos · Agentes IA · Quantro Revenue
  - Dashboard: greeting card + autonomy KPI + 4 KPI cards + Centro de Acción (4 prioritized tasks) + Revenue panel with Quantro Revenue decisions
  - Scorecard: filter bar (All Departments / Weeks / 2 wks / CSV / Excel / Add Metric) + summary cards (Active/On Track/At Risk/Off Track) + 6-row measurables table with color-coded weekly cells and trend arrows
  - Rocks: 4 rock cards with animated progress bars and owner avatars
  - Issues: table with severity pills, owner avatars, status
  - To-Dos: checkbox list with priority pills, due dates, owner avatars
  - Agentes IA: 6 agent cards (Executive Monitor, Risk Monitor, CFO Quantro, Operations Architect, Coach de Ventas, Data Analyst) each with detected/suggestion/next-action
  - Quantro Revenue: KPI strip + Revenue Decisions workflow + Quadrant analysis (Q1-Q4)
  - All copy uses real product naming (Quantro, Quantro OS, Quantro Revenue, Agentes IA, Rocks, Scorecard, Issues, To-Dos, SOPs, Lean Analysis, Reunión AI)
  - Narrative bridge title "Así se ve tu empresa funcionando en Quantro" connecting to AmanecerSection
- **Brand unification**:
  - Navbar now uses `QuantroLogoMark` (named import) at 32px + Satoshi wordmark
  - Footer uses `QuantroLogoMark` at 30px + Satoshi wordmark (replaced the old boxed "Q")
  - Favicon (SVG + Apple touch) redesigned to match the logo mark (rounded dark glass + cyan→green gradient Q circle + tail)
- **LanguageSwitcher**: centered inside the mobile menu via `flex justify-center` wrapper
- **AmanecerSection fix**: financial risk card now shows `-$1,399` in amber-400 with `AlertTriangle` icon and amber border/glow (was white `$1,399` with generic `TrendingUp`)
- Testing iteration_12: 100% frontend pass, 0 critical bugs


Full narrative restructure into a continuous story (Problem → System → Value → Product → Cinematic → Amanecer):
- **ProblemSystemSection (NEW)**: "El problema no es falta de herramientas." 4 problem→solution blocks with red/green state pills, transition headline, OS + Flow mini-blocks, gradient closing "Primero entiendes. Luego ejecutas."
- **ValueStackSection (UPDATED copy)**: Title "De múltiples herramientas a un solo sistema." Comparison card shows **$399/mes** (line-through) → **$59/mes** with copy "Menos herramientas que pagar. Más resultados en marcha." Pill costs adjusted to sum to 399.
- **InteractiveDemoSection (NEW)**: Two blocks — Quantro Flow (violeta: Inbox/CRM/Seguimiento/Automatización/Pipeline) and Quantro OS (cyan: Dashboard/Scorecard/Rocks/Intelligence/Agentes/Finanzas). Each pill click swaps a live-styled preview frame. Transition text "Primero todo funciona. Luego todo mejora."
- **CinematicTransitionSection (NEW)**: Dramatic dark break with staggered reveal "Esto no es teoría." → "Es tu negocio funcionando como debería." (gradient).
- **AmanecerSection (NEW)**: 5-frame narrative: opening badge + title, risk detection ($1,399 financial risk card), auto-generated action plan with 4 checkable tasks, Flow working in parallel (Inbox + Pipeline mini cards), closing "Tu negocio no se detiene. / Evoluciona todos los días."
- **Removed**: `HeroTransitionSection`, `ProductComparisonSection`, `BetterTogetherSection`, `QuantroIntelligenceSection`, `MorningSnapshotSection`, `QuantroMorningDemo` component
- **Fixed**: All stale `scrollToSection("morning-snapshot")` anchors in Navbar/Hero rewired to `interactive-demo`
- **Added**: `data-testid` on LanguageSwitcher buttons (`lang-toggle-es` / `lang-toggle-en`)
- Testing iteration_10: 100% pass, 0 critical issues

### Feb 21, 2026 — Admin Insights + Section Redesigns (P2/P3)
- **NEW endpoint `GET /api/admin/chat/insights`** (HTTP Basic auth via `ADMIN_USER`/`ADMIN_PASSWORD` env):
  - Returns `{window_days, total_user_messages, distinct_sessions, top_questions}`
  - Top questions grouped by normalized form (lowercased, stripped of punctuation/accents) — so "¿Qué es Quantro?" and "¿qué es quantro" merge into one entry
  - Query params: `days=1..365` (default 30), `limit=1..50` (default 10)
  - Credentials in `/app/memory/test_credentials.md`
- **Features section redesigned** (`StarFeaturesSection`):
  - Title: "Decisiones claras. Acciones automáticas."
  - 4 benefit-focused cards with short titles (≤6 words) and 1-line body
  - 3 accent colors (cyan/violet/emerald) with hover glow shadow
- **Differentiation section redesigned** (`DifferentiationSection`):
  - Replaced comparison table with emotional 4-step flow
  - Ver → Entender → Actuar → Ejecutar (ES) / See → Understand → Act → Execute (EN)
  - Gradient headline "No es un dashboard. Es un sistema que decide."
  - Desktop: horizontal flow with SVG gradient arrows. Mobile: vertical stack
- **Value Stack section (NEW)**:
  - Title: "Un sistema. No 7 herramientas."
  - Animated canvas: 7 floating tool pills (CRM, BI Tool, Forecasts, Spreadsheets, Chat Ops, Email Mgmt, Task Tracker) scatter around a central Quantro OS core
  - After 600ms in view, pills collapse into the center with fading connectors
  - Savings card with easeOutCubic tween counter: $339/mo (sum of 7 tool costs)
- Testing iteration_9: 9/9 backend + 19/19 frontend (ES + EN). 0 issues.

### Feb 21, 2026 — Chat de Soporte IA + Testimonial Carousel
- **Chat flotante con GPT-4o-mini** (Intercom-style, minimalist dark):
  - Backend: `/app/backend/chat.py` con endpoint `POST /api/chat/message`, usa `emergentintegrations.llm.chat.LlmChat` con `gpt-4o-mini` (bajo costo)
  - System prompts bilingües (ES/EN) con conocimiento de producto, precios, onboarding
  - Rate limiting: 20 msgs/sesión, 50 msgs/IP/día (control de costos)
  - Persistencia en MongoDB: `chat_sessions` + `chat_messages`
  - Multi-turn context preservation vía `session_id`
  - Frontend: `/app/frontend/src/components/SupportChatWidget.jsx` — botón flotante bottom-right con dot verde pulsante, panel 380×560px, header con gradient + avatar Sparkles, 3 chips de sugerencias iniciales, bubbles user (gradient cyan) / assistant (slate), typing dots animation, localStorage session
- **Testimonial Carousel** (reemplaza las 3 cards estáticas):
  - Auto-advance cada 7s con progress bar animada en los dots
  - Pause on hover
  - Arrow controls + dots clickables (active = 40px, inactive = 10px)
  - Slide transition con AnimatePresence (x=40→0 / 0→-40)
  - BigMetric con easeOutCubic tween del número (+40% cuenta de 0 a 40)
  - 3 testimonios bilingües, cada uno con autor
- Testing iteration_8: 8/8 backend + 20/20 frontend. 0 issues.

### Feb 21, 2026 — Legal pages + FAQ + cleanup
- **Router**: `react-router-dom` with `BrowserRouter` at `index.js` root; `LanguageProvider` moved to root so routed pages also have i18n
- **Legal pages**: `/privacidad`, `/terminos`, `/contacto` (+ English aliases `/privacy`, `/terms`, `/contact`) with shared `LegalPageLayout` component (minimal top bar, back-home link, content, footer)
- **PrivacyPage**: Full aviso de privacidad en ES (8 secciones: quiénes somos, datos, uso, compartir, ARCO, seguridad, retención, cambios)
- **TermsPage**: 13 secciones (aceptación, prueba $1, planes, cancelación, uso aceptable, propiedad de datos, limitación, contacto)
- **ContactPage**: 4 tarjetas contacto (Ventas, Soporte, Prensa, Privacidad) + CTA "Agendar llamada"
- **Footer**: links actualizados a `<Link>` de react-router (navegación SPA sin reload)
- **FAQSection**: sección "Antes de empezar" debajo de Pricing. 10 FAQs bilingües (ES/EN) inline. Acordeón minimalista con ícono `+` circular que rota a `×` (rotate-45) al abrir. Primera pregunta abierta por default. Animación framer-motion height+opacity 0.35s cubic-bezier. Separadores finos. Título H2 grande serif "Antes de empezar".
- **Cleanup**: Toda referencia a "Investor Deck" eliminada del backlog del PRD
- Testing: 100% frontend (iteration_7.json), 0 issues

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
- [ ] A/B test Hero primary CTA copy
- [ ] Testimonial carousel / logo row on scroll
- [ ] Internal admin dashboard at /admin (revenue, paid users, funnel)
