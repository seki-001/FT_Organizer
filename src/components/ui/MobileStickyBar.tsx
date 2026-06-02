import { cn } from '@/lib/utils'

interface MobileStickyBarProps {
  children: React.ReactNode
  className?: string
  /** Hide from lg breakpoint upward */
  hiddenFrom?: 'lg' | 'md'
}

/**
 * Fixed bottom action bar for mobile — safe-area aware, sits above WhatsApp float offset.
 */
export default function MobileStickyBar({
  children,
  className,
  hiddenFrom = 'lg',
}: MobileStickyBarProps) {
  const hidden = hiddenFrom === 'md' ? 'md:hidden' : 'lg:hidden'

  return (
    <div
      className={cn(
        hidden,
        'fixed bottom-0 inset-x-0 z-40',
        'border-t border-dark/10 bg-white/95 backdrop-blur-md',
        'shadow-[0_-4px_24px_rgba(0,0,0,0.08)]',
        'px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {children}
    </div>
  )
}
