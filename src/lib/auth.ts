/**
 * Server-side authentication helper.
 *
 * In development:  returns a mock admin session so the dashboard is accessible.
 * In production:   replace getAdminSession() with real NextAuth — see TODO below.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  name:  string
  email: string
  role:  string
}

export interface AdminSession {
  user: AdminUser
}

// ─── Session helper ───────────────────────────────────────────────────────────

/**
 * Returns the current admin session for server-side auth checks.
 *
 * TODO: Replace the mock below with real NextAuth:
 *
 *   import { getServerSession }  from 'next-auth'
 *   import { authOptions }       from '@/app/api/auth/[...nextauth]/route'
 *
 *   export async function getAdminSession(): Promise<AdminSession | null> {
 *     return getServerSession(authOptions) as Promise<AdminSession | null>
 *   }
 *
 * Also add session + jwt callbacks to authOptions so the role is persisted:
 *
 *   callbacks: {
 *     async jwt({ token, user }) {
 *       if (user?.role) token.role = user.role
 *       return token
 *     },
 *     async session({ session, token }) {
 *       if (token.role) session.user.role = token.role
 *       return session
 *     },
 *   },
 *
 * And set role: 'admin' in your DB / CredentialsProvider authorize() function.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (process.env.NODE_ENV === 'production') {
    // Real NextAuth call goes here — see TODO comments in the file
    return null
  }
  return {
    user: {
      name:  'Faith Admin',
      email: 'admin@organizer.co.ke',
      role:  'admin',
    },
  }
}
