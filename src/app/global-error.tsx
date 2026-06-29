'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-dark text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-white/60 mb-6">We hit an unexpected error. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
