'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { humanizeAuthError } from '@/lib/auth-errors'

export interface SessionUser {
  name:   string
  email:  string
  image?: string
}

interface Session {
  user: SessionUser
}

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface SessionResult {
  data:   Session | null
  status: SessionStatus
}

interface AuthContextValue {
  session: Session | null
  status:  SessionStatus
  signIn:  (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>
  signUp:  (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string; needsEmailConfirmation?: boolean }>
  signOut: () => void
  update:  (user: Partial<SessionUser>) => void
}

const MOCK_USER: SessionUser = {
  name:  'Demo User',
  email: 'demo@example.com',
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const useSupabase = isSupabaseConfigured()
  const [session, setSession] = useState<Session | null>(useSupabase ? null : { user: MOCK_USER })
  const [status, setStatus] = useState<SessionStatus>(useSupabase ? 'loading' : 'authenticated')
  const router = useRouter()

  useEffect(() => {
    if (!useSupabase) return

    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s?.user) {
        setSession({
          user: {
            name: s.user.user_metadata?.full_name ?? s.user.email?.split('@')[0] ?? 'User',
            email: s.user.email ?? '',
            image: s.user.user_metadata?.avatar_url,
          },
        })
        setStatus('authenticated')
      } else {
        setSession(null)
        setStatus('unauthenticated')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.user) {
        setSession({
          user: {
            name: s.user.user_metadata?.full_name ?? s.user.email?.split('@')[0] ?? 'User',
            email: s.user.email ?? '',
            image: s.user.user_metadata?.avatar_url,
          },
        })
        setStatus('authenticated')
      } else {
        setSession(null)
        setStatus('unauthenticated')
      }
    })

    return () => subscription.unsubscribe()
  }, [useSupabase])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!useSupabase) {
      await new Promise((r) => setTimeout(r, 400))
      setSession({ user: { name: email.split('@')[0], email } })
      setStatus('authenticated')
      return { ok: true }
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: humanizeAuthError(error.message) }
    return { ok: true }
  }, [useSupabase])

  const signInWithGoogle = useCallback(async () => {
    if (!useSupabase) {
      return { ok: false, error: 'Google sign-in requires Supabase configuration.' }
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }, [useSupabase])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    if (!useSupabase) {
      setSession({ user: { name, email } })
      setStatus('authenticated')
      return { ok: true }
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    })
    if (error) return { ok: false, error: humanizeAuthError(error.message) }
    if (data.user && !data.session) {
      return { ok: true, needsEmailConfirmation: true }
    }
    return { ok: true }
  }, [useSupabase])

  const signOut = useCallback(() => {
    if (useSupabase) {
      const supabase = createClient()
      void supabase.auth.signOut()
    }
    setSession(null)
    setStatus('unauthenticated')
    router.push('/login')
  }, [router, useSupabase])

  const update = useCallback((user: Partial<SessionUser>) => {
    setSession((prev) => (prev ? { user: { ...prev.user, ...user } } : prev))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ session, status, signIn, signInWithGoogle, signUp, signOut, update }),
    [session, status, signIn, signInWithGoogle, signUp, signOut, update],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSession(): SessionResult {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useSession must be used inside <AuthProvider>')
  return { data: ctx.session, status: ctx.status }
}

export function useSignOut(): () => void {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useSignOut must be used inside <AuthProvider>')
  return ctx.signOut
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
