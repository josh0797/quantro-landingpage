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

### Feb 23, 2026 — Mobile Z-layout + Auth mobile menu + Problem status reorder
- **Mobile FlowVisualization (IntelligenceSection) rebuilt**: 2×2 grid (DATOS / ANÁLISIS / DECISIÓN / ACCIÓN) with a single continuous SVG Z-path that connects all 4 dots. viewBox coords tuned (26,6 / 74,6 / 26,104 / 74,104). Top cells use `flex-col + justify-start pt-2`; bottom cells use `flex-col-reverse + pb-2` so the dot sits at the bottom edge and lines up with the SVG endpoint (fixed 27px misalignment from iter19 review). Desktop variant unchanged.
- **Navbar mobile menu — authenticated state**:
  - When `isAuthenticated=true`: mobile panel renders two buttons stacked.
    - Secondary (top): `Cambiar cuenta` / `Switch account` — ghost (bg-white/[0.02] + border-white/10), calls `supabase.auth.signOut()` then opens PlatformAccessScreen.
    - Primary (bottom): `Ver mi plan` / `View my plan` — cyan gradient, smooth-scrolls to `#pricing`.
  - When `isAuthenticated=false`: original single CTA (`mobile-cta`) with state-driven label.
- **ProblemSystemSection status reorder**: the status (Sin responder / Caos / Duplicados) now sits ABOVE the problem sentence as a title-pill (red-tinted with pulsing dot) — higher visual hierarchy. The card reads as: `Status → Problem → Solution → Result badge`. New `data-testid="problem-status-{i}"`.
- Testing iteration_19: 12/13 PASS on first run → bottom-row dot alignment fixed → re-validated via screenshot.


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

### Feb 25, 2026 — Case Study Modal + People OS mobile fix round 2

**A) People OS mobile round 2 fixes (`PeopleOSSection.jsx`)**:
- **Grid breakpoint moved from `lg:` (1024px) to `xl:` (1280px)**. On iPad portrait (~810px) and narrow laptops the 2-column layout was being forced too early, squeezing the narrative text. Now both columns stack until 1280px, giving the headline full-width space.
- **Headline clamp loosened**: `clamp(26px, 5.4vw, 44px)` + `break-words` — avoids "do…" clipping on narrow viewports.
- **Narrative column gets `min-w-0`** to prevent flex/grid min-content overflow.
- **Removed mask-image fade** from the mockup body — it was hiding content on iPhone viewports.

**B) CaseStudyModal — Linear/Stripe-style mini case study (new file `sections/CaseStudyModal.jsx`)**:
- **Responsive layout**: bottom-sheet on mobile (<640px) sliding up from bottom with drag handle, centered modal on desktop (max-w-720px, scale 0.95→1 spring entry).
- **Overlay**: `rgba(0,0,0,0.6)` + `backdrop-filter: blur(12px)`. Click-outside closes. ESC closes (desktop).
- **Body scroll lock**: `document.body.style.overflow = "hidden"` on mount, restored on unmount.
- **Lazy render**: modal only mounts when `modalOpen === true` (performance win for landing weight).
- **6-section content**:
  1. Header — huge gradient metric `clamp(36px, 9vw, 56px)` + title + 3 meta chips (industry · team size · timeframe)
  2. Before/After — stacked on mobile, 2-col on desktop. Before list uses red ✖ icons; After list uses cyan ✓ icons.
  3. Secondary metrics — 2×2 grid of 4 supporting numbers with gradient
  4. Mini-chart — 8-point SVG sparkline, red descending (before) → cyan ascending with glow (after), dashed divider at midpoint, end-dot. Labels: Antes · Evolución en 90 días · Después.
  5. Italic quote + attribution (same as card)
  6. CTA row — primary "Ver cómo funciona esto en Quantro" (opens PlatformAccessScreen) + secondary "Cerrar"

**C) Story data enriched** (`SuccessStoriesSection.jsx`):
- Each of the 5 stories now carries `chips`, `modalBefore` (3 items), `modalAfter` (3 items) and `secondaryMetrics` (4 mini-cards) — structured per language.
- Card is now fully clickable: `role="button"` + `onClick` + `onKeyDown` (Enter/Space). Touch-move detection prevents accidental modal open during swipe (`touchMoved` ref, 8px threshold).
- New "Ver caso completo ↗" hint with hover opacity transition shown inside each card.
- Modal opens with active story passed in. Primary CTA calls `openPlatformAccess()`.
- GA4 events: `story_card_open_[key]`, `story_modal_cta_[key]`.

**Verification**:
- Lint clean on all touched files.
- E2E Playwright: click on `story-card-conversion` → modal opens with correct testids (10/10), metric `+40%` rendered, `document.body.style.overflow === "hidden"`, ESC key closes modal and restores body overflow to `""`.

### Feb 25, 2026 — Mobile polish: People OS + Success Stories rewrite

**A) People OS — mobile-first fixes (`PeopleOSSection.jsx`)**:
- Headline: `clamp(28px, 6.2vw, 44px)` + `leading-[1.1]` + `[text-wrap:balance]` replacing the static `text-4xl sm:text-5xl`. Fixes the "Las personas correctas, do…" clipping reported on iPhone viewports.
- Subheadline: `leading-[1.55]` for improved readability.
- Section padding: `py-20 sm:py-28 px-5 sm:px-6` + grid gap `gap-10 sm:gap-12 lg:gap-14` — more vertical breathing room, tighter horizontal on small screens.
- Bullets: icon size reduced to `w-4 h-4` / `Check size={10}` on mobile, vertical spacing `space-y-2 sm:space-y-3`, text `text-[13px] sm:text-[13.5px]`.
- Mockup body: `minHeight: clamp(280px, 55vw, 420px)` (down from 360/400 fixed) + `mask-image: linear-gradient(180deg, #000 0%, #000 88%, transparent 100%)` fade bottom to soften any cutoff.
- Verified: horizontal overflow = false, full headline text present (no truncation).

**B) Global mobile safety net (`index.css`)**:
- Added `overflow-x: hidden` to `<html>` (was only on `<body>`) + `max-width: 100vw` on body for belt-and-suspenders protection against accidental horizontal overflow.

**C) Success Stories — full rewrite (`SuccessStoriesSection.jsx`)**:
- Replaced the old generic carousel with a premium mobile-first card slider.
- **5 micro-stories** with full structured data: `{metric, metricLabel, context, title, before, after, quote, attribution}`:
  1. +40% conversión → "De leads sin seguimiento a crecimiento predecible" (Grupo Nexo)
  2. -$52K costos → "De gasto disperso a control financiero" (Altura Retail)
  3. 90% tareas a tiempo → "De tareas olvidadas a ejecución consistente" (Nodo Studios)
  4. 0 tareas sin responsable → "De desorden operativo a responsabilidad total" (Praga)
  5. -80% decisiones improvisadas → "De reacción a decisiones inteligentes" (Labora Fintech)
- **Card structure** (mobile-first): eyebrow + gradient metric `clamp(48px, 13vw, 92px)` + label + context subtext → outcome title `clamp(20px, 4.2vw, 28px)` → Antes/Después mini-cards → Quote + attribution. Max 4 visible blocks for scannability.
- **iOS-style swipe**: native `touchstart`/`touchend` handlers with 40px threshold, pause autoplay on interaction.
- **Autoplay**: 9s per card, pauses on hover, focus, or any user action.
- **Dots**: active dot is `w-6 h-2 rounded-full` with cyan glow (bigger, more visible), inactive `w-2 h-2`.
- **Desktop side arrows**: `ChevronLeft/Right` circular buttons on larger screens (`hidden sm:flex`).
- **Proof layer strip**: 5 condensed metric tiles below carousel showing all results at a glance (mobile 2-col, desktop 5-col).
- Full ES/EN i18n. 16 `data-testid` anchors. Lint clean.
- Verified: carousel swipe works (`+40%` → `-$52K` on next click), all testids present, no horizontal overflow.

### Feb 25, 2026 — Comparison Page Polish: OG meta, scroll fixes, why-quantro section
Follow-up iteration on the comparison page to address 3 user-reported issues plus 1 enhancement:
- **Fix: double logo** in header (`[icon] Quantro Quantro`). Root cause: default export of `QuantroLogoMark.jsx` file is `QuantroLogo` (full version with built-in wordmark). Fixed by importing the named `{ QuantroLogoMark }` icon-only export + keeping a single explicit wordmark span.
- **Fix: scroll jumping to bottom** on route entry. React Router preserves scroll position across SPA transitions; added `useEffect(() => window.scrollTo(0,0), [location.pathname])` inside `ComparisonPage`. Verified `scrollY === 0` on `/vs-eos` mount.
- **New: `WhyQuantroSection` replacing `FinalCTASection`** (rewritten, 1.7× richer): eyebrow "Por qué Quantro" / "Why Quantro" → same 2-line closing headline → descriptive paragraph → **3-pillar differentiator cards** (Inteligencia/Brain, Decisión/Lightbulb, Ejecución/Workflow) with fade-in stagger → bottom spotlight CTA card "Inteligencia + decisión + ejecución en un solo sistema" + primary button. Section gets `id="why-quantro"` + `scroll-mt-24` (compensates sticky header).
- **Secondary CTA repurposed**: "Ver cómo funciona Quantro" used to `navigate("/")` + scroll to `#intelligence` (wrong page). Now does `document.getElementById("why-quantro").scrollIntoView({ behavior: "smooth", block: "start" })`. Verified scroll diff ≤ 100px.
- **Dynamic Open Graph meta** via new helper `/app/frontend/src/lib/pageMeta.js` (`applyPageMeta({ title, description, url, ogTitle, ogDescription, twitterCard })`). Creates/updates: `title`, `meta[name=description]`, `link[rel=canonical]`, `og:title`, `og:description`, `og:url`, `og:type=website`, `og:image` (optional), `twitter:title`, `twitter:description`, `twitter:card=summary_large_image`, `twitter:image` (optional). Returns a cleanup function that restores the previous state so unmounting doesn't leak meta to the next route.
- **Per-variant OG config** (`META_CONFIG` in `ComparisonPage.jsx`):
  - `/vs-ninety` — og:title `Quantro vs Ninety` / og:desc `Ve cómo Quantro va más allá del tracking EOS.`
  - `/vs-eos` — og:title `Quantro vs EOS One` / og:desc `Compara cómo Quantro conecta estrategia, decisiones y ejecución en un solo sistema.`
  - `/vs-notion` — og:title `Quantro vs Notion` / og:desc `Descubre por qué Quantro no solo organiza información, sino que opera tu negocio.`
  - `/comparacion` + `/comparison` — general variants with bilingual copy.
- Canonical URLs use `https://quantro.io` as base (update when production domain is finalized).
- Lint clean on both files.

### Feb 25, 2026 — Comparison Page (`/comparacion` + 3 focused variants)
- **New page** `/app/frontend/src/pages/ComparisonPage.jsx` with optional `focusKey` prop for variant routing.
- **5 routes** registered in `index.js`:
  - `/comparacion` (ES) + `/comparison` (EN) → general comparison (all 3 competitors)
  - `/vs-ninety` → spotlight Quantro vs Ninety (other competitors dimmed)
  - `/vs-eos` → spotlight Quantro vs EOS One
  - `/vs-notion` → spotlight Quantro vs Notion + Excel + CRM
- **Dynamic `document.title`** per variant: `Quantro vs {Competitor} | Quantro` or `Comparación | Quantro`.
- **8 sections** (Apple/Stripe/Linear clean aesthetic, no aggressive attacks on competitors):
  1. Hero with dual CTAs (primary "Empieza por $1 USD" + secondary "Ver cómo funciona Quantro")
  2. Problem section — 5 bullets of what other systems don't do (with red ✖ markers)
  3. **12-row comparison table** — 4 columns (Quantro + Ninety + EOS One + Notion+Excel+CRM), cells with ✓/−/✖ icons (cyan/amber/slate) and a legend row. Quantro column highlighted with cyan underline + subtle bg tint. Focus variants dim non-focused competitor columns to `opacity-30` while preserving full context.
  4. "Sistema de decisión" — dual-card layout ("Otros / Te muestran lo que pasa" vs "Quantro / Te dice qué hacer") with 3-chip flow: Problema → Recomendación → Acción
  5. Before/After — left card with stack of fragmented tools + right card with 5-item Quantro list (Dashboard/Inteligencia/Decisiones/Ejecución/Equipo). Before items customize per focus variant.
  6. Real example — "Leads por debajo de meta" + Otros vs Quantro (5-step reaction: detecta → propone → To-Do → asigna → seguimiento)
  7. Audience — 4 target profiles
  8. Final CTA in a spotlight card
- **Architecture refactor**: `PlatformAccessProvider` + `AuthRouteBoot` lifted from `App.js` into `index.js` so the comparison page (and future standalone pages) can consume `usePlatformAccess()` without wrapping landing-specific tree.
- **Footer**: added `/comparacion` link on the landing footer for discoverability + internal cross-page nav on comparison footer (`vs Ninety`, `vs EOS`, `vs Notion`).
- **GA4 tracking**: `comparison_page_primary[_variant]`, `comparison_page_secondary[_variant]`, `compare-final-cta-btn`.
- **Full ES/EN i18n**, lint clean, 20+ `data-testid` anchors including `comparison-page`, `compare-hero`, `compare-table`, `compare-row-[key]`, `compare-col-[name]`, `compare-final-cta-btn`.
- **Verified E2E**: all 5 routes return correct `data-focus`, titles, 12 table rows, hero + table + CTA present.

### Feb 25, 2026 — People OS section (interactive tabbed mockup)
- **New section** `/app/frontend/src/components/sections/PeopleOSSection.jsx` registered in `App.js` right after `InventoryIntelligenceSection`, anchor `#people-os`.
- **Layout**: 2-column grid (`lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]`). Left: narrative. Right: interactive app mockup.
- **Narrative (left)**: eyebrow `PEOPLE OS` → headline `"Las personas correctas, donde generan impacto."` with cyan gradient → subheadline → 5 bullets → closing subtle line `"Antes, tu equipo vivía en múltiples herramientas. Ahora vive dentro de Quantro."`
- **Interactive mockup (right)**: app chrome (3 macOS dots + `QUANTRO OS · PEOPLE` + live pulse), 5 clickable pill tabs with icons:
  1. **Directorio** — search input + "Departamentos" and "Personas" empty states
  2. **Accesos** — CTA "Invitar persona", filter chips (Todos / Roles / Departamentos / Ubicación), 4 role cards (Owner/Leader/Member/Viewer) with distinct accent colors (amber/cyan/light-cyan/slate)
  3. **Onboarding** — 4 metric tiles (Activos / Pendientes / Sin acceso / % Onboarding) + empty state
  4. **Permisos** (badge `Próximo`) — purple teaser card with 4 bullets + disabled "Próximamente" CTA
  5. **Auditoría** — live pulse badge + 4 sample activity rows with timestamps
- `AnimatePresence` crossfade (0.25s) between tabs; no carousel.
- Full ES/EN i18n via `useLanguage`.
- 13 `data-testid` anchors: `people-os-section`, `people-narrative`, `people-headline`, `people-bullets`, `people-mockup`, `people-tabs`, `people-tab-btn-[directorio|accesos|onboarding|permisos|auditoria]`, `people-permisos-badge`, `people-tab-[name]` body wrappers, `people-invite-btn`, `people-role-[owner|leader|member|viewer]`, `people-permisos-cta`.
- Verified end-to-end: all 5 tabs click-switch correctly; all role cards render; "Próximo" badge visible on Permisos tab; lint clean.

### Feb 25, 2026 — Inventory Motion Loop + PlatformAccessScreen Refactor

**A) Motion loop visualizando el ciclo de recomendación** (`/app/frontend/src/components/sections/InventoryMotionLoop.jsx`):
- 5 fases sincronizadas en un ciclo de 4.5s (`repeat: Infinity`):
  1. Bell pulsa rojo + label "Faltante detectado"
  2. Badge "Aprobado" cyan fade-in + label cambia a "Movimiento aprobado"
  3. Paquete viaja por SVG path Bézier (Bodega Central → Tienda CDMX) usando `offsetPath`
  4. Barra origen baja (1.0 → 0.6), barra destino sube (0.2 → 0.95) sincronizadas con el viaje
  5. Badge "Resuelto" emerald pop, hold, reset
- Path activo se ilumina progresivamente con `pathLength` framer-motion + drop-shadow cyan
- Label flotante "25 unidades" durante el viaje
- Integrado entre el demo de cards y los impact bullets en `InventoryIntelligenceSection` con eyebrow "Cómo se ve cada ciclo"
- 5 testids: `inventory-motion-loop`, `motion-alert-icon`, `motion-approve-badge`, `motion-units-label`, `motion-resolved-badge`

**B) Refactor `PlatformAccessScreen.jsx` 792 → 377 líneas (-52%)**:
- 6 paneles extraídos a `/app/frontend/src/components/platformAccess/`:
  - `StepIndicator.jsx` (44 líneas) — indicador de 4 fases
  - `PlatformAccessHeader.jsx` (72 líneas) — eyebrow + h2/p dinámicos por stage + step
  - `ChoosePlanPanel.jsx` (141 líneas) — picker de 3 tiers con `buildTiers(isEs)` + Stripe trigger
  - `OnboardingPanel.jsx` (38 líneas) — nudge + continue button
  - `RedirectPanel.jsx` (75 líneas) — fresh purchase welcome / generic redirect
  - `StatusFooter.jsx` (43 líneas) — strip de auth + plan status
- `PlatformAccessScreen.jsx` quedó como orquestador puro: state machine + URL sync (auth ↔ picker routes) + modal shell
- Helpers extraídos a top-level: `stageToStepIndex`, `deriveFirstName`, `PLAN_LABEL_MAP`, constantes de timing (`FRESH_PURCHASE_WINDOW_MS`, `REDIRECT_DELAY_MS`)
- E2E verificado: `/`, `/acceso`, `/iniciar-sesion`, `/sign-up`, `/sign-in`, `/crear-cuenta`, `/access` siguen funcionando con headers/títulos/forms idénticos al pre-refactor.

### Feb 25, 2026 — Inventory Intelligence (Apple-keynote section)- **New section** `/app/frontend/src/components/sections/InventoryIntelligenceSection.jsx` registered in `App.js` between `IntelligenceSection` (Act 5 reveal) and `SuccessStoriesSection`, anchor `#inventory-intelligence`.
- **Narrative structure** (Apple keynote style):
  1. Eyebrow pill `NUEVO · QUANTRO OS`
  2. Hero statement: `"Y ahora, tu inventario también piensa contigo."` (gradient cyan on the emphasis span)
  3. Subtitle explaining real-time observation
  4. Four capability cards (grid-2 mobile / grid-4 desktop): Faltantes de stock · Exceso de inventario · Movimientos óptimos · Compras inteligentes
  5. Divider `FULFILLMENT INTELIGENTE` with gradient lines
  6. Sub-hero: `"No solo detecta problemas. Propone la solución."`
  7. Two-card demo:
     - Red alert card: `"Estás perdiendo ventas en CDMX. Hay stock disponible en Bodega Central. Mover 25 unidades resolvería el problema."`
     - ArrowDown connector
     - Cyan move card: `MOVER STOCK · 25 unidades`, De `Bodega Central` → A `Tienda CDMX`, primary CTA `"Aprobar movimiento"`
  8. Three impact bullets: menos pérdidas · mejor uso · decisiones rápidas
  9. "Mientras tú duermes" card (Moon icon) → closing hero: `"Despiertas sabiendo exactamente qué mover, qué comprar y dónde actuar."`
- Full ES/EN i18n via `useLanguage`. All stagger animations use framer-motion + `viewport={{ once: true }}`.
- 12 `data-testid` anchors for QA: `inventory-intelligence-section`, `inventory-eyebrow`, `inventory-hero`, `inventory-capabilities`, `inventory-capability-[0..3]`, `inventory-demo`, `inventory-move-card`, `inventory-approve-move`, `inventory-impact`, `inventory-night-card`.
- Verified visually: hero + 4 capabilities + demo card render correctly on desktop; lint clean.

### Feb 23, 2026 — Acceso Screen Redesign (Apple-style) + Pricing Order Fix + New Plan Content
- **New routes** `/acceso` (ES) and `/access` (EN) via `PICKER_ROUTES` in `authRoutes.js`. `AuthRouteBoot` handles both auth and picker routes. `PICKER_PAGE_TITLES`: "Acceso | Quantro" / "Access | Quantro".
- **Decoupled platform picker** from auth orchestration: new component `/app/frontend/src/components/AccessPickerPanel.jsx` replaces the in-modal choose_platform layout. Clicking a card now redirects DIRECTLY to the external product URL (`window.location.href = PLATFORMS[id].url`) — each app handles its own auth. (Pricing flow still uses the chained orchestration when `intent.tier` is set.)
- **Apple-style narrative** (staggered fade-ins via framer-motion):
  - STEP 1 — Statement: "Esto no es una app." → 0.9s later: "Es un sistema que piensa y ejecuta por ti."
  - STEP 2 — Reveal: "Quantro funciona en dos capas" + two glassmorphism cards (OS / Flow)
  - Closing: "Entender es el inicio. / Ejecutar es lo que genera resultados. / Así es como tu negocio avanza."
- **Micro-interactions on cards**: glow intensifies on hover via radial gradient overlay, scale 1.02 + y:-3 lift, animated bottom line sweep, arrow translate on hover.
- **Header microcopy** updated: "Selecciona la experiencia que quieres abrir. Cada sistema opera de forma independiente." (replaces "Te acompañamos paso a paso…"). Stage indicator and H2 hidden on `choose_platform` since the panel has its own narrative.
- **Pricing mobile order FIX** (`PricingSection.jsx`): removed the `order-*` Tailwind classes that forced Pro first on mobile. Stable DOM order `essential → pro → enterprise` on every breakpoint; "Más popular" remains as a badge, not a layout trigger. Verified via Playwright DOM inspection.
- **Pricing plan content rewrite** per user's spec:
  - Essential tagline: "Claridad + control" / subtagline "Perfecto para comenzar con claridad operativa" + 10 bullets (Dashboard, Scorecard, To-Dos, CRM/Inbox, AI Coach 10 queries/mo, Automatizaciones básicas, Insights iniciales, Contabilidad básica, CFDI 4.0).
  - Pro tagline: "Ejecución + inteligencia" / subtagline "Escala con inteligencia, no con esfuerzo" + 8 bullets (Agentes IA ejecutando tareas, Intelligence continuo, Decisiones sugeridas, Automatizaciones avanzadas, 3 asientos, Contabilidad avanzada impulsada por Intelligence, CFDI 4.0).
  - Enterprise tagline: "Autonomía real" / subtagline "Para empresas que buscan autonomía total" + 10 bullets (Motor de decisiones avanzado, Simulación de escenarios, 10 asientos, Lean Management Module, Quantro Revenue, Onboarding dedicado, Soporte prioritario, Agentes personalizados "próximamente", Integraciones avanzadas "próximamente").
- Added `subtagline` field next to `tagline` in the card render for a two-line tier description.

### Feb 23, 2026 — Auth Routes + full_name + Pricing Current Plan + Avatar Dropdown
- **Real auth routes** (React Router): `/iniciar-sesion`, `/crear-cuenta`, `/sign-in`, `/sign-up` (mapping in `/app/frontend/src/lib/authRoutes.js`). Each route auto-opens `PlatformAccessScreen` at auth stage via new `AuthRouteBoot` component, which also sets `document.title` from `AUTH_PAGE_TITLES` and syncs language with URL.
- **Bidirectional URL↔mode↔language sync**: switching AuthForm mode updates the URL (`switch to signup on /iniciar-sesion → /crear-cuenta`); switching language on an auth route redirects to the equivalent path (`/iniciar-sesion + click EN → /sign-in`). After successful auth from an auth route, navigates to `location.state.from || '/'`.
- **LanguageSwitcher inside the modal header** (`top-right, next to close button`): the `z-70` overlay previously blocked clicks on the navbar toggle — regression surfaced by QA iteration_20 — now resolved by rendering a compact switcher inside the modal card.
- **`full_name` in signup**: AuthForm now has a required `User`-icon input with `isValidFullName(name)` regex validation (min 2 words). Rejected inputs show `"Ingresa tu nombre y apellido."`. On successful `supabase.auth.signUp`, `full_name` is passed in `options.data` (user_metadata) AND upserted to `profiles.full_name` when a session exists.
- **AuthForm mode title fix**: the modal H2 now correctly reflects signup mode (`"Crea tu cuenta"` instead of the stale `"Inicia sesión para continuar"`).
- **Pricing current-plan highlight** (`PricingSection.jsx`): when `profile.plan === tier.key`, the card gets a stronger cyan border + "Tu plan actual" / "Your current plan" badge (replaces "Más popular"). CTA becomes `"Plan actual"` (disabled, neutral ring) for current tier and `"Mejorar plan"` / `"Upgrade"` for other tiers when user has any active plan.
- **UserAvatarPopover → Dropdown**: now includes a 3-item action menu below the header + plan row:
  - **Ajustes / Settings** → opens Quantro OS in a new tab
  - **Pagar / Billing** → scrolls to `#pricing` (consistent with "Cambiar plan")
  - **Salir / Sign out** → `supabase.auth.signOut()` + reopens PlatformAccessScreen
- **QA coverage (iteration_20)**: 10/12 features PASS. 1 critical issue (LanguageSwitcher unreachable under modal) was fixed in the same session. Authenticated-only assertions (avatar dropdown, current-plan badge) await a confirmed Supabase test account.

### Feb 23, 2026 — Avatar + Account Popover (Stripe/Linear-style)
- **New helper** `/app/frontend/src/lib/userIdentity.js` → `getUserInitials(user, profile)` with priority `profile.full_name` (first + last word initial, or first 2 chars if single word) → email local-part (first 2 chars). Returns null when no signal. `deriveInitials({user,profile})` kept as deprecated alias.
- **`full_name` added to PROFILE_COLUMNS** in `useUserBillingState.js` (DB already had the column — no schema change).
- **New component** `/app/frontend/src/components/UserAvatarPopover.jsx`: circular cyan-gradient avatar button. On click opens a Radix Popover (bg `#0B1220`) with three sections:
  1. Header: large initials + `full_name` (if present) + `email`
  2. Active plan: pill badge (`essential|pro|enterprise` + billing cycle) with glowing dot when plan exists, muted "Sin plan activo" otherwise
  3. Footer: "Cambiar plan" action scrolling to `#pricing`
  - GA4 events: `<source>_avatar_open`, `<source>_avatar_change_plan` (source = `navbar` or `mobile`).
- **Navbar integration**: avatar is a SEPARATE tap target from "Ver mi plan" — desktop: `[avatar] [Cambiar cuenta] [Ver mi plan]`; mobile menu: avatar centered above the button stack with `size="md"`.
- Unit test (node) validated initials for 10 cases (JP, MG, JU, A, JU, AL, A, null, null, KK).
- Smoke screenshot confirms unauthenticated navbar intact.

### Feb 23, 2026 — Authenticated Navbar UX + Flow URL live + Signup redirect
- **Quantro Flow URL live**: `PLATFORMS.flow.url` updated from mock to production domain `https://quantroflow.online` in `/app/frontend/src/lib/platformRoutes.js`.
- **Desktop authenticated CTA overhaul** (`/app/frontend/src/components/Navbar.jsx`):
  - Before: single amber "Actualizar pago" / cyan "Ir al sistema" CTA.
  - After (when `isAuthenticated`): inline `[ Cambiar cuenta ]` (ghost, white/10 border, low-weight) + `[ Ver mi plan ]` (cyan primary gradient). Unauthenticated state unchanged (single "Comenzar" CTA).
  - `Ver mi plan` scrolls to `#pricing` (no Stripe direct). `Cambiar cuenta` calls `supabase.auth.signOut()` then opens `PlatformAccessScreen`.
- **Mobile authenticated menu**: same button semantics as before (stacked `Cambiar cuenta` over `Ver mi plan`), now uses shared handlers with source-aware GA4 tracking (`navbar_*` vs `mobile_menu_*`).
- **Signup email confirmation support** (`/app/frontend/src/components/auth/AuthForm.jsx`): `supabase.auth.signUp` now passes `options.emailRedirectTo: window.location.origin` so the confirmation link routes users back to the landing. UI already handles the "session: null" (awaiting confirmation) case with the `auth-info` banner.
- Strategic UX shift: from urgency-driven ("paga ahora") to status-driven ("revisa tu estado") — more premium, lower friction.
- Testing: self-verified unauthenticated desktop + landing via screenshot; authenticated state relies on user Supabase session for end-to-end verification.


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

### May 1, 2026 — Landing + Animation Polish (P0)
- New `ComparisonSummarySection` added between Differentiation and Pricing
  with a clean Apple/Stripe two-column layout (Otros sistemas vs Quantro).
- Primary CTA "Ver comparativa completa" navigates via React Router
  `<Link to="/comparacion">` (no anchor scroll), scrolls to top on mount.
- New "Comparativa" link added to desktop + mobile Navbar
  (`data-testid="nav-comparison"` / `mobile-nav-comparison`).
- Moon→Sun cross-fade animation added to the "Mientras tú duermes" card
  inside `InventoryIntelligenceSection` (Framer Motion, 7s gentle loop,
  warm amber glow on the sun layer).

### May 1, 2026 — Mobile responsive + comparison page polish (P0)
- People OS section made fully mobile-safe: headline uses
  `clamp(28px, 8.5vw, 48px)` with `overflow-wrap:anywhere` and `max-w-full`;
  both grid items and the mockup container now carry `min-w-0 w-full max-w-full`.
  Verified at 390px viewport: `bodyScrollW === bodyClientW`, no horizontal
  overflow, headline 33px, mockup 350px wide.
- `no-scrollbar` utility added to `index.css` and applied to People OS tabs +
  filter chips so the horizontal scroll feels premium (no visible bar).
- Comparison page table now wraps in `data-testid="compare-table-scroll"`
  with `overflow-x:auto`, `-webkit-overflow-scrolling:touch` and an inner
  `min-w-[760px]`. Page vertical scroll preserved. Mobile hint text appears
  under the table on small viewports.
- New `EvolvingNoteCard` glass component added directly under the comparison
  table: badge "Actualizaciones constantes", headline "Quantro evoluciona
  cada semana." with cyan/violet ambient gradient and Zap icon.

### May 1, 2026 — Mini-changelog + execution-visibility row (P0)
- Mini-changelog integrated INSIDE `EvolvingNoteCard` (3 latest releases,
  date · name · badge · 1-line copy). Badges color-coded: Nuevo (cyan),
  Potenciado (violet), Beta (amber). Hairline dividers, no heavy timeline.
- New comparison-table row "Visibilidad de ejecución en tiempo real /
  Real-time execution visibility" added with per-cell tooltips
  (Radix Tooltip wrapped page in `TooltipProvider`).
- `ComparisonCell` extended to render an optional `Live` cyan pill alongside
  the check on Quantro's column for the new row + tooltip-on-hover for all
  cells in that row, explaining the differentiator in plain Spanish/English.

### May 1, 2026 — Favicon + Animated Q + Interactive "Por qué Quantro" (P0)
- Favicon system rebuilt: generated `favicon.ico` (multi-size 16/32/48),
  `favicon-32.png`, `favicon-192.png`, `favicon-512.png` via PIL script
  (`/tmp/gen_favicons.py`). Design matches brand (navy glass tile + teal→cyan
  Q). `<head>` now lists real PNG/ICO files + SVG fallback; `theme-color`
  updated to `#0B0F1A`. Verified via curl: all endpoints return 200.
- New `AnimatedQuantroLogo` component (`src/components/AnimatedQuantroLogo.jsx`)
  supporting variants `loading | hover | thinking | complete | idle`. Uses
  Framer Motion `pathLength` draw animation, radial glow pulse, orbiting dot
  for thinking state, and gentle breathing loop. Respects
  `prefers-reduced-motion` (falls back to a static mark).
- `DifferentiationSection` rewritten into an interactive flow: preamble
  "Esto pasa todos los días. Sin que tengas que pedirlo.", 4 cards with
  active-state (hover, tap, autoplay every 3.5s with IntersectionObserver
  gating), flow-indicator dots with animated progress line, live preview
  panel (Ver → KPIs with count-up, Entender → alerting insights, Actuar →
  AI recommendations with "Recomendado" badge, Ejecutar → progress bars +
  checkmarks), final CTA "Empieza con Quantro". Visual language unchanged.

### May 1, 2026 — Manifest.json + 3-col comparison table (P0)
- `public/manifest.json` added with `name`, `short_name`, `description`,
  `start_url`, `display: standalone`, `background_color`, `theme_color` and
  icons 192/512 (maskable). Linked from `index.html` via
  `<link rel="manifest">`. Ready for Google favicon indexing and PWA install.
- Comparison table (`/comparacion`) reduced from 5 columns to 3:
  `Funcionalidad | Quantro | Otros sistemas`. Quantro column is visually
  highlighted (cyan-tinted background + gradient underline glow); "Otros"
  collapses Ninety, EOS, Notion+Excel behind a single consolidated column
  while per-competitor data is preserved in `ROWS[...]` for `/vs-ninety`,
  `/vs-eos`, `/vs-notion` (those pages now show the focused competitor as
  the right column instead of "Otros sistemas").
- New row added: **"Inventario Inteligente / Smart Inventory"** with
  per-cell tooltips explaining the differentiator ("Detecta exceso y
  faltantes y ofrece decisiones de compra o promociones…").

### May 1, 2026 — Hero Section keynote narrative + refined social proof (P0)
- Initial keynote narrative implementation (teaser, signals, decision card,
  animated headline, rotating microcopy, delayed CTA) — now deprecated in
  favour of a lighter static hero for performance and clarity.
- Refined social proof to Notion-style (5 stars + single quote + tiny
  uppercase tracking company row) — retained.

### May 1, 2026 — Hero copy refinement + 4-col comparison table with sticky (P0)
- Hero subheadline simplified to 1–2 short lines with rhythm:
  "Quantro conecta tus datos, detecta oportunidades y te propone acciones
  claras." + "Tú decides. Quantro ejecuta. Quantro Flow automatiza." (ES/EN).
- Pre-header typography upgraded to Apple-level eyebrow: SF Pro Text /
  Inter fallback, medium weight (no bold, no mono), `tracking-[0.2em]`,
  opacity 65%. Slate-400 instead of slate-500.
- Comparison table (`/comparacion`) restored to 4 competitor columns
  (Quantro + Ninety + EOS One + Notion + Excel + CRM) with sticky UX:
  - Fixed-width grid `grid-cols-[240px_170px_160px_160px_180px]`, total
    min-width 910px.
  - **Sticky left columns:** Funcionalidad (sticky `left-0`) and Quantro
    (sticky `left-[240px]`) keep context during horizontal scroll.
  - **Fade edges:** right-side gradient overlay fades in/out based on
    scroll position.
  - **iOS-style scroll progress indicator:** thin 112px track with a 14px
    white dot that glides as the user scrolls. Only renders when the
    table actually overflows (mobile/tablet). Smooth `transition-[left]`
    for buttery motion.
  - **Header overflow fix:** `HeaderCell` + `BodyCell` now use
    `justify-center` by default, `overflow-hidden`, `min-w-0` and
    `break-words` so long taglines never bleed into adjacent columns.
    Taglines shortened ("Tracker EOS", "EOS tradicional", "Stack
    separado") so they fit cleanly at all column widths.
  - Mobile hint "Desliza para comparar" auto-dims when user reaches the
    end of the scroll.
  - Solid `#0B1020` backgrounds on sticky cells prevent bleed-through.
  - Focus variants (`/vs-ninety`, etc.) dim non-focused competitors to
    30% instead of removing them.
- Removed: teaser push-notification, signals floating pool, decision-card
  convergence, headline word-by-word cascade, glow pulse on "decisiones
  listas", CTA fade/glow-pulse, subheadline fade and social-proof fade.
  Hero text is now fully static.
- Primary CTA re-anchored: **"Quantro vs Otros sistemas"** (ES) /
  "Quantro vs other systems" (EN) linking via React Router
  `<Link to="/comparacion">` (or `/comparison`).
- Copy refinements: pre-header "Quantro piensa por ti mientras descansas"
  / "Quantro thinks for you while you rest". Social proof quote updated
  to "Empresas que deciden mejor, usan Quantro" / "Companies that decide
  better, run on Quantro". Company row reorganised into 2 paired lines
  (`Grupo Nexo · Altura Retail` / `Nodo Studios · Grupo OCP`) at 70%
  opacity so it doesn't compete with the headline.
- Only animations that remain in the hero:
  1. `HeroDashboardPreview`'s own subtle loop (live indicator, counters).
  2. A single `AnimatePresence` crossfade on the micro-copy above the
     dashboard that swaps every **5.5s** (from the original 2.6s) so the
     reader has more time to digest each state. Fixed-height wrapper so
     nothing reflows.
- **Dashboard code-split:** `HeroDashboardPreview` is now loaded via
  `React.lazy(() => import(...))`. Desktop viewports (lg+) pre-warm the
  chunk on mount via a `matchMedia` effect so the Suspense fallback never
  shows. Mobile viewports defer the fetch — first paint ships as
  text-only, and the dashboard streams in progressively. A size-matched
  `DashboardSkeleton` prevents layout shift during the Suspense window.

### May 1, 2026 — HeroDashboardPreview as Decision Engine + ownership metric (P0)
- `HeroDashboardPreview` rebuilt from a classic metrics+checklist panel
  into an **intelligent rotating decision narrative**:
  - System status chip: "Quantro Intelligence · 3 oportunidades hoy · 2
    ejecutándose · 1 pendiente" with color-coded pulse dots.
  - **3-decision rotation:** pricing (margin) → ads (efficiency) →
    reactivation (revenue). First decision stays **11s** so readers
    absorb it; subsequent rotations every 11s. Hover / tap pauses the
    rotation — resumes on leave.
  - Cross-fade + 3px blur transition (420ms, easeOutCubic) — no
    carousel, no dots, no slide indicators. Reads as "intelligence",
    not "marketing UI".
  - Both the decision card AND the actions list transition together so
    the story stays coherent (action list adapts to the active decision:
    pricing → 5% uplift actions, ads → pause campaigns, reactivation →
    email sequence).
  - `AnalyzingIndicator` — "Analizando áreas clave" with a trio of
    breathing dots beside the actions heading keeps Quantro visibly
    "thinking" between rotations.
  - Soft counters reset and re-run on every rotation so each narrative's
    numbers (revenue, wasted ads, customer count, potential) ease in
    from 0 in 1.4s.
- Hero microcopy swap logic updated: desktop swaps after 5.5s; mobile
  swaps only when the user scrolls past ~80px (attention-shift trigger).

### May 1, 2026 — Decision rotation refined + Switch to Quantro section (P0)
- Decision rotation timing relaxed: first card stays 15s (up from 11s),
  subsequent rotations every 15s. Cross-fade now 750ms with 5px blur (up
  from 450ms / 3px) — feels significantly more like Apple than carousel.
  Actions list crossfade aligned at 700ms / 4px blur.
- `AnalyzingIndicator` upgraded with a real typing effect: characters
  stream in at ~12/s with a blinking caret. Label is now per-decision
  and reinforces the narrative:
    · Pricing → "Analizando pricing"
    · Ads → "Analizando eficiencia de Ads"
    · Reactivation → "Analizando comportamiento de clientes"
- New section `SwitchToQuantroSection.jsx` added after
  `ComparisonSummarySection`, anchored at `#switch`:
  - Apple-style onboarding narrative "Cámbiate a Quantro sin empezar
    desde cero." + subhead on data import + validation.
  - Left column: 3 numbered glass cards (01 Elige origen / 02 Sube o
    conecta / 03 Quantro entiende tu negocio). Autoplay advances every
    5.2s with IntersectionObserver gating; hover / click pauses.
  - Right column: morphing preview panel with glass chrome ("Quantro ·
    Migración · En vivo") and per-step slides:
      · Source — 8 system cards (Excel, Sheets, QuickBooks, Zoho,
        HubSpot, Monday, Otro, "No sé / necesito ayuda").
      · Upload — animated dropzone (floating cloud icon), CTAs
        "Subir archivo" + "Conectar API", auto-detection strip
        showing file names and row counts.
      · Understand — accuracy header "Precisión del import 97%"
        (count-up) with Duplicados/Errores/Equivalencias, plus a 2x3
        tile grid of detected entities (Clientes 428, Ventas 1,240,
        Productos 86, Miembros 12, Tareas 312) each counting up from 0.
  - CTAs: "Comenzar migración" → PlatformAccess, "Hablar con un
    experto" → `mailto:hello@quantroos.com`. Shield subline:
    "Migración asistida · sin perder datos · sin detener tu operación."
- Navbar (desktop + mobile): added "Cámbiate / Switch" link pointing to
  `#switch`, positioned between "Comparativa" and "Precios".
- Success Stories — "ownership" story:
  - Primary metric changed from `0 tareas sin responsable` →
    `100% tareas asignadas` (+ EN equivalent).
  - Context subtext: "Cada tarea tiene un responsable claro y visible
    para todo el equipo." / "Every task has a clear owner visible to
    the whole team."
  - New `metricSecondary` field renders a secondary glass card below
    the primary: `+35% velocidad operativa` / `+35% operational speed`
    with subtext about execution clarity.
  - Added `AnimatedMetric` helper that parses prefix (+/-/$), digit,
    suffix (%/K/M) and count-ups from 0 to target in 1.3s easeOutCubic.
    Reruns whenever `activeKey` changes so numbers restart per story.
  - Proof strip reordered: `100% asignadas`, `+35% velocidad`,
    `-50% reuniones`, `100% claridad`.


## 2026-02-01 — Msg 480 feedback batch (Hero microcopy, Migration testimonial, Mobile comparison grid)

Three refinements delivered and visually validated:

### 1. Hero microcopy — 3-step reveal
- `HeroSection.jsx` now crossfades between three lines above the dashboard:
  1. "Mira a Quantro en acción." / "Watch Quantro in action." (initial frame)
  2. "Esto ya está pasando en tu negocio." / "This is already happening in your business."
  3. "Solo necesitas aprobar." / "You just need to approve."
- Desktop: auto-advances on timers — step 1 at `MICROCOPY_STEP1_DELAY_MS` (2.8s),
  step 2 at `MICROCOPY_STEP2_DELAY_MS` (5.5s).
- Mobile: scroll-driven — step 1 appears past 80px, step 2 past 260px, so the
  narrative unfolds as the user reads.
- Validated via DOM `inner_text` polling (desktop): initial="Mira a Quantro en
  acción.", 3.5s later="Esto ya está pasando en tu negocio.", 6.5s later="Solo
  necesitas aprobar."

### 2. Migration testimonial (`MigrationTestimonial`)
- Added directly below the Shield subline in `SwitchToQuantroSection.jsx`.
- Renders a single-line proof answering the implicit "how long?" objection:
  _"Migramos 1 año de Excel en 47 minutos." — Distriglobal Logistics_
- Visual: glass tile (white/[0.02] + white/[0.06] border), 36px circular
  "DL" monogram with brand cyan gradient, italicized blockquote, kicker-style
  attribution in uppercase tracking. `data-testid="switch-testimonial"`.
- English variant: _"We migrated 1 year of Excel in 47 minutes."_

### 3. Comparison table — mobile 3-column lock-in
- `ComparisonPage.jsx` grid template now:
  `grid-cols-[140px_120px_130px_130px_150px]` at base mobile (`min-w-[670px]`),
  scaling up at sm/lg breakpoints.
- Sticky offsets tightened to match new widths:
  `left-0` (Funcionalidad) + `left-[140px] sm:left-[180px] lg:left-[240px]`
  (Quantro column).
- Each sticky cell uses opaque `#0B1020` (or Quantro cyan-gradient) background
  with `z-index: 15 / 14` so scrolling rows paint beneath them — zero text
  overlap during horizontal scroll.
- Verified at viewport 390px (iPhone 14): `clientWidth=340`, sticky stack=260px,
  leaving 80px of the third column (Ninety) visible at rest. Headers H0–H4
  measured at x=25/165/285/415/545 with widths 140/120/130/130/150.
- `z-index` layering confirmed: overflow scroll left-edge reveals Ninety →
  EOS One → Notion without the Quantro column ever fading.

Lint: `mcp_lint_javascript` clean on all three files (HeroSection,
SwitchToQuantroSection, ComparisonPage). No console warnings. Self-tested
via `mcp_screenshot_tool` (desktop 1920 + mobile 414 section-captures).


## 2026-02-01 — Comparison Table fix v2 (Quantro column solidify + desktop width + header copy)

User reported (with screenshots IMG_4800 / IMG_4802 + desktop capture) that:
1. On mobile, when scrolling the inner table horizontally, the Ninety/EOS
   text bled visually through the Quantro sticky column because its
   background gradient started at `rgba(0, 245, 255, 0.05)` — practically
   transparent at the top.
2. On wide desktops the table was capped at `max-w-6xl` (1152px) leaving
   excessive empty side-space and cramped columns.
3. The "Sistema operativo AOS" tagline felt too technical.

Resolved in `pages/ComparisonPage.jsx`:

- `QUANTRO_STICKY_BG` rebuilt as a layered background — a faint cyan
  top-glow gradient over a fully opaque `#081522` base:
  `linear-gradient(180deg, rgba(0,245,255,0.07) 0%, rgba(0,245,255,0) 55%), #081522`.
  Verified via `getComputedStyle`: the second background layer is
  `rgb(8, 21, 34)` solid, so no scrolling cell ever bleeds through.
- Subtle cyan side-borders added on the Quantro sticky column via
  `boxShadow: inset 1px 0 0 rgba(0,245,255,.18), inset -1px 0 0 rgba(0,245,255,.18)`
  (header) and `0.12` alpha for body cells. Glow is visible but never
  obscures the data.
- Z-index unchanged (header 14, body 14) — the opacity fix was the real
  culprit; layering already worked.
- Container expanded from `max-w-6xl` → `max-w-[1400px]`.
- Grid template lg upgraded:
  `lg:grid-cols-[300px_240px_240px_240px_280px]` (1300px total) and inner
  scroll wrapper `lg:min-w-[1300px]` so the table now fills 1398px on a
  1920px viewport instead of 1152px.
- Sticky offset on Quantro column synced to new lg width:
  `lg:left-[300px]`.
- Header tagline rephrased per user direction:
  - ES: "Sistema operativo AOS" → **"Potenciado por AOS"**
  - EN: "AOS OS" → **"Powered by AOS"** (also updated in `COMPETITORS`
    array for the focus-variant pages: `/vs-ninety`, `/vs-eos`, `/vs-notion`).

Validated:
- Lint clean (`mcp_lint_javascript` ✓).
- Desktop screenshot at 1920×900: grid `300px 240px 240px 240px 280px`,
  inner width 1398px, header reads "Quantro / Potenciado por AOS",
  Quantro column has its solid dark base with cyan side-glow, table no
  longer floats in empty space.
- Mobile screenshot at 414×896: 3 columns visible at rest (Funcionalidad
  + Quantro + Ninety partial), zero text bleeding through Quantro on
  horizontal scroll (reproduced exactly the IMG_4800 scroll position at
  `scrollLeft=80`).

## 2026-02-01 — "Recomendado" pill on Quantro column + slower Hero microcopy

### Floating pill on the Quantro comparison column
- Added a small "Recomendado" / "Recommended" pill above the Quantro
  column header in `pages/ComparisonPage.jsx`. Stripe-pricing inspired —
  it sits right above "Quantro" with bright cyan gradient
  (`#00F5FF → #22D3EE`), dark `#031018` text for contrast, an inset cyan
  ring and an outer glow shadow `0 6px 22px -6px rgba(0, 245, 255, .55)`.
- Includes a `Sparkles` icon (8px) and uses `motion.span` with a delayed
  fade-up entrance (`y: -4 → 0`, 0.3s delay, 0.5s ease) so it feels like
  it floats into place when the table comes into view.
- `data-testid="compare-quantro-pill"`. Internationalised. Lives inside
  the existing sticky HeaderCell (no overflow gymnastics) so it scrolls
  perfectly with the column on mobile.

### Slower Hero microcopy rotation (+2 seconds per step)
- `MICROCOPY_STEP1_DELAY_MS`: 2800 → **4800 ms**
- `MICROCOPY_STEP2_DELAY_MS`: 5500 → **7500 ms**
- Hero now reads each line ≈2 seconds longer before swapping — visitors
  have time to register the message before the next one fades in.
- Validated by polling `[data-testid="hero-microcopy"]` every 500ms:
  initial "Mira a Quantro en acción." holds for ~4.6s, then "Esto ya
  está pasando en tu negocio." at ~6.4s, then "Solo necesitas aprobar."
  at ~9.5s — matches the new timers within network latency.

Lint clean on both files. Self-tested via screenshot tool.

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
