/**
 * Customer auth UI copy and helpers (no backend).
 * Wire forms to NextAuth / API when customer accounts launch.
 */

export const CUSTOMER_AUTH_NOTICE =
  'Customer accounts are launching soon. Forms below are UI-only — no sign-in or account is created yet.'

export const AUTH_SUBMIT_DELAY_MS = 900

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel
  score: number
  label: string
  barClass: string
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { level: 'empty', score: 0, label: '', barClass: 'bg-dark/10' }
  }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const normalized = Math.min(4, Math.max(1, Math.ceil(score * 0.8)))

  if (normalized <= 1) {
    return { level: 'weak', score: 1, label: 'Weak', barClass: 'bg-danger' }
  }
  if (normalized === 2) {
    return { level: 'fair', score: 2, label: 'Fair', barClass: 'bg-accent' }
  }
  if (normalized === 3) {
    return { level: 'good', score: 3, label: 'Good', barClass: 'bg-primary/80' }
  }
  return { level: 'strong', score: 4, label: 'Strong', barClass: 'bg-success' }
}

export async function simulateAuthRequest(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, AUTH_SUBMIT_DELAY_MS))
}
