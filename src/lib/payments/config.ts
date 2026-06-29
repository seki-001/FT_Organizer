const SANDBOX_MPESA_BASE = 'https://sandbox.safaricom.co.ke'
const PROD_MPESA_BASE = 'https://api.safaricom.co.ke'

/** Standard Daraja sandbox passkey — override with MPESA_PASSKEY in production. */
const SANDBOX_MPESA_PASSKEY =
  'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6d6a9f5420aaf'

export type MpesaMode = 'paybill' | 'till'

export function getSiteUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL

  if (explicit) return explicit.replace(/\/$/, '')

  // Vercel preview / production — used when NEXT_PUBLIC_SITE_URL not set per-deploy
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return 'http://localhost:3000'
}

export function isMpesaConfigured(): boolean {
  return Boolean(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET)
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY)
}

export function getMpesaConfig() {
  const isSandbox = process.env.MPESA_ENV !== 'production'
  const baseUrl = isSandbox ? SANDBOX_MPESA_BASE : PROD_MPESA_BASE
  const mode = (process.env.MPESA_MODE ?? 'paybill') as MpesaMode
  const shortcode = process.env.MPESA_SHORTCODE ?? (isSandbox ? '174379' : '')
  const passkey = process.env.MPESA_PASSKEY ?? (isSandbox ? SANDBOX_MPESA_PASSKEY : '')
  const callbackUrl =
    process.env.MPESA_CALLBACK_URL ?? `${getSiteUrl()}/api/payments/mpesa/callback`

  return {
    isSandbox,
    baseUrl,
    consumerKey: process.env.MPESA_CONSUMER_KEY ?? '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET ?? '',
    shortcode,
    passkey,
    mode,
    callbackUrl,
    transactionType: mode === 'till' ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline',
    /** Shown on /pay for manual Lipa na M-Pesa */
    displayPaybill: process.env.NEXT_PUBLIC_MPESA_PAYBILL ?? shortcode,
    displayTill: process.env.NEXT_PUBLIC_MPESA_TILL ?? '',
    accountName: process.env.NEXT_PUBLIC_MPESA_ACCOUNT_NAME ?? 'Faith The Organizer',
  }
}

export function getPaystackConfig() {
  return {
    secretKey: process.env.PAYSTACK_SECRET_KEY ?? '',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? '',
    callbackUrl: `${getSiteUrl()}/pay/callback`,
  }
}
