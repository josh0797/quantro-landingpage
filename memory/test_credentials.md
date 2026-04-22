# Quantro test credentials

## Admin endpoint `/api/admin/chat/insights`
- user: `admin`
- pass: `quantro-admin-2026`

## Supabase (shared with Quantro OS)
- URL: `https://ukootpnechabpmwsmxsi.supabase.co`
- Anon key: in `/app/frontend/.env` (`REACT_APP_SUPABASE_ANON_KEY`)
- Profiles table columns used by the landing:
  `id, email, company_name, industry, language, plan, billing_cycle, stripe_customer_id, stripe_subscription_id, plan_updated_at`
- Valid plans: `essential | pro | enterprise`
- The testing agent may create a throwaway account via `supabase.auth.signUp`
  using the same anon key; cleanup is optional.

## Platform redirect URLs (see /app/frontend/src/lib/platformRoutes.js)
- Quantro OS: `https://quantro-os.emergent.host/dashboard`
- Quantro Flow: **not yet wired** — renders as "Próximamente" disabled card
