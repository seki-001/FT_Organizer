import { describe, expect, it, vi } from 'vitest'

// Ad-hoc payment references never touch the database, so stub the order lookup.
vi.mock('@/lib/db/orders', () => ({ getOrderByReference: vi.fn() }))

import { getOrderByReference } from '@/lib/db/orders'
import { resolvePayable, PayableError } from '@/lib/payments/payable'

const order = (over: Record<string, unknown> = {}) => ({
  total: 4500, paymentStatus: 'pending', orderStatus: 'processing', customer: { email: 'a@b.co' }, ...over,
})

describe('resolvePayable', () => {
  it('charges the stored order total, ignoring the client amount', async () => {
    vi.mocked(getOrderByReference).mockResolvedValue(order() as never)
    const p = await resolvePayable('ORD-ABC', 1)
    expect(p).toMatchObject({ amount: 4500, isOrder: true })
  })

  it('rejects unknown, paid and cancelled orders', async () => {
    vi.mocked(getOrderByReference).mockResolvedValue(null)
    await expect(resolvePayable('ORD-X', 100)).rejects.toMatchObject({ code: 'ORDER_NOT_FOUND' })
    vi.mocked(getOrderByReference).mockResolvedValue(order({ paymentStatus: 'paid' }) as never)
    await expect(resolvePayable('ORD-X', 100)).rejects.toMatchObject({ code: 'ALREADY_PAID' })
    vi.mocked(getOrderByReference).mockResolvedValue(order({ orderStatus: 'cancelled' }) as never)
    await expect(resolvePayable('ORD-X', 100)).rejects.toBeInstanceOf(PayableError)
  })

  it('bounds ad-hoc payment amounts', async () => {
    await expect(resolvePayable('PAY-1', 0)).rejects.toMatchObject({ code: 'INVALID_AMOUNT' })
    await expect(resolvePayable('PAY-1', 9_999_999)).rejects.toMatchObject({ code: 'INVALID_AMOUNT' })
    await expect(resolvePayable('PAY-1', 2500)).resolves.toMatchObject({ amount: 2500, isOrder: false })
  })
})
