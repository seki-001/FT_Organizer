import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listContactSubmissions } from '@/lib/db/contact'

export async function GET() {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const inquiries = await listContactSubmissions()
  return NextResponse.json({ inquiries, total: inquiries.length })
}
