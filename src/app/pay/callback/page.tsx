import { Suspense } from 'react'
import PayCallbackClient from './PayCallbackClient'

export default function PayCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[60vh] flex items-center justify-center text-dark/60">Loading…</main>
    }>
      <PayCallbackClient />
    </Suspense>
  )
}
