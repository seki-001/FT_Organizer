# Staging deployment — team testing guide

Use this checklist before sharing the staging link with your team.

## Staging URL

| Environment | Branch | URL |
|-------------|--------|-----|
| **Staging** | `dev` | `https://ft-organizer.vercel.app` (or your Vercel preview URL) |
| Production | `main` | `https://www.organizer.co.ke` |

Push to `dev` → Vercel auto-deploys staging in ~60 seconds.

**Health check:** `GET /api/health` — should return `status: "ok"` with `supabase`, `supabaseAdmin`, `mpesa`, and `paystack` all `true`.

---

## Sharing staging with clients or testers

Per-deployment preview URLs (e.g. `ft-organizer-abc123-….vercel.app`) are **protected by default** — outsiders see a Vercel login / “Request Access” screen. This is normal Vercel behaviour, not a bug in the app.

### Option A — Shareable link (recommended for one-off reviews)

1. Vercel → **ft-organizer** → **Deployments**
2. Open the latest **`dev`** deployment
3. Click **Share**
4. Set access to **Anyone with the link**
5. Copy and send **that URL** (it includes a bypass token in the query string)

Recipients can open it without a Vercel account.

### Option B — Stable public staging URL

Use **`https://ft-organizer.vercel.app`** if it is assigned to the `dev` branch in Vercel → Settings → Domains. That domain is often public (no login wall).

To make a custom preview domain always public: Vercel → **Deployment Protection** → **Deployment Protection Exceptions** → add the domain.

### Option C — Invite collaborators

Vercel → Project → **Settings** → **Members** — invite them as Viewers so they can open protected previews after logging into Vercel.

---

## 1. Vercel environment variables (staging)

Set these in **Vercel → Project → Settings → Environment Variables** for **Preview** and/or **Development** (not Production until go-live):

### Required — database & auth

```
NEXT_PUBLIC_SUPABASE_URL=https://ysafyvvqzzxdcikurvpo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard — server only>
NEXT_PUBLIC_SITE_URL=https://ft-organizer.vercel.app
```

`SUPABASE_SERVICE_ROLE_KEY` is required for orders, bookings, and payment audit logs. Without it, checkout returns 503.

### M-Pesa sandbox (Daraja test)

```
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=<your sandbox consumer key>
MPESA_CONSUMER_SECRET=<your sandbox consumer secret>
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6d6a9f5420aaf
MPESA_MODE=paybill
MPESA_CALLBACK_URL=https://ft-organizer.vercel.app/api/payments/mpesa/callback
NEXT_PUBLIC_MPESA_PAYBILL=174379
NEXT_PUBLIC_MPESA_ACCOUNT_NAME=Faith The Organizer
NEXT_PUBLIC_MPESA_MODE=paybill
```

**Sandbox test phone:** `254708374149` · **PIN:** `174379`

Register `MPESA_CALLBACK_URL` in the [Safaricom Daraja portal](https://developer.safaricom.co.ke) under your app’s callback URLs.

### Paystack test

```
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

In [Paystack Dashboard](https://dashboard.paystack.com) → Settings → API Keys, use **test** keys.

Set callback URL to: `https://ft-organizer.vercel.app/pay/callback`

### Email (optional for staging)

```
RESEND_API_KEY=<your key>
AUTH_SMTP_FROM_EMAIL=onboarding@resend.dev
```

---

## 2. Supabase setup

1. Run migrations: `supabase db push` (or apply via Supabase SQL editor).
2. Run seed: `supabase db seed` or paste `supabase/seed.sql`.
3. **Auth redirect URLs** (Supabase Dashboard → Authentication → URL Configuration):
   - Site URL: `https://ft-organizer.vercel.app`
   - Redirect URLs (wildcards for Vercel previews):
     - `http://localhost:3000/**`
     - `https://ft-organizer.vercel.app/**`
     - `https://*-peterssekirevu-7401s-projects.vercel.app/**`
   - Or push from repo: `printf 'Y\n' | supabase config push --project-ref ysafyvvqzzxdcikurvpo`
4. **Google sign-in** (Supabase → Authentication → Providers → Google): enable and add Client ID + Secret from [Google Cloud Console](https://console.cloud.google.com/). In Google, set authorized redirect URI to `https://<your-project-ref>.supabase.co/auth/v1/callback`.
5. **Promote a team admin** after first sign-up:
   ```sql
   UPDATE public.profiles SET role = 'admin'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
   ```

---

## 3. What your team can test

| Flow | URL | Expected |
|------|-----|----------|
| Shop & cart | `/shop` | Products from Supabase seed |
| Checkout | `/checkout` | Order saved to DB on payment step |
| M-Pesa STK | Checkout → M-Pesa | STK push on sandbox phone |
| Paystack card | Checkout → Card | Redirect to Paystack test page |
| Standalone pay | `/pay` | Paybill info + STK / Paystack |
| My orders | `/account/orders` | Shows orders linked to logged-in user |
| Admin orders | `/admin/orders` | Live orders from database |
| Bookings | `/book` | Saved to Supabase |
| Admin bookings | `/admin/bookings` | Live bookings from database |
| POS | `/admin/pos` | In-store sales (localStorage until DB wired) |

### Test promo codes (from seed)

- `FIRSTORDER` — 10% off
- `FAITH20` — 20% off orders over KSh 5,000
- `MARCH500` — KSh 500 off orders over KSh 2,000

---

## 4. Payment sandbox notes

- **M-Pesa:** Without consumer key/secret, STK runs in **mock mode** (auto-succeeds after ~6 seconds). With keys, real sandbox STK is sent.
- **Paystack:** Without secret key, card payments mock-redirect to confirmation. With test keys, full Paystack test flow works.
- **No real money** moves in sandbox/test mode.

---

## 5. After team feedback → production

1. Create separate Supabase project for production.
2. Swap to live Daraja credentials (`MPESA_ENV=production`).
3. Swap to live Paystack keys (`sk_live_…` / `pk_live_…`).
4. Set `NEXT_PUBLIC_SITE_URL=https://www.organizer.co.ke`.
5. Merge `dev` → `main` after staging sign-off.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Checkout says "Orders not available" | Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel, redeploy |
| `/api/health` returns 503 | Missing Supabase keys |
| M-Pesa STK never completes | Check `MPESA_CALLBACK_URL` is HTTPS and registered in Daraja |
| Paystack redirect fails | Add staging URL to Paystack callback whitelist |
| Admin shows mock data | Log in as admin; check `/api/admin/orders` returns 200 |
| Empty shop | Run `supabase/seed.sql` or import products via admin |
| Google sign-in fails | Enable Google in Supabase Providers; push auth config (`supabase config push`) so preview `*.vercel.app` URLs are allowed; redeploy after setting `NEXT_PUBLIC_SUPABASE_*` on Vercel |
| Google sign-in redirects to production | Supabase redirect allow-list missing preview wildcard — run `supabase config push` for staging project |
