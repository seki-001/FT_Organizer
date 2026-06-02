import type { StatusBadgeVariant } from '@/components/ui/StatusBadge'

export function adminOrderStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'delivered') return 'success'
  if (['dispatched', 'packed'].includes(s)) return 'primary'
  if (s === 'processing') return 'warning'
  if (s === 'cancelled') return 'danger'
  return 'neutral'
}

export function adminBookingStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'confirmed') return 'success'
  if (s === 'quoted') return 'info'
  if (s === 'new') return 'warning'
  return 'neutral'
}

export function adminPaymentStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'paid') return 'success'
  if (s === 'pending') return 'warning'
  if (s === 'failed') return 'danger'
  return 'neutral'
}

export function formatAdminStatus(status: string): string {
  return status.replace(/_/g, ' ')
}
