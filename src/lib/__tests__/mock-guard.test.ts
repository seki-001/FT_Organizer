import { afterEach, describe, expect, it, vi } from 'vitest'
import { allowMockData } from '@/lib/mock-guard'

afterEach(() => vi.unstubAllEnvs())

describe('allowMockData', () => {
  it('allows demo data in development', () => {
    vi.stubEnv('NODE_ENV', 'development')
    expect(allowMockData()).toBe(true)
  })

  it('blocks demo data in production by default', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(allowMockData()).toBe(false)
  })

  it('can be opted in explicitly for a demo deployment', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ALLOW_MOCK_DATA', 'true')
    expect(allowMockData()).toBe(true)
  })
})
