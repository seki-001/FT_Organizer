import type { Metadata } from 'next'
import { Playfair_Display, Inter, DM_Mono } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import StorefrontChrome from '@/components/layout/StorefrontChrome'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.organizer.co.ke'),
  title: {
    default: 'Faith The Organizer — From Clutter to Order',
    template: '%s | Faith The Organizer',
  },
  description:
    "Nairobi's premier home & office organizing service. Book decluttering, home staging, moving, and office organizing today. Serving all Nairobi neighbourhoods.",
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.organizer.co.ke',
    siteName: 'Faith The Organizer',
    title: 'Faith The Organizer — From Clutter to Order',
    description: "Nairobi's premier home & office organizing service.",
    images: [{ url: '/og/home.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faith The Organizer',
    description: "Nairobi's premier home & office organizing service.",
    images: ['/og/home.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <StorefrontChrome>
                {children}
              </StorefrontChrome>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
