import { headers } from 'next/headers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'
import CookieBanner from '@/components/ui/CookieBanner'
import CartDrawer from '@/components/shop/CartDrawer'

interface StorefrontChromeProps {
  children: React.ReactNode
}

/** Public storefront chrome — omitted on /admin (server-side, no hydration flash). */
export default async function StorefrontChrome({ children }: StorefrontChromeProps) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  if (pathname.startsWith('/admin')) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  )
}
