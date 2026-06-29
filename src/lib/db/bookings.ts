import type { BookingFormValues } from '@/lib/validations'
import type { Booking } from '@/lib/types'
import type { AdminBooking } from '@/lib/mock-admin-bookings'
import { MOCK_ADMIN_BOOKINGS } from '@/lib/mock-admin-bookings'
import { MOCK_BOOKINGS } from '@/lib/mock-account'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env'
import { rowToAdminBooking, rowToBooking } from '@/lib/db/mappers'
import { logger } from '@/lib/logger'

export async function insertBooking(
  data: BookingFormValues,
  reference: string,
  userId?: string | null,
) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data: row, error } = await admin
    .from('bookings')
    .insert({
      reference,
      user_id: userId ?? null,
      service_slug: data.service,
      preferred_date: data.date,
      name: data.name,
      email: data.email,
      phone: data.phone,
      property_type: data.propertyType,
      property_size: data.propertySize,
      notes: data.notes ?? null,
      status: 'new',
    })
    .select()
    .single()

  if (error) {
    logger.error({ event: 'booking_insert_failed', error_code: error.code })
    throw error
  }

  return row
}

export async function listBookings(filters: {
  search?: string
  status?: string
  service?: string
  dateRange?: string
}): Promise<AdminBooking[]> {
  if (!isSupabaseAdminConfigured()) {
    return filterMockBookings(filters)
  }

  const admin = createAdminClient()
  let query = admin.from('bookings').select('*').order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status as AdminBooking['status'])
  }
  if (filters.service && filters.service !== 'all') {
    query = query.eq('service_slug', filters.service)
  }

  const { data, error } = await query
  if (error) {
    logger.error({ event: 'bookings_list_failed', error_code: error.code })
    return filterMockBookings(filters)
  }

  let bookings = (data ?? []).map(rowToAdminBooking)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    bookings = bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q),
    )
  }

  if (filters.dateRange && filters.dateRange !== 'all') {
    bookings = filterByDateRange(bookings, filters.dateRange)
  }

  return bookings
}

export async function updateBookingStatus(reference: string, status: AdminBooking['status']) {
  if (!isSupabaseAdminConfigured()) return false

  const admin = createAdminClient()
  const { error } = await admin.from('bookings').update({ status }).eq('reference', reference)
  if (error) {
    logger.error({ event: 'booking_status_update_failed', error_code: error.code, resource_id: reference })
    return false
  }
  return true
}

export async function updateBookingNotes(reference: string, internalNotes: string) {
  if (!isSupabaseAdminConfigured()) return false

  const admin = createAdminClient()
  const { error } = await admin
    .from('bookings')
    .update({ internal_notes: internalNotes })
    .eq('reference', reference)

  return !error
}

export async function listBookingsForUser(userId: string): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_BOOKINGS
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data?.length) {
    if (error) logger.error({ event: 'user_bookings_list_failed', error_code: error.code, user_id: userId })
    return isSupabaseAdminConfigured() ? [] : MOCK_BOOKINGS
  }

  return data.map(rowToBooking)
}

function filterMockBookings(filters: {
  search?: string
  status?: string
  service?: string
  dateRange?: string
}): AdminBooking[] {
  let bookings = [...MOCK_ADMIN_BOOKINGS]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    bookings = bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q),
    )
  }
  if (filters.status && filters.status !== 'all') {
    bookings = bookings.filter((b) => b.status === filters.status)
  }
  if (filters.service && filters.service !== 'all') {
    bookings = bookings.filter((b) => b.service === filters.service)
  }
  if (filters.dateRange && filters.dateRange !== 'all') {
    bookings = filterByDateRange(bookings, filters.dateRange)
  }
  return bookings
}

function filterByDateRange<T extends { createdAt: string }>(items: T[], dateRange: string): T[] {
  const now = new Date()
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const todayStart = startOf(now)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  return items.filter((item) => {
    const created = new Date(item.createdAt)
    if (dateRange === 'today') return created >= todayStart
    if (dateRange === 'week') return created >= weekStart
    if (dateRange === 'month') return created >= monthStart
    return true
  })
}
