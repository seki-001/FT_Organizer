/**
 * Site-visit calendar availability (UI layer).
 * Replace RESERVED_SITE_VISIT_DATES with Google Calendar sync when integrated.
 */

export type DateAvailability = 'past' | 'weekend' | 'booked' | 'available'

/** Mock reserved dates — prevents double-booking in the UI until live calendar sync. */
export const RESERVED_SITE_VISIT_DATES: string[] = [
  '2026-04-08',
  '2026-04-12',
  '2026-04-22',
  '2026-05-05',
  '2026-05-19',
]

export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isMonday(date: Date): boolean {
  return date.getDay() === 1
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function getDateAvailability(date: Date, today: Date): DateAvailability {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)

  if (dayStart < todayStart) return 'past'
  if (isWeekend(dayStart)) return 'weekend'
  if (RESERVED_SITE_VISIT_DATES.includes(toIsoDate(dayStart))) return 'booked'
  return 'available'
}

export const CALENDAR_INTEGRATION_NOTE =
  'Dates shown reflect Faith\'s current availability. Your preferred date is confirmed within 24 hours. Live calendar sync is coming soon.'
