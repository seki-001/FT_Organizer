'use client'

import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import type { RevenueSeries } from '@/lib/mock-analytics'

interface TTPayload { name: string; value: number; color: string }
interface TTProps { active?: boolean; payload?: TTPayload[]; label?: string }

function CustomTooltip({ active, payload, label }: TTProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-dark/10 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
      <p className="text-dark/50 text-xs font-medium mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-dark/70 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
            {entry.name === 'shop' ? 'Shop' : 'Services'}
          </span>
          <span className="font-mono font-semibold text-dark text-xs">
            KSh {(entry.value ?? 0).toLocaleString('en-KE')}
          </span>
        </div>
      ))}
      <div className="border-t border-dark/8 mt-2 pt-2 flex items-center justify-between">
        <span className="text-xs text-dark/40">Total</span>
        <span className="font-mono font-bold text-dark text-xs">
          KSh {((payload[0]?.value ?? 0) + (payload[1]?.value ?? 0)).toLocaleString('en-KE')}
        </span>
      </div>
    </div>
  )
}

function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-6 mt-2 text-xs text-dark/60">
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-0.5 bg-primary rounded-full" />
        Shop Revenue
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-0.5 bg-accent rounded-full" />
        Service Revenue
      </span>
    </div>
  )
}

export default function RevenueChart({ data }: { data: RevenueSeries[] }) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="shopGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#CC1212" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#CC1212" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#E8A020" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#E8A020" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false} dy={8}
          />
          <YAxis
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false} tickLine={false} width={38}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F4F4F4', strokeWidth: 2 }} />
          <Area
            type="monotone" dataKey="shop" name="shop"
            stroke="#CC1212" strokeWidth={2.5}
            fill="url(#shopGradient)"
            dot={false} activeDot={{ r: 4, fill: '#CC1212', strokeWidth: 0 }}
          />
          <Area
            type="monotone" dataKey="service" name="service"
            stroke="#E8A020" strokeWidth={2.5}
            fill="url(#serviceGradient)"
            dot={false} activeDot={{ r: 4, fill: '#E8A020', strokeWidth: 0 }}
          />
          <Legend content={<CustomLegend />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
