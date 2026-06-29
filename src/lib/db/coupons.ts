import { MOCK_COUPONS } from '@/lib/mock-admin-coupons'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logger } from '@/lib/logger'
import type { TablesInsert } from '@/types/database'

export interface CouponRecord {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  usageLimit: number | null
  uses: number
  active: boolean
  expiresAt: string | null
}

function rowToCoupon(row: {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order: number
  usage_limit: number | null
  uses: number
  active: boolean
  expires_at: string | null
}): CouponRecord {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minOrder: row.min_order,
    usageLimit: row.usage_limit,
    uses: row.uses,
    active: row.active,
    expiresAt: row.expires_at,
  }
}

export async function listCoupons(): Promise<CouponRecord[]> {
  if (!isSupabaseAdminConfigured()) {
    return MOCK_COUPONS.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      usageLimit: c.usageLimit,
      uses: c.uses,
      active: c.active,
      expiresAt: c.expiresAt ?? null,
    }))
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('coupons').select('*').order('created_at', { ascending: false })
  if (error) {
    logger.error({ event: 'coupons_list_failed', error_code: error.code })
    return []
  }
  return (data ?? []).map(rowToCoupon)
}

export async function findCouponByCode(code: string): Promise<CouponRecord | null> {
  const normalized = code.toUpperCase().trim()

  if (!isSupabaseAdminConfigured()) {
    const mock = MOCK_COUPONS.find((c) => c.code === normalized)
    if (!mock) return null
    return {
      id: mock.id,
      code: mock.code,
      type: mock.type,
      value: mock.value,
      minOrder: mock.minOrder,
      usageLimit: mock.usageLimit,
      uses: mock.uses,
      active: mock.active,
      expiresAt: mock.expiresAt ?? null,
    }
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('coupons').select('*').eq('code', normalized).maybeSingle()
  if (error || !data) return null
  return rowToCoupon(data)
}

export async function upsertCoupon(coupon: Omit<CouponRecord, 'id'> & { id?: string }) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const payload = {
    code: coupon.code.toUpperCase(),
    type: coupon.type,
    value: coupon.value,
    min_order: coupon.minOrder,
    usage_limit: coupon.usageLimit,
    uses: coupon.uses,
    active: coupon.active,
    expires_at: coupon.expiresAt,
  }

  const { data, error } = coupon.id
    ? await admin.from('coupons').update(payload).eq('id', coupon.id).select().single()
    : await admin.from('coupons').insert(payload).select().single()

  if (error) {
    logger.error({ event: 'coupon_upsert_failed', error_code: error.code })
    throw error
  }
  return rowToCoupon(data)
}

export async function updateCouponById(id: string, updates: Partial<CouponRecord>) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const patch: Partial<TablesInsert<'coupons'>> = {}
  if (updates.code !== undefined) patch.code = updates.code.toUpperCase()
  if (updates.type !== undefined) patch.type = updates.type
  if (updates.value !== undefined) patch.value = updates.value
  if (updates.minOrder !== undefined) patch.min_order = updates.minOrder
  if (updates.usageLimit !== undefined) patch.usage_limit = updates.usageLimit
  if (updates.uses !== undefined) patch.uses = updates.uses
  if (updates.active !== undefined) patch.active = updates.active
  if (updates.expiresAt !== undefined) patch.expires_at = updates.expiresAt

  const { data, error } = await admin.from('coupons').update(patch).eq('id', id).select().single()
  if (error) {
    logger.error({ event: 'coupon_update_failed', error_code: error.code })
    return null
  }
  return rowToCoupon(data)
}

export async function deleteCoupon(id: string) {
  if (!isSupabaseAdminConfigured()) return false
  const admin = createAdminClient()
  const { error } = await admin.from('coupons').delete().eq('id', id)
  return !error
}
