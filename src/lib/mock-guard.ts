/**
 * Mock/demo data is for local development only.
 * In production, data layers must return real (possibly empty) results instead of
 * fabricating orders, customers or metrics. Set ALLOW_MOCK_DATA=true to opt in (e.g. a demo deploy).
 */
export function allowMockData(): boolean {
  if (process.env.ALLOW_MOCK_DATA === 'true') return true
  return process.env.NODE_ENV !== 'production'
}
