import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logger } from '@/lib/logger'

interface CreateCheckoutAccountInput {
  email: string
  password: string
  name: string
  phone: string
  address?: string
  city?: string
}

/** Creates a confirmed account during checkout (server-only). */
export async function createCheckoutAccount(input: CreateCheckoutAccountInput): Promise<string> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED')
  }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.name, phone: input.phone },
  })

  if (error || !data.user) {
    if (error?.message?.toLowerCase().includes('already')) {
      throw new Error('EMAIL_EXISTS')
    }
    logger.error({ event: 'checkout_account_create_failed', error_code: error?.code })
    throw new Error('ACCOUNT_CREATE_FAILED')
  }

  await admin
    .from('profiles')
    .update({
      full_name: input.name,
      phone: input.phone,
      address: input.address ?? null,
      city: input.city ?? null,
    })
    .eq('id', data.user.id)

  logger.info({ event: 'checkout_account_created', user_id: data.user.id })
  return data.user.id
}
