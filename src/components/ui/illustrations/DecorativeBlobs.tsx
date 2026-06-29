import { cn } from '@/lib/utils'

interface DecorativeBlobsProps {
  className?: string
  variant?: 'warm' | 'cool' | 'brand'
}

/** Soft organic blobs behind photo + illustration blends */
export default function DecorativeBlobs({ className, variant = 'brand' }: DecorativeBlobsProps) {
  const colors =
    variant === 'warm'
      ? { a: 'bg-accent/25', b: 'bg-primary/15', c: 'bg-accent/10' }
      : variant === 'cool'
        ? { a: 'bg-blue-400/15', b: 'bg-primary/10', c: 'bg-accent/15' }
        : { a: 'bg-primary/12', b: 'bg-accent/18', c: 'bg-primary/8' }

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className={cn('absolute -top-16 -right-12 w-64 h-64 rounded-full blur-3xl', colors.a)} />
      <div className={cn('absolute top-1/3 -left-20 w-72 h-72 rounded-full blur-3xl', colors.b)} />
      <div className={cn('absolute -bottom-10 right-1/4 w-48 h-48 rounded-full blur-2xl', colors.c)} />
    </div>
  )
}
