'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Row {
  month: string
  expenses: number
  purchases: number
}

export default function ExpensesPurchasesChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F4" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          formatter={(v) => `KSh ${Number(v ?? 0).toLocaleString('en-KE')}`}
          contentStyle={{ borderRadius: 12, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#991010" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="purchases" name="Purchases" stroke="#CC1212" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
