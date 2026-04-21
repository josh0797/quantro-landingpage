# Test Credentials

## Admin Panel
- **Endpoint**: `GET /api/admin/chat/insights?days=30&limit=10`
- **Auth**: HTTP Basic
- **Username**: `admin`
- **Password**: `quantro-admin-2026`

Example:
```bash
curl -u "admin:quantro-admin-2026" \
  "https://decision-engine-61.preview.emergentagent.com/api/admin/chat/insights?days=30&limit=10"
```

## Stripe
- Test key pre-configured in `/app/backend/.env` (`STRIPE_API_KEY=sk_test_emergent`)
- Any Stripe test card will work (e.g. `4242 4242 4242 4242`)

## Emergent LLM Key
- Configured in `/app/backend/.env` (`EMERGENT_LLM_KEY=sk-emergent-...`)
- Uses `gpt-4o-mini` for the support chat

## Resend
- Live API key in `/app/backend/.env`, sender: `no-reply@quantroos.com`
