import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logger } from '@/lib/logger'

export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string; address?: string; city?: string },
) {
  if (!isSupabaseAdminConfigured()) return false

  const admin = createAdminClient()
  const { error } = await admin
    .from('profiles')
    .update({
      full_name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
    })
    .eq('id', userId)

  if (error) {
    logger.error({ event: 'profile_update_failed', error_code: error.code, user_id: userId })
    return false
  }
  return true
}

export async function getProfile(userId: string) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data, error } = await admin.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) return null
  return data
}
