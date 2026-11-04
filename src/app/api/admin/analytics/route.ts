import { NextResponse } from 'next/server'
import { adminRoute } from '@/lib/admin-api'
import { getAnalytics } from '@/lib/db/analytics'
import type { DateRange } from '@/lib/analytics-types'

export const dynamic = 'force-dynamic'

const RANGES: DateRange[] = ['7d', '30d', '3m', '1y']

export const GET = (request: Request) => adminRoute(async () => {
  const raw = new URL(request.url).searchParams.get('range') as DateRange | null
  const range: DateRange = raw && RANGES.includes(raw) ? raw : '30d'
  return NextResponse.json({ range, data: await getAnalytics(range) })
})
