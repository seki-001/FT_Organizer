import Link from 'next/link'
import { Home, Layers } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-surface flex items-center justify-center px-4 overflow-hidden">

      {/* Faint tiled house-icon background */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='%23E8191A'%3E%3Cpath d='M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z'/%3E%3Cpath d='M9 21V12h6v9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize:   '60px 60px',
        }}
      />

      <div className="relative z-10 text-center flex flex-col items-center gap-6 max-w-md">
        {/* Large 404 */}
        <p className="font-display text-[120px] md:text-[160px] font-bold text-primary leading-none select-none">
          404
        </p>

        {/* Heading */}
        <div className="flex flex-col gap-2 -mt-4">
          <h1 className="font-display text-2xl md:text-3xl text-dark font-bold">
            Page Not Found
          </h1>
          <p className="text-dark/50 text-base leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            <Home size={17} aria-hidden="true" />
            Go Home
          </Link>
          <Link
            href="/services"
            className="flex items-center justify-center gap-2 border-2 border-dark/20 hover:border-primary text-dark hover:text-primary font-semibold px-7 py-3 rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            <Layers size={17} aria-hidden="true" />
            Browse Services
          </Link>
        </div>
      </div>
    </main>
  )
}
