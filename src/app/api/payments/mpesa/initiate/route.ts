import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { insertPaymentEvent } from '@/lib/db/payments'
import { initiateStkPush } from '@/lib/payments/mpesa'
import { isMpesaConfigured } from '@/lib/payments/config'

const InitiateSchema = z.object({
  phone:    z.string().min(9, 'Phone number too short'),
  amount:   z.number().positive('Amount must be positive'),
  orderRef: z.string().min(1, 'Order reference required'),
})

function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('2547') && digits.length === 12) return digits
  if (digits.startsWith('07')   && digits.length === 10) return '254' + digits.slice(1)
  if (digits.startsWith('7')    && digits.length === 9)  return '254' + digits
  return null
}

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'mpesa-initiate', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body   = await request.json() as unknown
    const parsed = InitiateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { phone, amount, orderRef } = parsed.data
    const normalisedPhone = normalisePhone(phone)

    if (!normalisedPhone) {
      return NextResponse.json(
        { success: false, error: 'Invalid Kenyan phone number. Use format 07XX XXX XXX.' },
        { status: 400 },
      )
    }

    let checkoutRequestId: string
    let merchantRequestId: string | undefined

    if (isMpesaConfigured()) {
      const result = await initiateStkPush({
        phone: normalisedPhone,
        amount,
        accountReference: orderRef,
        transactionDesc: `FTO ${orderRef}`,
      })
      checkoutRequestId = result.checkoutRequestId
      merchantRequestId = result.merchantRequestId
    } else {
      checkoutRequestId = `mock_${Date.now()}`
    }

    await insertPaymentEvent({
      orderReference: orderRef,
      provider: 'mpesa',
      eventType: 'stk_initiated',
      externalId: checkoutRequestId,
      amount: Math.round(amount),
      status: 'pending',
      payload: { phone: normalisedPhone, merchantRequestId },
    })

    logger.info({
      event: 'mpesa_initiated',
      resource_id: orderRef,
      ip_address: getClientIp(request),
    })

    const ip = getClientIp(request)
    const rate = checkRateLimit(`mpesa-initiate:${ip}`, { limit: 5, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({
        success: true,
        checkoutRequestId,
        message: isMpesaConfigured()
          ? 'STK push sent to your phone'
          : 'STK push sent (mock — set MPESA_CONSUMER_KEY/SECRET)',
      }),
      rate.remaining,
      rate.resetAt,
    )
  } catch (err) {
    logger.error({ event: 'mpesa_initiate_failed', error_code: 'INTERNAL_ERROR' })
    const message = err instanceof Error ? err.message : 'Failed to initiate M-Pesa payment.'
    return apiError(message, 'INTERNAL_ERROR', 500)
  }
}
