import { describe, expect, it } from 'vitest'
import { SERVICES } from '../constants'
import {
  FOUNDED_YEAR,
  clientRatingLabel,
  clientsServedLabel,
  homesOrganizedLabel,
  yearsInBusiness,
  yearsInBusinessLabel,
} from '../site-facts'

describe('site facts', () => {
  it('computes years in business from the founding year (no stale "7 yrs")', () => {
    expect(yearsInBusiness(new Date('2026-11-04'))).toBe(2026 - FOUNDED_YEAR)
    expect(yearsInBusinessLabel(new Date('2026-11-04'))).toBe('8 yrs')
    expect(yearsInBusiness(new Date('2017-01-01'))).toBe(0)
  })

  it('exposes one consistent label per claim', () => {
    expect(homesOrganizedLabel()).toBe('500+')
    expect(clientRatingLabel()).toBe('4.9★')
    expect(clientsServedLabel()).toBe('2.5k+')
  })

  it('footer/service lists exclude the site-visit pseudo-service', () => {
    const listed = SERVICES.filter((s) => !s.siteVisit)
    expect(listed.every((s) => s.slug !== 'site-visit')).toBe(true)
    expect(listed.length).toBe(9)
  })
})
