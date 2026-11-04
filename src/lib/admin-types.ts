import type { BlogPost, BlogCategory } from '@/lib/types'

/** Admin-extended blog post with draft support and view counts. */
export interface AdminPost extends BlogPost {
  status: 'draft' | 'published'
  views: number
  metaTitle?: string
  metaDescription?: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  usageLimit: number | null
  uses: number
  expiresAt: string | null
  active: boolean
  createdAt: string
}

export const BLOG_CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: 'home-tips',        label: 'Home Tips'        },
  { value: 'office',           label: 'Office'           },
  { value: 'before-and-after', label: 'Before & After'   },
  { value: 'product-reviews',  label: 'Product Reviews'  },
  { value: 'nairobi-living',   label: 'Nairobi Living'   },
]

/** Generate a random coupon code suggestion. */
export function generateCouponCode(): string {
  const prefixes = ['SAVE', 'GET', 'FAITH', 'SHOP', 'DEAL', 'OFF']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const num = Math.floor(Math.random() * 50) * 5 + 5
  return `${prefix}${num}`
}
