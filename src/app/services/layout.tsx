import PageTransition from '@/components/ui/PageTransition'

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <div className="glass-grid-bg min-h-screen">{children}</div>
    </PageTransition>
  )
}
