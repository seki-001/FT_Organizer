import { CATEGORY_IMAGES, SITE_IMAGES } from '@/lib/site-images'

/** Product photography only — no lifestyle scenes or external URLs */
const P = SITE_IMAGES

/** Exact slug → product photography */
const PRODUCT_SLUG_IMAGES: Record<string, string[]> = {
  'acrylic-curved-basket-lidless': [P.acrylicBasket],
  'acrylic-flat-basket-with-lid': [P.acrylicBasket],
  'acrylic-flat-square-basket': [P.acrylicBasket],
  'acrylic-open-basket': [P.acrylicBasket],
  'acrylic-open-front-cut-basket': [P.acrylicBasket],
  'acrylic-square-basket': [P.acrylicBasket],
  'plastic-woven-basket': [P.wovenBaskets],
  'rattan-brown-basket': [P.wovenBaskets],
  'alm-tissue-box-holder': [P.tissueBox],
  'round-mounted-tissue-holder-box': [P.tissueBox],
  'plastic-waterproof-tissue-holder': [P.tissueBox],
  'stackable-fridge-containers-set': [P.fridgeOrganizers],
  'bamboo-pantry-jars-set-of-4': [P.pantryContainers],
  'closet-divider-set': [P.drawerDividers],
  'under-sink-organiser': [P.underSink, P.underSinkInstalled],
  'desk-organiser-tray-set': [P.deskOrganizer],
  '3pc-innerwear-organizer': [P.fabricOrganizerSet],
  '4pc-innerwear-cream-organizer': [P.fabricOrganizerSet],
  'innerwear-2sided-organizer': [P.fabricOrganizerSet],
  'innerwear-organizer-without-divisions': [P.fabricOrganizerSet],
  'jewellery-360-acrylic-organizer-big': [P.makeupCarousel],
  'jewellery-360-plastic-organizer-small': [P.makeupCarousel],
  'make-up-acrylic-organizer': [P.makeupDrawer, P.makeupCarousel],
  'lipstick-acrylic-organizer': [P.makeupCarousel],
  'nail-polish-4tier-acrylic-organizer': [P.makeupCarousel],
  '10pc-vacuum-storage-bags': [P.vacuumBags],
  '4pc-vacuum-bags': [P.vacuumBags],
  'twin-shoe-organizers': [P.shoeBoxes],
  '3pc-kids-hangers': [P.hangers],
  '8slot-plastic-shirts-hanger-organizer': [P.hangers],
  'metallic-3tier-over-the-toilet-stand-organizer': [P.underSink],
  'sst-2tier-brimix-corner-bathroom-shelf': [P.underSink],
}

function matchByPattern(slug: string): string[] | null {
  if (/acrylic.*basket|plastic-open-basket|plastic-grocery|plastic-pegs|plastic-shopping|plastic-whitetiny/.test(slug)) {
    return [P.acrylicBasket]
  }
  if (/woven|rattan|basket/.test(slug) && !slug.includes('acrylic')) {
    return [P.wovenBaskets]
  }
  if (/vacuum/.test(slug)) return [P.vacuumBags]
  if (/shoe/.test(slug)) return [P.shoeBoxes]
  if (/hanger|hanging/.test(slug)) return [P.hangers]
  if (/tissue/.test(slug)) return [P.tissueBox]
  if (/under.?sink|over-the-toilet|bathroom/.test(slug)) return [P.underSink]
  if (/fridge|egg|can-|ice/.test(slug)) return [P.fridgeOrganizers]
  if (/pantry|jar|spice|kitchen/.test(slug)) return [P.pantryContainers]
  if (/desk|stationery|archive|paperwork|file/.test(slug)) return [P.deskOrganizer]
  if (/innerwear|drawer|wardrobe|closet|fabric-box|hanging-organizer/.test(slug)) {
    return [P.fabricOrganizerSet]
  }
  if (/make-up|makeup|cosmetic|jewellery|lipstick|nail-polish|watch-organizer|brush-3part|glassshades|pvc-cosmetic|cotton/.test(slug)) {
    return [P.makeupDrawer]
  }
  if (/laundry|hamper|trashbin|cleaning/.test(slug)) return [P.laundryHamper]
  if (/travel|car-|seat-back|visor/.test(slug)) return [P.shoeBoxes]
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

/** Local product or category assets only */
function isLocalAsset(url: string): boolean {
  return url.startsWith('/images/') && !url.includes('unsplash')
}

export function imagesForProduct(slug: string, category?: string): string[] {
  const cat = normalizeCategory(category)
  if (PRODUCT_SLUG_IMAGES[slug]) return PRODUCT_SLUG_IMAGES[slug]
  const pattern = matchByPattern(slug)
  if (pattern) return pattern
  if (cat && CATEGORY_IMAGES[cat] && isLocalAsset(CATEGORY_IMAGES[cat])) {
    return [CATEGORY_IMAGES[cat]]
  }
  return [P.acrylicBasket]
}

export { CATEGORY_IMAGES }
