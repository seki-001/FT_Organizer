import { NextResponse } from 'next/server'
import { adminRoute } from '@/lib/admin-api'
import { getOverview } from '@/lib/db/analytics'

export const dynamic = 'force-dynamic'

export const GET = () => adminRoute(async () => NextResponse.json(await getOverview()))
