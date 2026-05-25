'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { TopProductRow } from '@/lib/mock-analytics'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function Sparkline({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({ v, i }))
  const first = data[0]
  const last  = data[data.length - 1]
  const color = last > first ? '#2D7A47' : last < first ? '#991010' : '#9CA3AF'
  return (
    <ResponsiveContainer width={60} height={28}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.5}
          dot={false} isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function TrendIcon({ data }: { data: number[] }) {
  const first = data[0]
  const last  = data[data.length - 1]
  if (last > first) return <TrendingUp  size={13} className="text-success" />
  if (last < first) return <TrendingDown size={13} className="text-danger" />
  return <Minus size={13} className="text-dark/30" />
}

export default function TopProductsChart({ data }: { data: TopProductRow[] }) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-[24px_1fr_64px_80px_80px] gap-2 px-1 pb-2 border-b border-dark/8">
        {['#', 'Product', 'Units', 'Revenue', 'Trend'].map(h => (
          <p key={h} className="text-[10px] font-semibold uppercase tracking-wide text-dark/35">{h}</p>
        ))}
      </div>

      {data.map((row, i) => (
        <div key={row.rank} className={`grid grid-cols-[24px_1fr_64px_80px_80px] gap-2 px-1 py-3 items-center border-b border-dark/5 ${i % 2 !== 0 ? 'bg-muted/20' : ''}`}>
          {/* Rank */}
          <span className="text-xs font-bold text-dark/30 tabular-nums">{row.rank}</span>

          {/* Name */}
          <p className="text-xs font-medium text-dark leading-snug">{row.name}</p>

          {/* Units */}
          <p className="text-xs font-semibold text-dark tabular-nums">{row.unitsSold}</p>

          {/* Revenue */}
          <p className="text-xs font-mono font-semibold text-dark tabular-nums">{formatPrice(row.revenue)}</p>

          {/* Trend */}
          <div className="flex items-center gap-1">
            <Sparkline data={row.sparkline} />
            <TrendIcon data={row.sparkline} />
          </div>
        </div>
      ))}
    </div>
  )
}
