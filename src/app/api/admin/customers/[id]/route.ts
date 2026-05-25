import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { MOCK_CUSTOMERS } from '@/lib/mock-admin-customers'

type Params = { params: { id: string } }

export async function GET(_req: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const customer = MOCK_CUSTOMERS.find(c => c.id === params.id)
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ customer })
}
