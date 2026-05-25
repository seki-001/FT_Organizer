/**
 * NextAuth route handler stub.
 *
 * HOW TO ACTIVATE REAL AUTH:
 * 1. npm install next-auth
 * 2. Set environment variables in .env.local:
 *      NEXTAUTH_URL=http://localhost:3000
 *      NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
 *      GOOGLE_CLIENT_ID=<from Google Cloud Console>
 *      GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
 * 3. Uncomment the code below and delete this comment block.
 *
 * import NextAuth from 'next-auth'
 * import GoogleProvider from 'next-auth/providers/google'
 * import CredentialsProvider from 'next-auth/providers/credentials'
 *
 * const handler = NextAuth({
 *   providers: [
 *     GoogleProvider({
 *       clientId:     process.env.GOOGLE_CLIENT_ID!,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
 *     }),
 *     CredentialsProvider({
 *       name: 'Credentials',
 *       credentials: {
 *         email:    { label: 'Email',    type: 'email' },
 *         password: { label: 'Password', type: 'password' },
 *       },
 *       async authorize(credentials) {
 *         // TODO: Look up user in DB, verify password hash
 *         // const user = await db.user.findUnique({ where: { email: credentials.email } })
 *         // if (!user || !verifyPassword(credentials.password, user.passwordHash)) return null
 *         // return { id: user.id, name: user.name, email: user.email }
 *         return null
 *       },
 *     }),
 *   ],
 *   pages: {
 *     signIn:  '/login',
 *     signOut: '/login',
 *     error:   '/login',
 *   },
 *   callbacks: {
 *     async session({ session, token }) {
 *       return session
 *     },
 *   },
 * })
 *
 * export { handler as GET, handler as POST }
 */

import { NextResponse } from 'next/server'

// Placeholder until real NextAuth is wired up.
export function GET()  { return NextResponse.json({ message: 'NextAuth not yet configured.' }, { status: 501 }) }
export function POST() { return NextResponse.json({ message: 'NextAuth not yet configured.' }, { status: 501 }) }
