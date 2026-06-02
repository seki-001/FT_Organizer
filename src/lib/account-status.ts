import type { StatusBadgeVariant } from '@/components/ui/StatusBadge'

export function orderStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (['delivered', 'completed', 'paid'].includes(s)) return 'success'
  if (['dispatched', 'confirmed', 'packed'].includes(s)) return 'primary'
  if (['processing', 'pending', 'new', 'quoted'].includes(s)) return 'warning'
  if (['cancelled', 'failed'].includes(s)) return 'danger'
  return 'neutral'
}

export function bookingStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'completed') return 'success'
  if (s === 'confirmed') return 'primary'
  if (['new', 'quoted'].includes(s)) return 'warning'
  if (s === 'cancelled') return 'danger'
  return 'neutral'
}

export function quotationStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'accepted') return 'success'
  if (s === 'sent') return 'primary'
  if (s === 'expired') return 'danger'
  return 'neutral'
}

export function invoiceStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'paid') return 'success'
  if (s === 'due') return 'warning'
  if (s === 'pending_verification') return 'info'
  return 'neutral'
}

export function followUpStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'completed') return 'success'
  if (s === 'upcoming') return 'primary'
  if (s === 'scheduled') return 'info'
  return 'neutral'
}

export function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ')
}
