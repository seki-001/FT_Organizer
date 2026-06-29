import PageTransition from '@/components/ui/PageTransition'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <div className="glass-grid-bg min-h-screen">{children}</div>
    </PageTransition>
  )
}
