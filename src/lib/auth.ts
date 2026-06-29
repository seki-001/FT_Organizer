import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import type { Tables } from '@/types/database'

type ProfileAdmin = Pick<Tables<'profiles'>, 'role' | 'full_name'>
type ProfileUser = Pick<Tables<'profiles'>, 'full_name' | 'phone' | 'address' | 'city' | 'role'>

export interface AdminUser {
  name:  string
  email: string
  role:  string
}

export interface AdminSession {
  user: AdminUser
}

const DEV_MOCK_SESSION: AdminSession = {
  user: {
    name:  'Faith Admin',
    email: 'admin@organizer.co.ke',
    role:  'admin',
  },
}

/**
 * Returns the current admin session for server-side auth checks.
 * Uses Supabase Auth + profiles.role when configured; mock admin in local dev only.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === 'production') return null
    return DEV_MOCK_SESSION
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single() as { data: ProfileAdmin | null }

    if (!profile || profile.role !== 'admin') return null

    return {
      user: {
        name:  profile.full_name || user.email || 'Admin',
        email: user.email || '',
        role:  'admin',
      },
    }
  } catch {
    if (process.env.NODE_ENV === 'production') return null
    return DEV_MOCK_SESSION
  }
}

export async function getUserSession() {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, address, city, role')
    .eq('id', user.id)
    .single() as { data: ProfileUser | null }

  return { user, profile }
}
