import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logger } from '@/lib/logger'

export async function subscribeNewsletter(email: string) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('newsletter_subscribers')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: false })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return { id: 'existing' }
    }
    logger.error({ event: 'newsletter_subscribe_failed', error_code: error.code })
    throw error
  }

  return data
}
