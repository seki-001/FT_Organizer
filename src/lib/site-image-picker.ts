/**
 * Curated image lists for admin pickers — scenes, categories, products, blog covers.
 */

import { SHOP_CATEGORIES } from '@/lib/constants'
import { BLOG_COVERS, CATEGORY_IMAGES, SITE_IMAGES } from '@/lib/site-images'
import type { BlogCategory } from '@/lib/types'

export type PickerImage = { src: string; label: string }

/** Lifestyle / editorial scenes */
export const SCENE_PICKER: PickerImage[] = [
  { src: SITE_IMAGES.sceneLivingRoom,   label: 'Living room' },
  { src: SITE_IMAGES.sceneKitchen,      label: 'Kitchen' },
  { src: SITE_IMAGES.scenePantry,       label: 'Pantry' },
  { src: SITE_IMAGES.sceneCloset,       label: 'Closet' },
  { src: SITE_IMAGES.sceneBathroom,     label: 'Bathroom' },
  { src: SITE_IMAGES.sceneOffice,       label: 'Office' },
  { src: SITE_IMAGES.sceneLaundry,     label: 'Laundry' },
  { src: SITE_IMAGES.sceneStorage,      label: 'Storage' },
  { src: SITE_IMAGES.sceneEntryway,     label: 'Entryway' },
  { src: SITE_IMAGES.sceneConsultation, label: 'Consultation' },
  { src: SITE_IMAGES.heroLivingRoom,    label: 'Hero living room' },
]

/** Shop category hero images */
export const CATEGORY_PICKER: PickerImage[] = SHOP_CATEGORIES.map((c) => ({
  src: c.image,
  label: c.label,
}))

/** Product photography (img-01 … img-30) */
export const PRODUCT_SHOT_PICKER: PickerImage[] = Array.from({ length: 30 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return { src: `/images/site/img-${n}.png`, label: `Product ${n}` }
})

/** Blog cover presets */
export const BLOG_COVER_PICKER: PickerImage[] = [
  { src: BLOG_COVERS.kitchen,  label: 'Kitchen tips' },
  { src: BLOG_COVERS.home,     label: 'Home' },
  { src: BLOG_COVERS.products, label: 'Products' },
  { src: BLOG_COVERS.moving,   label: 'Moving' },
  { src: BLOG_COVERS.tips,     label: 'Organizing tips' },
  { src: BLOG_COVERS.office,   label: 'Office' },
  ...SCENE_PICKER.slice(0, 4),
]

const BLOG_CATEGORY_COVERS: Record<BlogCategory, string> = {
  'home-tips':        BLOG_COVERS.kitchen,
  'office':           BLOG_COVERS.office,
  'before-and-after': BLOG_COVERS.home,
  'product-reviews':  BLOG_COVERS.products,
  'nairobi-living':   BLOG_COVERS.moving,
}

export function blogCoverForCategory(category: string): string {
  return BLOG_CATEGORY_COVERS[category as BlogCategory] ?? BLOG_COVERS.home
}

export function categoryImage(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? SITE_IMAGES.acrylicBasket
}
