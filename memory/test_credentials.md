# Quantro test credentials

## Admin endpoint `/api/admin/chat/insights`
- user: `admin`
- pass: `quantro-admin-2026`

## Supabase (shared with Quantro OS)
- URL: `https://ukootpnechabpmwsmxsi.supabase.co`
- Anon key: in `/app/frontend/.env` (`REACT_APP_SUPABASE_ANON_KEY`)
- Profiles table columns (verified via CSV dump):
  `id, full_name, company_name, role, created_at, email, client_id, plan,
   country, industry, paypal_subscription_id, billing_cycle, plan_updated_at,
   stripe_subscription_id, stripe_customer_id, language`
- Valid plans: `essential | pro | enterprise`
- NOTE: Supabase project has email confirmation ENABLED. Signup returns
  `session: null` until the confirmation email is clicked; the UI shows an
  `auth-info` banner in that case.
- NOTE: The Supabase `/auth/v1/signup` endpoint returned HTTP 500 for
  `@quantrotest.com` addresses during testing — likely SMTP/disposable-domain
  policy. Use a real domain (e.g. Gmail) for test signups or whitelist the
  test domain in Supabase Auth settings.

## Confirmed test account for authenticated flows
- **Not yet provided.** Authenticated-only flows currently skipped by QA:
  - Avatar popover actions (Ajustes / Pagar / Salir)
  - Pricing "Tu plan actual" badge + "Plan actual" / "Mejorar plan" CTAs
  - Post-auth redirect from /iniciar-sesion → /
- Please add an email + password here when available so the testing agent
  can cover them end-to-end.

## Auth route deep-linking (verified 2026-04-23)
- `/iniciar-sesion` → login, title "Iniciar sesión | Quantro"
- `/crear-cuenta`   → signup, title "Crear cuenta | Quantro", full_name field required
- `/sign-in`        → login, title "Sign in | Quantro"
- `/sign-up`        → signup, title "Create account | Quantro"
- Language toggle inside the modal (top-right, next to close) bidirectionally
  redirects: ES ↔ EN paths stay in sync.

## Platform redirect URLs (see /app/frontend/src/lib/platformRoutes.js)
- Quantro OS: `https://konta-seven.vercel.app`
- Quantro Flow: `https://quantroflow.online`
