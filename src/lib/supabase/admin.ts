import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseAdminConfigured,
} from '@/lib/supabase/env'

let adminClient: ReturnType<typeof createClient<Database>> | null = null

/** Service-role client — server/API routes only. Never import in client components. */
export function createAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Supabase admin is not configured. Set SUPABASE_SERVICE_ROLE_KEY.')
  }

  if (!adminClient) {
    adminClient = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      { auth: { persistSession: false, autoRefreshToken: false } },
    )
  }

  return adminClient
}
