import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor: string
  children: React.ReactNode
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

export default function FormField({
  label,
  htmlFor,
  children,
  hint,
  error,
  required,
  className,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined
  const hintId = hint ? `${htmlFor}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-dark">
        {label}
        {required ? (
          <span className="text-primary ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <div
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
      >
        {children}
      </div>
      {hint && !error ? (
        <p id={hintId} className="text-xs text-dark/50">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
