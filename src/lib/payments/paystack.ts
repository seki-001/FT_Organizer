import { getPaystackConfig } from '@/lib/payments/config'
import { logger } from '@/lib/logger'

const PAYSTACK_BASE = 'https://api.paystack.co'

interface InitializeResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface VerifyResponse {
  status: boolean
  message: string
  data?: {
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string | null
  }
}

export async function initializePaystackTransaction(input: {
  email: string
  amount: number
  reference: string
  metadata?: Record<string, string>
}): Promise<{ authorizationUrl: string; reference: string }> {
  const { secretKey, callbackUrl } = getPaystackConfig()

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amount) * 100,
      currency: 'KES',
      reference: input.reference,
      callback_url: callbackUrl,
      channels: ['card', 'mobile_money', 'bank'],
      metadata: input.metadata ?? {},
    }),
    cache: 'no-store',
  })

  const data = (await res.json()) as InitializeResponse

  if (!res.ok || !data.status || !data.data?.authorization_url) {
    logger.error({ event: 'paystack_init_failed', error_code: data.message })
    throw new Error(data.message || 'Paystack initialization failed')
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  }
}

export async function verifyPaystackTransaction(
  reference: string,
): Promise<{ paid: boolean; amount: number; currency: string }> {
  const { secretKey } = getPaystackConfig()

  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
    cache: 'no-store',
  })

  const data = (await res.json()) as VerifyResponse

  if (!res.ok || !data.status || !data.data) {
    logger.error({ event: 'paystack_verify_failed', error_code: data.message, resource_id: reference })
    throw new Error(data.message || 'Payment verification failed')
  }

  return {
    paid: data.data.status === 'success',
    amount: data.data.amount / 100,
    currency: data.data.currency,
  }
}
