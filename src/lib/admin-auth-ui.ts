/**
 * Admin / staff auth UI copy and helpers (no backend).
 * Wire to NextAuth credentials + invite tokens when admin auth launches.
 */

export const ADMIN_AUTH_NOTICE =
  'Admin sign-in is preview-only. No session is created and the dashboard still uses the development mock until real auth is wired.'

export const STAFF_INVITE_NOTICE =
  'Staff accounts are invitation-only. Use the link from your invite email. There is no public admin registration.'

export const ADMIN_LOGIN_PATH = '/admin/login'
export const ADMIN_FORGOT_PASSWORD_PATH = '/admin/forgot-password'
export const ADMIN_RESET_PASSWORD_PATH = '/admin/reset-password'
export const ADMIN_INVITE_PATH = '/admin/invite'
