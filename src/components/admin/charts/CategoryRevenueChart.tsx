'use client'

import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import type { CategoryRevenue } from '@/lib/mock-analytics'

interface TTProps { active?: boolean; payload?: Array<{ value: number }>; label?: string }

function CustomTooltip({ active, payload, label }: TTProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-dark/10 rounded-xl shadow-lg px-3 py-2.5 text-sm">
      <p className="text-dark/50 text-xs mb-1">{label}</p>
      <p className="font-mono font-bold text-dark">
        KSh {(payload[0].value ?? 0).toLocaleString('en-KE')}
      </p>
    </div>
  )
}

export default function CategoryRevenueChart({ data }: { data: CategoryRevenue[] }) {
  const max = Math.max(...data.map(d => d.revenue))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }} barCategoryGap="30%">
        <defs>
          {data.map((_, i) => {
            const t = i / (data.length - 1)
            // Gradient interpolation: primary (#CC1212) → accent (#E8A020)
            const r = Math.round(0xCC + (0xE8 - 0xCC) * t)
            const g = Math.round(0x12 + (0xA0 - 0x12) * t)
            const b = Math.round(0x12 + (0x20 - 0x12) * t)
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
            return (
              <linearGradient key={i} id={`catGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={hex} stopOpacity={0.9} />
                <stop offset="100%" stopColor={hex} stopOpacity={0.5} />
              </linearGradient>
            )
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F4" vertical={false} />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false} tickLine={false} dy={6}
        />
        <YAxis
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false} tickLine={false} width={36}
          domain={[0, max * 1.15]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F4F4F4' }} />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((_, i) => (
            <Cell key={i} fill={`url(#catGrad${i})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
