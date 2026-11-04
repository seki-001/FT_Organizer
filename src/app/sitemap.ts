import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'
import { SERVICES } from '@/lib/constants'
import { listProducts } from '@/lib/db/products'
import { listPublishedPosts } from '@/lib/db/blog'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()

  const staticPaths = ['', '/about', '/services', '/shop', '/blog', '/book', '/contact', '/faq',
    '/shipping-and-returns', '/privacy-policy', '/terms-and-conditions']
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/shop' ? 'daily' : 'monthly',
    priority: path === '' ? 1 : path === '/services' || path === '/shop' ? 0.9 : 0.6,
  }))

  for (const s of SERVICES) {
    entries.push({ url: `${base}/services/${s.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 })
  }

  try {
    const [products, posts] = await Promise.all([listProducts({}), listPublishedPosts()])
    for (const p of products) {
      entries.push({ url: `${base}/shop/${p.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 })
    }
    for (const post of posts) {
      entries.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch {
    // Database unavailable at build time: fall back to the static entries.
  }
  return entries
}
