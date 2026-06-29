#!/usr/bin/env bash
# Push Supabase auth config (email confirmation + Resend SMTP) to staging and production.
# Requires: RESEND_API_KEY in environment (or in supabase/deploy-credentials.local).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f supabase/deploy-credentials.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source supabase/deploy-credentials.local
  set +a
  export SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET:-}"
fi

if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo "ERROR: Set RESEND_API_KEY in your shell or supabase/deploy-credentials.local"
  echo "  Get one at https://resend.com/api-keys"
  echo "  Until organizer.co.ke is verified, use AUTH_SMTP_FROM_EMAIL=onboarding@resend.dev"
  exit 1
fi

export AUTH_SMTP_FROM_EMAIL="${AUTH_SMTP_FROM_EMAIL:-onboarding@resend.dev}"

STAGING_REF="${STAGING_PROJECT_REF:-ysafyvvqzzxdcikurvpo}"
PROD_REF="${PRODUCTION_PROJECT_REF:-dyhvjlkewxuddnthqtjr}"

echo "→ Pushing auth config to production ($PROD_REF)..."
yes | supabase config push --project-ref "$PROD_REF"

cp supabase/config.toml supabase/config.toml.bak
sed -i '' 's|site_url = "https://ft-organizer.vercel.app"|site_url = "http://localhost:3000"|' supabase/config.toml
echo "→ Pushing auth config to staging ($STAGING_REF)..."
yes | supabase config push --project-ref "$STAGING_REF"
mv supabase/config.toml.bak supabase/config.toml

echo "Done. Email confirmation and Resend SMTP are active on both projects."
