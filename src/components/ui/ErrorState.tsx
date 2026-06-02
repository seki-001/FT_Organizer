'use client'

import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
      role="alert"
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10"
        aria-hidden="true"
      >
        <AlertCircle className="h-8 w-8 text-danger" />
      </div>
      <h3 className="font-display text-xl font-semibold text-dark mb-2">{title}</h3>
      <p className="text-sm text-dark/60 max-w-md leading-relaxed mb-6">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
