'use client'

/**
 * Mock auth context that mirrors NextAuth's useSession / signOut interface.
 *
 * HOW TO SWAP IN REAL NEXT-AUTH:
 * 1. `npm install next-auth`
 * 2. Create `src/app/api/auth/[...nextauth]/route.ts` (stub already exists)
 * 3. Wrap your root layout with <SessionProvider> from "next-auth/react"
 * 4. In any component that imports from here, switch to:
 *      import { useSession, signOut } from 'next-auth/react'
 *    The hook return shape is identical, so the swap is 1-line per file.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  signOut: () => void
  update:  (user: Partial<SessionUser>) => void
}

// ─── Mock session (dev default — logged in) ───────────────────────────────────

const MOCK_USER: SessionUser = {
  name:  'Demo User',
  email: 'demo@example.com',
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to 'authenticated' so account pages are visible in development.
  // In production with real NextAuth this provider is replaced by <SessionProvider>.
  const [session, setSession] = useState<Session | null>({ user: MOCK_USER })
  const [status,  setStatus]  = useState<SessionStatus>('authenticated')
  const router = useRouter()

  const signIn = useCallback(async (email: string, _password: string) => {
    setStatus('loading')
    // TODO: Replace with real NextAuth signIn('credentials', { email, password })
    await new Promise((r) => setTimeout(r, 800))
    const mockSession: Session = { user: { name: email.split('@')[0], email } }
    setSession(mockSession)
    setStatus('authenticated')
    return { ok: true }
  }, [])

  const signOut = useCallback(() => {
    setSession(null)
    setStatus('unauthenticated')
    router.push('/login')
    // TODO: Replace with NextAuth signOut({ callbackUrl: '/login' })
  }, [router])

  const update = useCallback((user: Partial<SessionUser>) => {
    setSession((prev) => prev ? { user: { ...prev.user, ...user } } : prev)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ session, status, signIn, signOut, update }),
    [session, status, signIn, signOut, update]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Drop-in replacement for NextAuth's useSession() */
export function useSession(): SessionResult {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useSession must be used inside <AuthProvider>')
  return { data: ctx.session, status: ctx.status }
}

/** Drop-in replacement for NextAuth's signOut() */
export function useSignOut(): () => void {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useSignOut must be used inside <AuthProvider>')
  return ctx.signOut
}

/** Access full auth context (signIn, update, etc.) */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
