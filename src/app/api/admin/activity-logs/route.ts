import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listActivityLogs, type ActivitySource } from '@/lib/activity-log'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10) || 50, 200)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10) || 0
  const source = (searchParams.get('source') ?? 'all') as ActivitySource | 'all'

  const logs = await listActivityLogs({ limit, offset, source })

  return NextResponse.json({ logs, total: logs.length })
}
