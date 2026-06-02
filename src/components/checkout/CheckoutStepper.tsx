import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['Details', 'Delivery', 'Payment'] as const

export default function CheckoutStepper({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {STEPS.map((label, i) => {
          const n = i + 1
          const done = n < step
          const current = n === step
          return (
            <div key={label} className="flex flex-col items-center gap-2 z-10 flex-1">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                  done && 'bg-primary border-primary text-white',
                  current && 'bg-white border-primary text-primary',
                  !done && !current && 'bg-white border-dark/15 text-dark/35',
                )}
              >
                {done ? <Check size={16} aria-hidden="true" /> : n}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs font-medium uppercase tracking-wide text-center',
                  current ? 'text-primary' : done ? 'text-dark/55' : 'text-dark/30',
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
        <div className="absolute top-[18px] left-[12%] right-[12%] h-px bg-dark/10 -z-0" aria-hidden="true">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
