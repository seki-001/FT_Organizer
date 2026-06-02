'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface Row {
  area: string
  revenue: number
}

export default function RegionalBarChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="area"
          width={72}
          tick={{ fontSize: 11, fill: '#6B7280' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v) => [`KSh ${Number(v ?? 0).toLocaleString('en-KE')}`, 'Revenue']}
          contentStyle={{ borderRadius: 12, fontSize: 12 }}
        />
        <Bar dataKey="revenue" fill="#CC1212" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
