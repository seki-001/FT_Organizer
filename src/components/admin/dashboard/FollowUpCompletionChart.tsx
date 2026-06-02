'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Row {
  week: string
  completed: number
  total: number
}

export default function FollowUpCompletionChart({ data }: { data: Row[] }) {
  const withRate = data.map((d) => ({
    ...d,
    rate: d.total ? Math.round((d.completed / d.total) * 100) : 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={withRate} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F4" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis
          unit="%"
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip formatter={(v) => [`${Number(v ?? 0)}%`, 'Completion']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
        <Bar dataKey="rate" name="Completion %" fill="#2D7A47" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
