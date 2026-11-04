import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logger } from '@/lib/logger'
import type { Json } from '@/types/database'

export async function insertPaymentEvent(input: {
  orderReference?: string | null
  provider: 'mpesa' | 'flutterwave' | 'paystack'
  eventType: string
  externalId?: string | null
  amount?: number | null
  status: string
  payload?: Json
  verified?: boolean
}) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payment_events')
    .insert({
      order_reference: input.orderReference ?? null,
      provider: input.provider,
      event_type: input.eventType,
      external_id: input.externalId ?? null,
      amount: input.amount ?? null,
      status: input.status,
      payload: input.payload ?? {},
      verified: input.verified ?? false,
    })
    .select('id')
    .single()

  if (error) {
    logger.error({ event: 'payment_event_insert_failed', error_code: error.code })
    throw error
  }

  return data
}

export async function getPaymentEventByExternalId(externalId: string) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payment_events')
    .select('id, status, verified, order_reference')
    .eq('external_id', externalId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    logger.error({ event: 'payment_event_lookup_failed', error_code: error.code })
    return null
  }

  return data
}

export async function updatePaymentEventStatus(
  externalId: string,
  status: string,
  verified: boolean,
) {
  if (!isSupabaseAdminConfigured()) return

  const admin = createAdminClient()
  const { error } = await admin
    .from('payment_events')
    .update({ status, verified })
    .eq('external_id', externalId)

  if (error) {
    logger.error({ event: 'payment_event_update_failed', error_code: error.code })
  }
}

/** The original initiation event for a provider reference (holds the order reference + expected amount). */
export async function getInitiationEvent(externalId: string) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payment_events')
    .select('id, order_reference, amount, status, verified')
    .eq('external_id', externalId)
    .in('event_type', ['payment_initiated', 'stk_initiated'])
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    logger.error({ event: 'payment_initiation_lookup_failed', error_code: error.code })
    return null
  }
  return data
}
