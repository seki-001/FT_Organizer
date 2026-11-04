/**
 * Single source of truth for public claims shown across the site
 * (homepage, about, services, blog). Update here, never inline.
 *
 * NOTE: the figures below were already live on the site. They are centralised,
 * not verified. Confirm them with the client before relying on them in sales
 * material ("strong but not fake" — no unsupported claims).
 */

export const FOUNDED_YEAR = 2018

/** Whole years in business, computed so the claim never goes stale. */
export function yearsInBusiness(now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - FOUNDED_YEAR)
}

export const SITE_FACTS = {
  /** Homes / spaces organised to date */
  homesOrganized: { value: 500, suffix: '+' },
  /** Average rating from verified client reviews (out of 5) */
  clientRating: { value: 4.9, suffix: '★' },
  /** Clients served to date */
  clientsServed: { value: 2500, suffix: '+', short: '2.5k+' },
} as const

/** "500+" */
export function homesOrganizedLabel(): string {
  return `${SITE_FACTS.homesOrganized.value}${SITE_FACTS.homesOrganized.suffix}`
}

/** "4.9★" */
export function clientRatingLabel(): string {
  return `${SITE_FACTS.clientRating.value}${SITE_FACTS.clientRating.suffix}`
}

/** "2.5k+" */
export function clientsServedLabel(): string {
  return SITE_FACTS.clientsServed.short
}

/** "8 yrs" */
export function yearsInBusinessLabel(now: Date = new Date()): string {
  return `${yearsInBusiness(now)} yrs`
}
