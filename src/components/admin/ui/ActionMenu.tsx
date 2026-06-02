'use client'

import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ActionMenuItem {
  label: string
  href?: string
  onClick?: () => void
  destructive?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  ariaLabel?: string
}

export default function ActionMenu({ items, ariaLabel = 'Actions' }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-dark/40 hover:bg-muted hover:text-dark"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 z-20 min-w-[140px] bg-white border border-dark/10 rounded-xl shadow-lg py-1"
        >
          {items.map((item) => {
            const className = cn(
              'block w-full text-left px-3 py-2 text-sm transition-colors',
              item.destructive ? 'text-danger hover:bg-danger/5' : 'text-dark/70 hover:bg-muted',
            )
            if (item.href) {
              return (
                <Link key={item.label} href={item.href} role="menuitem" className={className} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              )
            }
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={className}
                onClick={() => {
                  item.onClick?.()
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
