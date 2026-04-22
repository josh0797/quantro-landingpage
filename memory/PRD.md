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

### Feb 22, 2026 — SEO + Modal "Volver" + Pricing refactor (full)
- **SEO metadata update** (`/app/frontend/public/index.html`):
  - `<title>` → "Quantro — Despierta con decisiones listas para ejecutar en tu negocio"
  - `<meta name="description">` → "Quantro conecta tus datos, detecta oportunidades y propone acciones listas para ejecutar. Un solo sistema para operar, decidir y crecer — incluso mientras duermes."
  - Propagated to Open Graph (og:title/og:description), Twitter card (twitter:title/twitter:description) and JSON-LD structured data.
  - Added keyword `AOS` and `Autonomous Operating System` to meta keywords.
- **ABOS → AOS rename**: removed any "Autonomous Business Operating System" reference in `backend/emails.py` (footer) and `backend/chat.py` (both ES and EN system prompts). Now says "Autonomous Operating System (AOS)".
- **Modal "Volver" button relocated**: now lives in the top-left corner of the PlatformAccessScreen chrome (symmetric with the × button on top-right). Only visible on the `auth` stage. Smooth fade + slide transition via `AnimatePresence`. AuthForm accepts `hideBackButton` prop so the inline version isn't duplicated.
- **PricingSection full refactor** per user spec:
  - Global message: "Todo el sistema Quantro desde el primer plan. Escala en automatización, profundidad y capacidad."
  - All 3 plans include Quantro OS + Flow + Intelligence (principle: differ only in depth/automation/capacity — no "disponible a partir de…" language).
  - Essential ($59) "Empieza con claridad y control" — 6 new bullets. Microcopy: coupon pill 🎟 "Utiliza el cupón QUANTRO1" (cyan-tinted).
  - Pro ($209) "Escala con inteligencia, no con esfuerzo" — 7 new bullets. Microcopy: "El punto donde tu negocio empieza a escalar". ⭐ Más popular badge. Visual emphasis: `text-2xl` H3, `text-6xl` price, border-2 cyan, `lg:scale-[1.05] -translate-y-3`, gradient shadow.
  - Enterprise ($499) "Automatización y control en su máxima expresión" — 9 new bullets. Microcopy: "Diseñado para operación avanzada". Purple accent, neutral premium CTA (bg-white/[0.04] + purple border), `lg:scale-[0.985]`.
  - Essential `lg:scale-[0.97]` — subtly smaller than Pro, larger than Enterprise is not (Enterprise is the same scale as Essential but with aspirational feel via purple).
  - Mobile order: Pro (order-1) → Essential (order-2) → Enterprise (order-3). Desktop retains natural left-to-right.
  - Old "$1 USD" microcopy removed everywhere.
- Testing iteration_18: 100% frontend (all acceptance criteria pass). Zero issues.


- **Mobile flow visualization fix** (`IntelligenceSection.jsx`):
  - Desktop (≥640px): unchanged horizontal flowing curve through 4 nodes.
  - Mobile (<640px): new S-shaped 2-row curve — DATOS + ANÁLISIS on top row, DECISIÓN + ACCIÓN on bottom row. Curve SVG uses `vectorEffect="non-scaling-stroke"` + stroke 1.4px so the line stays crisp regardless of the non-uniform viewBox scaling. Labels no longer clip off-screen.
  - Both variants share Dot + PathSvg components; only the path `d` and node coordinates differ.
- **Pricing rename + $1 USD promo**:
  - `tier.key` now matches `profiles.plan` directly (`essential | pro | enterprise`). Removed the now-redundant `mapTierToPlan()` usage; `PlatformAccessScreen.PLAN_TIERS` aligned.
  - New copy:
    - Essential ($59) — "Deja el caos atrás y gana claridad"
    - Pro ($209) — "Escala con inteligencia, no con esfuerzo"
    - Enterprise ($499) — "Automatización y control en su máxima expresión"
  - All 3 CTAs read "Comenzar" when not logged in (state-aware label kept for authenticated states).
  - Microcopy under each CTA (only when `billingState === 'not_logged'`): "● Empieza hoy por $1 USD" / "● Start today for $1 USD" (cyan dot). data-testid pricing-promo-0/1/2.
- **"Made with Emergent" badge removed**:
  - `/app/frontend/public/index.html` — the `#emergent-badge` anchor now has `style="display:none !important"`.
  - `/app/frontend/src/index.css` — defensive rule hides `#emergent-badge` + any `a[href*="emergent.sh"][href*="utm_source=emergent-badge"]` in case the Emergent script re-injects.
- Testing iteration_17: 100% frontend (13/13) across desktop + mobile, ES + EN. Zero issues.


User directive: STOP local FastAPI billing; route everything through the existing Supabase Edge Functions `create-checkout-session` + `stripe-webhook`. `profiles.plan` is the sole source of truth.

- **`lib/stripe.js` rewritten**: `startStripeCheckout({ plan, billingCycle, email, language })` now POSTs to `${SUPABASE_URL}/functions/v1/create-checkout-session` with body `{ priceId, successUrl, cancelUrl, locale, customerEmail }` and `Authorization: Bearer <session_access_token || anon_key>`. Removed `getCheckoutStatus` / `pollCheckoutStatus` (obsolete).
- **`lib/platformRoutes.js`**:
  - Added `STRIPE_PRICE_IDS` map with all 6 user-provided price IDs (essential/pro/enterprise × monthly/annual) + `resolvePriceId(plan, cycle)` helper.
  - Updated URLs: Quantro OS → `https://konta-seven.vercel.app`, Quantro Flow → `https://quantro-os.emergent.host/dashboard`, both `available: true`.
- **`PaymentReturnModal` rewritten**: detects `?checkout=success|cancel`; in success mode polls `supabase.from('profiles').select('plan').eq('id', user.id)` every 1.5s up to 12 attempts (~18s) until `plan` flips — no backend calls. Ensures Stripe webhook latency is absorbed gracefully.
- **`usePlan.js` extended**: reads `public.ai_usage` filtering by `user_id + month='YYYY-MM'`, groups/SUMs by `type` (agent_runs / ai_requests / automations). Exposes `usage`, `remaining`, `can.runMoreAgents/runMoreAiRequests/runMoreAutomations`, and `refreshUsage()`.
- **Backend FastAPI — Stripe code removed entirely**:
  - Deleted: `/api/stripe/create-checkout`, `/api/stripe/checkout-status/{id}`, `/api/webhook/stripe` (all now 404).
  - Kept: `/api/stripe/payments/count` (simple counter used by SocialProof; returns baseline + Mongo legacy count).
  - Removed imports of `emergentintegrations.payments.stripe.checkout`, `supabase_admin`, `send_welcome_email` from `server.py`.
  - `/app/backend/supabase_admin.py` DELETED — no more service-role code in our backend. Supabase Edge Functions own the service-role key.
- Testing iteration_16: 100% backend (7/7), 100% frontend (9/9). Zero bugs.


- **Stripe webhook → Supabase (server-side, service-role authority)**:
  - New `/app/backend/supabase_admin.py` — singleton admin client using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (added to `/app/backend/.env`). Exposes `update_profile_plan(user_id, plan, billing_cycle, stripe_subscription_id, stripe_customer_id)` + `clear_profile_plan(user_id)`.
  - `supabase==2.28.3` added to `requirements.txt`.
  - Both `/api/webhook/stripe` AND `/api/stripe/checkout-status/{session_id}` trigger `update_profile_plan` when `payment_status=paid` (metadata sourced from `payment_transactions` stored at checkout creation). Idempotent via `profile_sync_status=synced` flag.
  - Frontend `PaymentReturnModal` removed its client-side supabase UPDATE — now only calls `refresh()` because backend is authoritative.
- **`usePlan()` hook + `PLAN_LIMITS`** (`/app/frontend/src/hooks/usePlan.js`): wraps `useUserBillingState` and exposes `limits` (seats / ai_agents / ai_runs_monthly / automations / has_revenue / has_intelligence) + `can` (useIntelligence / useRevenue / inviteSeats / runAgents) + `isAtLeast(plan)`.
- **`UpgradeScreen.jsx`**: premium gated-feature modal with DiffPill (current→required plan) + 5-row comparison table (Asientos, Agentes IA, Automatizaciones, Intelligence, Revenue) + "Más tarde" / upgrade CTA. Upgrade CTA closes the modal and opens PlatformAccessScreen.
- **Welcome post-purchase**: PlatformAccessScreen `redirect` stage detects `profile.plan_updated_at < 6min` and shows "Pago confirmado · ¡Bienvenido, {firstName}! · Tu plan {label} está activo. Vamos a {platform}." instead of the bare "Entrando…". Redirect delay extended from 700ms → 2800ms on fresh purchase so the user has time to read.
- **`AnnouncementBanner.jsx`** (new) mounted above `<Navbar />` in `App.js`:
  - ES: "🎉 Prueba Quantro por $1 USD — despierta con decisiones listas y ejecutables."
  - EN: "🎉 Try Quantro for $1 — wake up to ready-to-execute decisions."
  - Dismissible × (persists in localStorage `quantro_announce_dismissed=1`), clickable body opens PlatformAccessScreen, subtle horizontal shimmer animation.
  - Navbar changed from `fixed` → `sticky` so banner + navbar stack correctly.
- Testing iteration_15: 100% backend (7/7), 100% frontend (9/9). No issues.


- **Supabase auth as source of truth**: `@supabase/supabase-js` v2 installed; `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` added to `/app/frontend/.env`. Shared Supabase project with Quantro OS.
- **`useUserBillingState.js` rewritten (REAL)**: reads `auth.getSession()` + subscribes to `onAuthStateChange`, fetches `profiles` row by user id (columns: `id, email, company_name, industry, language, plan, billing_cycle, stripe_customer_id, stripe_subscription_id, plan_updated_at`). Derives: `session, user, profile, plan, billingCycle, isAuthenticated, hasPaidPlan, needsOnboarding, isLoading, billingState, refresh()`. No URL params anywhere.
- **New lib modules**:
  - `lib/supabase.js` — singleton client with `storageKey: "quantro.auth"`
  - `lib/platformRoutes.js` — `PLATFORMS` config + `PRICING_TIER_TO_PLAN` mapping (Starter→essential, Pro→pro, Scale→enterprise)
  - `lib/billingGuards.js` — pure rules: `resolveNextStep`, `deriveBillingState`, `hasActivePlan`, `needsOnboarding`, `getCTACopy`
  - `lib/checkoutResume.js` — sessionStorage `quantro_checkout_intent` with 1h TTL to survive Stripe redirect
- **`PlatformAccessScreen.jsx` (NEW — star screen)**: full-screen modal orchestrating 4 stages — `choose_platform` → `auth` → `choose_plan` → `redirect`. Platform cards for Quantro OS (active) and Quantro Flow (disabled/"Próximamente" until URL is set). Plan cards map to `essential/pro/enterprise`. Step indicator (Plataforma · Acceso · Plan · Listo). Footer status strip showing session/plan.
- **`AuthForm.jsx` (NEW)**: premium dark inline login + signup using Supabase directly. Graceful error message on Supabase 500s.
- **`usePlatformAccess.jsx` (NEW)**: global provider + `openPlatformAccess()` hook so any CTA opens the same modal.
- **`App.js` refactored**: `App` → `AppContent` → `LandingShell` with `<PlatformAccessProvider>` wrapping everything. Landing order 100% preserved.
- **CTAs migrated**:
  - Navbar CTA no longer hits Stripe directly — opens PlatformAccessScreen. Label from `getCTACopy(billingState)`.
  - Hero primary CTA also opens the modal.
  - PricingSection tier CTAs persist intent (`saveIntent` with tier+plan+billing_cycle) then open the modal — unified entry point.
- **Backend `POST /api/stripe/create-checkout`** now accepts optional `plan`, `billing_cycle`, `user_id`, `metadata`; forwards them all into Stripe session metadata.
- **`PaymentReturnModal` upgraded**: on `paid`, runs `UPDATE profiles SET plan, billing_cycle, plan_updated_at WHERE id=user.id` (RLS-scoped), calls `refresh()` from useUserBillingState, computes resume URL from persisted intent, shows "Continuar a Quantro OS →" button, cleans URL + intent on close.
- Testing iteration_14: 100% backend (5/5 pytest), 94% frontend (15/16 — only gap is Supabase project config on user side: signup returning HTTP 500).


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
