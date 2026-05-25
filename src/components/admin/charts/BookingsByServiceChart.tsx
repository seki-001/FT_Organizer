'use client'

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, LabelList,
} from 'recharts'
import type { ServiceBookings } from '@/lib/mock-analytics'

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str
}

interface TTProps { active?: boolean; payload?: Array<{ name: string; value: number }> }

function CustomTooltip({ active, payload }: TTProps) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="bg-white border border-dark/10 rounded-xl shadow-lg px-3 py-2.5 text-sm">
      <p className="font-medium text-dark text-xs">{entry.name}</p>
      <p className="font-mono text-primary font-bold mt-0.5">{entry.value} bookings</p>
    </div>
  )
}

export default function BookingsByServiceChart({ data }: { data: ServiceBookings[] }) {
  const maxBookings = Math.max(...data.map(d => d.bookings))

  return (
    <ResponsiveContainer width="100%" height={data.length * 42 + 20}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 48, left: 0, bottom: 4 }}
        barCategoryGap="25%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F4" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false} tickLine={false}
          domain={[0, maxBookings + 2]}
        />
        <YAxis
          type="category"
          dataKey="service"
          tickFormatter={(v: string) => truncate(v, 20)}
          tick={{ fontSize: 11, fill: '#6B7280' }}
          axisLine={false} tickLine={false}
          width={130}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F4F4F4' }} />
        <Bar dataKey="bookings" name="bookings" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map((_, i) => (
            <Cell key={i} fill="#CC1212" fillOpacity={1 - i * 0.08} />
          ))}
          <LabelList
            dataKey="bookings"
            position="right"
            style={{ fontSize: 11, fontWeight: 600, fill: '#1A1A1A', fontFamily: 'DM Mono, monospace' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
