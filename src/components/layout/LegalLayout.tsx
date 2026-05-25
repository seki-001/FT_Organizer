import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface LegalLayoutProps {
  title:       string
  subtitle?:   string
  lastUpdated: string   // e.g. "March 2025"
  children:    React.ReactNode
}

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <main>
      {/* Hero */}
      <section className="bg-dark text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-white/40 text-xs mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-white/70">{title}</span>
          </nav>
          <div className="max-w-2xl flex flex-col gap-3">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/60 text-base">{subtitle}</p>
            )}
            <p className="text-white/40 text-sm">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </section>

      {/* Prose content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-20">
        <article
          className="
            prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-dark
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-dark/10
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-dark/65 prose-p:leading-relaxed
            prose-li:text-dark/65 prose-li:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-dark
            prose-blockquote:border-primary prose-blockquote:text-dark/60
          "
        >
          {children}
        </article>
      </div>
    </main>
  )
}
