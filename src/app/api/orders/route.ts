import { NextRequest } from 'next/server'
import { CreateOrderSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { createOrder } from '@/lib/db/orders'
import { subscribeNewsletter } from '@/lib/db/newsletter'
import { createCheckoutAccount } from '@/lib/checkout-account'
import { getUserSession } from '@/lib/auth'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logActivity } from '@/lib/activity-log'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'orders-create', { limit: 10, windowMs: 60_000 })
  if (limited) return limited

  if (!isSupabaseAdminConfigured()) {
    return apiError(
      'Orders are not available on this environment yet. Contact support.',
      'DATABASE_NOT_CONFIGURED',
      503,
    )
  }

  try {
    const body = await request.json() as unknown
    const parsed = CreateOrderSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Invalid order data.', 'VALIDATION_ERROR', 400)
    }

    const session = await getUserSession()
    const items = parsed.data.items.map((item) => ({
      ...item,
      productId: item.productId && UUID_RE.test(item.productId) ? item.productId : undefined,
    }))

    let userId = session?.user.id ?? null

    if (!userId && parsed.data.checkoutMode === 'account') {
      if (!parsed.data.accountPassword) {
        return apiError('Choose a password to create your account, or continue as guest.', 'VALIDATION_ERROR', 400)
      }
      try {
        userId = await createCheckoutAccount({
          email: parsed.data.customer.email,
          password: parsed.data.accountPassword,
          name: parsed.data.customer.name,
          phone: parsed.data.customer.phone,
          address: parsed.data.customer.address,
          city: parsed.data.customer.city,
        })
      } catch (err) {
        const code = err instanceof Error ? err.message : 'ACCOUNT_CREATE_FAILED'
        if (code === 'EMAIL_EXISTS') {
          return apiError(
            'An account with this email already exists. Sign in or checkout as guest.',
            'EMAIL_EXISTS',
            409,
          )
        }
        return apiError('Could not create your account. Try guest checkout or sign in.', code, 500)
      }
    }

    if (parsed.data.customer.marketingOptIn) {
      try {
        await subscribeNewsletter(parsed.data.customer.email)
      } catch {
        logger.warn({ event: 'checkout_newsletter_subscribe_skipped', resource_id: parsed.data.customer.email })
      }
    }

    const { reference, id } = await createOrder({ ...parsed.data, items }, userId)

    await logActivity({
      action: 'order.placed',
      description: `Order ${reference} placed by ${parsed.data.customer.name}`,
      userId,
      actorEmail: parsed.data.customer.email,
      actorName: parsed.data.customer.name,
      resourceType: 'order',
      resourceId: reference,
      metadata: { total: parsed.data.total, itemCount: items.length },
      ipAddress: getClientIp(request),
      userAgent: request.headers.get('user-agent'),
      source: 'storefront',
    })

    logger.info({
      event: 'order_api_created',
      resource_id: reference,
      user_id: session?.user.id,
      ip_address: getClientIp(request),
    })

    const ip = getClientIp(request)
    const rate = checkRateLimit(`orders-create:${ip}`, { limit: 10, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({ success: true, reference, id }, 201),
      rate.remaining,
      rate.resetAt,
    )
  } catch (err) {
    const code = err instanceof Error ? err.message : 'INTERNAL_ERROR'
    if (code === 'SUBTOTAL_MISMATCH' || code === 'TOTAL_MISMATCH') {
      return apiError('Order totals do not match. Please refresh and try again.', code, 400)
    }
    logger.error({ event: 'order_api_failed', error_code: code })
    return apiError('Could not place your order. Please try again.', 'INTERNAL_ERROR', 500)
  }
}
