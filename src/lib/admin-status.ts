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
  if (s === 'completed') return 'success'
  if (s === 'confirmed') return 'primary'
  if (s === 'retained') return 'success'
  if (s === 'quoted') return 'info'
  if (s === 'new') return 'warning'
  if (s === 'cancelled') return 'danger'
  return 'neutral'
}

export function adminQuotationStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'accepted') return 'success'
  if (s === 'sent') return 'primary'
  if (s === 'draft') return 'neutral'
  if (['rejected', 'expired'].includes(s)) return 'danger'
  return 'neutral'
}

export function adminInvoiceStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'paid') return 'success'
  if (s === 'partial') return 'info'
  if (s === 'overdue') return 'danger'
  if (s === 'unpaid') return 'warning'
  return 'neutral'
}

export function adminFollowUpStatusVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'completed') return 'success'
  if (s === 'sent') return 'primary'
  if (s === 'scheduled') return 'info'
  if (s === 'skipped') return 'neutral'
  return 'neutral'
}

export function adminPurchasePaymentVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase()
  if (s === 'paid') return 'success'
  if (s === 'partial') return 'warning'
  return 'danger'
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
