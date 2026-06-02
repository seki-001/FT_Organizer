import { SHOP_CATEGORIES } from '@/lib/constants'
import type { Product, ProductCategory } from '@/lib/types'

export type ShopSortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc'

export const SHOP_SORT_OPTIONS: { value: ShopSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export const SHOP_MAX_PRICE = 20000

export function categoryLabel(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

export function effectivePrice(product: Product) {
  return product.salePrice ?? product.price
}

export function sortProducts(products: Product[], sort: ShopSortOption, order: Product[]): Product[] {
  const list = [...products]
  return list.sort((a, b) => {
    const aPrice = effectivePrice(a)
    const bPrice = effectivePrice(b)
    if (sort === 'price-asc') return aPrice - bPrice
    if (sort === 'price-desc') return bPrice - aPrice
    if (sort === 'featured') {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return order.indexOf(a) - order.indexOf(b)
    }
    return order.indexOf(a) - order.indexOf(b)
  })
}

export const CATEGORY_HERO_IMAGES: Record<string, string> = {
  all: '/images/shop/shop-hero.jpg',
  'kitchen-organization': '/images/shop/fridge-organizer-lifestyle.jpg',
  'closet-and-bedroom': '/images/shop/shop-hero.jpg',
  'office-and-desk': '/images/shop/shop-hero.jpg',
  'storage-solutions': '/images/shop/shop-hero.jpg',
  bundles: '/images/shop/cup-organizer-lifestyle.jpg',
}

export const ORGANIZING_TIPS: Record<ProductCategory, { title: string; body: string }[]> = {
  'kitchen-organization': [
    {
      title: 'Zone your countertops',
      body: 'Keep daily-use items within arm’s reach and store occasional tools higher or in drawers.',
    },
    {
      title: 'Label fridge zones',
      body: 'Use clear bins for produce, drinks, and leftovers so everyone knows where things belong.',
    },
  ],
  'closet-and-bedroom': [
    {
      title: 'Match hanger types',
      body: 'Slim velvet hangers free rod space and keep clothes from slipping off.',
    },
    {
      title: 'Seasonal rotation',
      body: 'Store off-season pieces in under-bed bags and refresh your closet twice a year.',
    },
  ],
  'office-and-desk': [
    {
      title: 'One-touch paper rule',
      body: 'File, action, or recycle mail the first time you touch it — no mystery piles.',
    },
    {
      title: 'Cable containment',
      body: 'Bundle chargers and route cables through a box so your desk stays calm and safe.',
    },
  ],
  'storage-solutions': [
    {
      title: 'Stack with labels',
      body: 'Clear bins work best when every lid faces out and every bin has a simple label.',
    },
    {
      title: 'Vertical shoe storage',
      body: 'Over-door racks reclaim floor space in entryways and small bedrooms.',
    },
  ],
  bundles: [
    {
      title: 'Start with one room',
      body: 'Bundles are curated to tackle a single space end-to-end — kitchen or desk first.',
    },
    {
      title: 'Unpack and assign homes',
      body: 'Before buying more, give every new organizer a permanent home in the room.',
    },
  ],
}
