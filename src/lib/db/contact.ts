import type { ContactFormValues } from '@/lib/validations'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logger } from '@/lib/logger'

export async function insertContactSubmission(data: ContactFormValues) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data: row, error } = await admin
    .from('contact_submissions')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    })
    .select('id')
    .single()

  if (error) {
    logger.error({ event: 'contact_insert_failed', error_code: error.code })
    throw error
  }

  return row
}
