/** Map Supabase Auth errors to plain-language messages for customers. */
export function humanizeAuthError(message: string | undefined | null): string {
  if (!message || typeof message !== 'string') {
    return 'Something went wrong. Please try again.'
  }

  const lower = message.toLowerCase()

  if (lower.includes('email not confirmed') || lower.includes('email_not_confirmed')) {
    return 'Please confirm your email first. Check your inbox for the confirmation link.'
  }
  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Invalid email or password.'
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (lower.includes('password should be at least')) {
    return 'Password must be at least 8 characters.'
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a few minutes and try again.'
  }
  if (lower.includes('signup is disabled')) {
    return 'New sign-ups are temporarily unavailable. Please contact us.'
  }

  return message
}

/** Safely extract a user-facing error string from auth API results. */
export function toAuthErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (typeof error === 'string' && error.trim()) {
    return humanizeAuthError(error)
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message?: unknown }).message
    if (typeof msg === 'string' && msg.trim()) {
      return humanizeAuthError(msg)
    }
  }
  return fallback
}
