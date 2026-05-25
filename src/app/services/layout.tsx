import PageTransition from '@/components/ui/PageTransition'

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
