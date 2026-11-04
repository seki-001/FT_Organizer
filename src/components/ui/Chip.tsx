import { cn } from '@/lib/utils'

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

/** Filter / category pill. Exposes its state to assistive tech via aria-pressed. */
export default function Chip({ active = false, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn('chip cursor-pointer', active && 'active', className)}
      {...props}
    />
  )
}
