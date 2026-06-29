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

export interface ContactInquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
}

export async function listContactSubmissions(): Promise<ContactInquiry[]> {
  if (!isSupabaseAdminConfigured()) return []

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('contact_submissions')
    .select('id, name, email, phone, subject, message, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    logger.error({ event: 'contact_list_failed', error_code: error.code })
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
  }))
}
