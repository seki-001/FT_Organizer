'use client'

import { evaluatePasswordStrength } from '@/lib/auth-ui'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
  className?: string
}

export default function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { level, score, label, barClass } = evaluatePasswordStrength(password)

  if (level === 'empty') return null

  return (
    <div className={cn('space-y-2', className)} aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-200',
              segment <= score ? barClass : 'bg-dark/10',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-dark/50">
        Password strength: <span className="font-medium text-dark/70">{label}</span>
      </p>
    </div>
  )
}
