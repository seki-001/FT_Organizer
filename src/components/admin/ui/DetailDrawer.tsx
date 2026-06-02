'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DetailDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: DetailDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button
        type="button"
        className="absolute inset-0 bg-dark/30 backdrop-blur-sm"
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        className={cn(
          'relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-dark/8',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-dark/8">
          <div>
            <h2 id="drawer-title" className="font-display text-lg font-bold text-dark">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-dark/50 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-dark/40 hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  )
}
