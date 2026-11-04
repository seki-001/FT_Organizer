import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.NODE_ENV === 'production'

  // Staging / preview deployments must never be indexed.
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/account', '/checkout', '/cart', '/order-confirmation', '/pay', '/auth/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
