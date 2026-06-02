'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const PREVIEW_MSG =
  'This action is disabled in preview mode. Connect your backend and payment flows before enabling live actions.'

interface PreviewActionButtonProps {
  label: string
  variant?: 'primary' | 'outline' | 'danger'
  className?: string
  title?: string
}

export default function PreviewActionButton({
  label,
  variant = 'primary',
  className,
  title = PREVIEW_MSG,
}: PreviewActionButtonProps) {
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setShowTip(true)}
        className={cn(
          'inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors min-h-[40px]',
          variant === 'primary' && 'bg-primary/90 text-white hover:bg-primary',
          variant === 'outline' && 'border border-dark/15 text-dark hover:border-primary hover:text-primary bg-white',
          variant === 'danger' && 'bg-danger/10 text-danger hover:bg-danger/15',
          className,
        )}
        aria-describedby={showTip ? 'preview-action-tip' : undefined}
      >
        {label}
      </button>
      {showTip && (
        <div
          id="preview-action-tip"
          role="status"
          className="absolute z-20 top-full mt-2 right-0 w-64 flex gap-2 rounded-xl border border-accent/30 bg-white shadow-lg p-3 text-xs text-dark/70"
        >
          <Info size={14} className="shrink-0 text-accent mt-0.5" />
          <p>
            {title}
            <button type="button" className="block mt-2 text-primary font-medium" onClick={() => setShowTip(false)}>
              Dismiss
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
