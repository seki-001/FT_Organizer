/**
 * Curated Unsplash images for products in the staging database.
 * Update via PATCH or re-seed when adding products.
 */
export const PRODUCT_IMAGES: Record<string, string[]> = {
  'acrylic-curved-basket-lidless': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
  ],
  'stackable-fridge-containers-set': [
    'https://images.unsplash.com/photo-1571175443880-49e8d25f2d8c?w=800&q=80',
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
  ],
  'bamboo-pantry-jars-set-of-4': [
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&q=80',
    'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80',
  ],
  'closet-divider-set': [
    'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
  ],
  'under-sink-organiser': [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
  ],
  'desk-organiser-tray-set': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
  ],
}

export function imagesForProduct(slug: string, fallback?: string[]): string[] {
  return PRODUCT_IMAGES[slug] ?? fallback ?? [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ]
}
