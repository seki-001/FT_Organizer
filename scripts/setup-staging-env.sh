#!/usr/bin/env bash
# Push staging environment variables to Vercel production (+ development for local pull).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SITE_URL="${STAGING_SITE_URL:-https://ft-organizer.vercel.app}"
SUPABASE_URL="${STAGING_SUPABASE_URL:-https://ysafyvvqzzxdcikurvpo.supabase.co}"

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

SUPABASE_ANON="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"
SUPABASE_SERVICE="${SUPABASE_SERVICE_ROLE_KEY:-}"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-$(openssl rand -base64 32)}"

if [[ -z "$SUPABASE_ANON" || -z "$SUPABASE_SERVICE" ]]; then
  echo "ERROR: Set Supabase keys in .env.local"
  exit 1
fi

add_env() {
  local name="$1"
  local value="$2"
  for env in production development; do
    vercel env rm "$name" "$env" --yes 2>/dev/null || true
    printf '%s' "$value" | vercel env add "$name" "$env" --yes
  done
  echo "  ✓ $name"
}

echo "→ Configuring Vercel production env for $SITE_URL"
add_env "NEXT_PUBLIC_SITE_URL" "$SITE_URL"
add_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON"
add_env "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE"
add_env "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
add_env "NEXTAUTH_URL" "$SITE_URL"
add_env "MPESA_ENV" "sandbox"
add_env "MPESA_SHORTCODE" "174379"
add_env "MPESA_PASSKEY" "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6d6a9f5420aaf"
add_env "MPESA_MODE" "paybill"
add_env "MPESA_CALLBACK_URL" "$SITE_URL/api/payments/mpesa/callback"
add_env "NEXT_PUBLIC_MPESA_PAYBILL" "174379"
add_env "NEXT_PUBLIC_MPESA_ACCOUNT_NAME" "Faith The Organizer"
add_env "NEXT_PUBLIC_MPESA_MODE" "paybill"

if [[ -n "${MPESA_CONSUMER_KEY:-}" ]]; then
  add_env "MPESA_CONSUMER_KEY" "$MPESA_CONSUMER_KEY"
  add_env "MPESA_CONSUMER_SECRET" "$MPESA_CONSUMER_SECRET"
fi

if [[ -n "${PAYSTACK_SECRET_KEY:-}" ]]; then
  add_env "PAYSTACK_SECRET_KEY" "$PAYSTACK_SECRET_KEY"
  add_env "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY" "${NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:-}"
fi

echo "Done. Redeploy: vercel --prod"
