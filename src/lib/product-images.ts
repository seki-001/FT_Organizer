import { CATEGORY_IMAGES, SITE_IMAGES } from '@/lib/site-images'

/** Exact slug → product photography */
const PRODUCT_SLUG_IMAGES: Record<string, string[]> = {
  'acrylic-curved-basket-lidless': [SITE_IMAGES.acrylicBasket],
  'acrylic-flat-basket-with-lid': [SITE_IMAGES.acrylicBasket],
  'acrylic-flat-square-basket': [SITE_IMAGES.acrylicBasket],
  'acrylic-open-basket': [SITE_IMAGES.acrylicBasket],
  'acrylic-open-front-cut-basket': [SITE_IMAGES.acrylicBasket],
  'acrylic-square-basket': [SITE_IMAGES.acrylicBasket],
  'plastic-woven-basket': [SITE_IMAGES.wovenBaskets],
  'rattan-brown-basket': [SITE_IMAGES.wovenBaskets],
  'alm-tissue-box-holder': [SITE_IMAGES.tissueBox],
  'round-mounted-tissue-holder-box': [SITE_IMAGES.tissueBox],
  'plastic-waterproof-tissue-holder': [SITE_IMAGES.tissueBox],
  'stackable-fridge-containers-set': [SITE_IMAGES.fridgeOrganizers, SITE_IMAGES.pantryContainers],
  'bamboo-pantry-jars-set-of-4': [SITE_IMAGES.scenePantry, SITE_IMAGES.pantryContainers],
  'closet-divider-set': [SITE_IMAGES.drawerDividers],
  'under-sink-organiser': [SITE_IMAGES.underSink, SITE_IMAGES.underSinkInstalled],
  'desk-organiser-tray-set': [SITE_IMAGES.deskOrganizer],
  '3pc-innerwear-organizer': [SITE_IMAGES.fabricOrganizerSet],
  '4pc-innerwear-cream-organizer': [SITE_IMAGES.fabricOrganizerSet],
  'innerwear-2sided-organizer': [SITE_IMAGES.fabricOrganizerSet],
  'innerwear-organizer-without-divisions': [SITE_IMAGES.fabricOrganizerSet],
  'jewellery-360-acrylic-organizer-big': [SITE_IMAGES.makeupCarousel],
  'jewellery-360-plastic-organizer-small': [SITE_IMAGES.makeupCarousel],
  'make-up-acrylic-organizer': [SITE_IMAGES.makeupDrawer, SITE_IMAGES.makeupCarousel],
  'lipstick-acrylic-organizer': [SITE_IMAGES.makeupCarousel],
  'nail-polish-4tier-acrylic-organizer': [SITE_IMAGES.makeupCarousel],
  '10pc-vacuum-storage-bags': [SITE_IMAGES.vacuumBags],
  '4pc-vacuum-bags': [SITE_IMAGES.vacuumBags],
  'twin-shoe-organizers': [SITE_IMAGES.shoeBoxes],
  '3pc-kids-hangers': [SITE_IMAGES.hangers],
  '8slot-plastic-shirts-hanger-organizer': [SITE_IMAGES.hangers],
  'metallic-3tier-over-the-toilet-stand-organizer': [SITE_IMAGES.underSink],
  'sst-2tier-brimix-corner-bathroom-shelf': [SITE_IMAGES.underSink],
}

function matchByPattern(slug: string): string[] | null {
  if (/acrylic.*basket|plastic-open-basket|plastic-grocery|plastic-pegs|plastic-shopping|plastic-whitetiny/.test(slug)) {
    return [SITE_IMAGES.acrylicBasket]
  }
  if (/woven|rattan|basket/.test(slug) && !slug.includes('acrylic')) {
    return [SITE_IMAGES.wovenBaskets]
  }
  if (/vacuum/.test(slug)) return [SITE_IMAGES.vacuumBags]
  if (/shoe/.test(slug)) return [SITE_IMAGES.shoeBoxes]
  if (/hanger|hanging/.test(slug)) return [SITE_IMAGES.hangers]
  if (/tissue/.test(slug)) return [SITE_IMAGES.tissueBox]
  if (/under.?sink|over-the-toilet|bathroom/.test(slug)) return [SITE_IMAGES.underSink]
  if (/fridge|egg|can-|ice/.test(slug)) return [SITE_IMAGES.fridgeOrganizers]
  if (/pantry|jar|spice|kitchen/.test(slug)) return [SITE_IMAGES.pantryContainers]
  if (/desk|stationery|archive|paperwork|file/.test(slug)) return [SITE_IMAGES.deskOrganizer]
  if (/innerwear|drawer|wardrobe|closet|fabric-box|hanging-organizer/.test(slug)) {
    return [SITE_IMAGES.fabricOrganizerSet]
  }
  if (/make-up|makeup|cosmetic|jewellery|lipstick|nail-polish|watch-organizer|brush-3part|glassshades|pvc-cosmetic|cotton/.test(slug)) {
    return [SITE_IMAGES.makeupDrawer]
  }
  if (/laundry|hamper|trashbin|cleaning/.test(slug)) return [SITE_IMAGES.laundryHamper]
  if (/travel|car-|seat-back|visor/.test(slug)) return [SITE_IMAGES.shoeBoxes]
  return null
}

const LEGACY_CATEGORIES: Record<string, string> = {
  'kitchen-organization': 'kitchen',
  'closet-and-bedroom': 'closet-bedroom',
  'office-and-desk': 'stationery',
  'storage-solutions': 'storage-containers',
}

function normalizeCategory(category?: string): string | undefined {
  if (!category) return undefined
  return LEGACY_CATEGORIES[category] ?? category
}

export function imagesForProduct(slug: string, category?: string): string[] {
  const cat = normalizeCategory(category)
  if (PRODUCT_SLUG_IMAGES[slug]) return PRODUCT_SLUG_IMAGES[slug]
  const pattern = matchByPattern(slug)
  if (pattern) return pattern
  if (cat && CATEGORY_IMAGES[cat]) return [CATEGORY_IMAGES[cat]]
  return [SITE_IMAGES.acrylicBasket]
}

export { CATEGORY_IMAGES }
