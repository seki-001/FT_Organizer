# Production deployment — organizer.co.ke

Branch flow: `dev` (staging) → test → merge to `main` (production). Hosting: Vercel. Backend: Supabase (free plan is enough to launch).

## 1. Supabase production project
1. Create a **new** Supabase project (separate from staging). Region: closest to Nairobi (e.g. `eu-west`/`ap-south`).
2. SQL Editor → run every file in `supabase/migrations/` in filename order (7 existing + `20260704100000_create_business_ops.sql` + `20260704110000_security_hardening.sql`).
3. Load the shop catalog: run `supabase/catalog.sql` (397 products, idempotent). **Do not run `supabase/seed.sql`** — it holds test coupons and sample posts.
4. Authentication → URL Configuration: Site URL `https://www.organizer.co.ke`; Redirect URLs `https://www.organizer.co.ke/**` and `https://organizer.co.ke/**`.
5. Authentication → Providers → Google: enable with production Google OAuth client; add `https://<project-ref>.supabase.co/auth/v1/callback` in Google Cloud.
6. Authentication → SMTP: Resend (verify `organizer.co.ke` in Resend first).
7. Create Faith's account (register on the live site), then in SQL Editor:
   `update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'faith@organizer.co.ke');`
8. Update real stock counts in `/admin/products` (catalog.sql uses placeholder counts; ratings/reviews start at 0).

## 2. Vercel environment variables (Production scope only)
`NEXT_PUBLIC_SITE_URL=https://www.organizer.co.ke`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only),
`PAYSTACK_SECRET_KEY` (sk_live), `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (pk_live),
`MPESA_ENV=production`, `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_MODE`, `MPESA_CALLBACK_URL=https://www.organizer.co.ke/api/payments/mpesa/callback`, `NEXT_PUBLIC_MPESA_PAYBILL`/`NEXT_PUBLIC_MPESA_TILL`,
`RESEND_API_KEY`, `AUTH_SMTP_FROM_EMAIL`, optional Sentry vars. Never set `ALLOW_MOCK_DATA` in production.

## 3. Payments
- Paystack dashboard → Settings → API & Webhooks: webhook URL `https://www.organizer.co.ke/api/payments/paystack/webhook`.
- Production refuses to fake payments: if keys are missing, card/M-Pesa return "temporarily unavailable" instead of marking orders paid.
- Orders are always repriced on the server (prices, stock, coupon, delivery fee); client totals are only checked for consistency.

## 4. Domain (Truehost DNS)
Add in the Truehost DNS zone for `organizer.co.ke` (remove any old A/AAAA/CNAME for `@` and `www`; keep MX/TXT records for email):
| Type | Host | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
Vercel → Project → Domains: `www.organizer.co.ke` (primary) and `organizer.co.ke` (redirects to www). Propagation can take up to a few hours.

## 5. Go-live checklist
- `/api/health` returns `status: ok` with supabase, supabaseAdmin, paystack, mpesa all true.
- Place a test order (COD), then a Paystack live payment of a small amount; confirm order flips to paid (also via webhook with the tab closed).
- Log in as admin: `/admin` shows real (initially empty) dashboards; record a POS sale and an expense and confirm they persist after refresh.
- `https://www.organizer.co.ke/robots.txt` allows indexing; submit `/sitemap.xml` in Google Search Console.

## 6. Security notes
- `20260704110000_security_hardening.sql` closes a privilege-escalation hole (users could register or edit themselves into the `admin` role) and enables shared rate limiting. **Run it on staging too.** Afterwards audit admins: `select p.id, u.email, p.role from public.profiles p join auth.users u on u.id = p.id where p.role = 'admin';`
- Admin promotion is only possible from the Supabase SQL editor / service role.
- Keep the GitHub repo private if it is not meant to be public; never commit `.env*` files.
- Rotate any key that was ever pasted into chat or a ticket (Supabase service role, Paystack, M-Pesa).
