import { getMpesaConfig } from '@/lib/payments/config'
import { logger } from '@/lib/logger'

interface MpesaTokenResponse {
  access_token: string
  expires_in: string
}

interface StkPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

interface StkQueryResponse {
  ResponseCode: string
  ResultCode: string
  ResultDesc: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getMpesaAccessToken(): Promise<string> {
  const config = getMpesaConfig()
  const now = Date.now()

  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token
  }

  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64')
  const res = await fetch(
    `${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' },
  )

  if (!res.ok) {
    logger.error({ event: 'mpesa_oauth_failed', error_code: String(res.status) })
    throw new Error('M-Pesa authentication failed')
  }

  const data = (await res.json()) as MpesaTokenResponse
  cachedToken = {
    token: data.access_token,
    expiresAt: now + Number(data.expires_in) * 1000,
  }
  return data.access_token
}

export async function initiateStkPush(input: {
  phone: string
  amount: number
  accountReference: string
  transactionDesc: string
}): Promise<{ checkoutRequestId: string; merchantRequestId: string }> {
  const config = getMpesaConfig()
  const token = await getMpesaAccessToken()
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64')

  const payload = {
    BusinessShortCode: config.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: config.transactionType,
    Amount: Math.round(input.amount),
    PartyA: input.phone,
    PartyB: config.shortcode,
    PhoneNumber: input.phone,
    CallBackURL: config.callbackUrl,
    AccountReference: input.accountReference.slice(0, 12),
    TransactionDesc: input.transactionDesc.slice(0, 13),
  }

  const res = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  const data = (await res.json()) as StkPushResponse & { errorMessage?: string }

  if (!res.ok || data.ResponseCode !== '0') {
    logger.error({
      event: 'mpesa_stk_push_failed',
      error_code: data.ResponseCode ?? String(res.status),
    })
    throw new Error(data.errorMessage ?? data.ResponseDescription ?? 'STK push failed')
  }

  return {
    checkoutRequestId: data.CheckoutRequestID,
    merchantRequestId: data.MerchantRequestID,
  }
}

export async function queryStkPushStatus(
  checkoutRequestId: string,
): Promise<'pending' | 'success' | 'failed'> {
  const config = getMpesaConfig()
  const token = await getMpesaAccessToken()
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64')

  const res = await fetch(`${config.baseUrl}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
    cache: 'no-store',
  })

  const data = (await res.json()) as StkQueryResponse

  if (data.ResultCode === '0') return 'success'
  if (data.ResultCode === '1032' || data.ResultDesc?.toLowerCase().includes('cancel')) {
    return 'failed'
  }
  if (data.ResponseCode === '0' && data.ResultCode !== '0') return 'pending'
  return data.ResultCode ? 'failed' : 'pending'
}
