/**
 * Single source of truth for all site imagery.
 * Product shots: /images/site/img-01 … img-30
 * Lifestyle scenes: /images/site/scene-*.png + hero-living-room
 * Category heroes: /images/categories/cat-*.png
 */

const S = (n: number) => `/images/site/img-${String(n).padStart(2, '0')}.png`
const SCENE = (name: string) => `/images/site/scene-${name}.png`

export const SITE_IMAGES = {
  /** Faith at work — about / founder */
  hero: S(1),
  /** Homepage hero */
  heroLivingRoom: '/images/site/hero-living-room.png',

  // ─── Lifestyle / editorial scenes (unique — do not reuse for products) ───
  sceneLivingRoom: SCENE('living-room'),
  scenePantry: SCENE('pantry'),
  sceneCloset: SCENE('closet'),
  sceneBathroom: SCENE('bathroom'),
  sceneOffice: SCENE('office'),
  sceneLaundry: SCENE('laundry'),
  sceneStorage: SCENE('storage'),
  sceneEntryway: SCENE('entryway'),
  sceneConsultation: SCENE('consultation'),
  sceneKitchen: SCENE('kitchen'),

  // ─── Aliases (sections reference these — each maps to a distinct scene) ───
  livingRoom: SCENE('living-room'),
  kitchenPantry: SCENE('kitchen'),
  consultation: SCENE('consultation'),
  pantryLifestyle: SCENE('pantry'),
  officeOrganizing: SCENE('office'),
  closetLifestyle: SCENE('closet'),
  laundryLifestyle: SCENE('laundry'),

  // ─── Product photography (img-01 … img-30) ─────────────────────────────
  acrylicBasket: S(2),
  tissueBox: S(6),
  sprayBottles: S(7),
  fabricOrganizerSet: S(8),
  iceTray: S(9),
  makeupCarousel: S(10),
  movingPacking: S(15),
  wovenBaskets: S(16),
  pantryContainers: S(17),
  fridgeOrganizers: S(18),
  deskOrganizer: S(19),
  underSink: S(20),
  vacuumBags: S(21),
  shoeBoxes: S(22),
  underSinkInstalled: S(23),
  eggContainer: S(24),
  spiceTray: S(25),
  laundryHamper: S(26),
  hangers: S(27),
  drawerDividers: S(28),
  canDispenser: S(29),
  makeupDrawer: S(30),
} as const

export const ROOM_IMAGES = {
  kitchen: SITE_IMAGES.sceneKitchen,
  livingRoom: SITE_IMAGES.sceneLivingRoom,
  bedroom: SITE_IMAGES.sceneCloset,
  bathroom: SITE_IMAGES.sceneBathroom,
  office: SITE_IMAGES.sceneOffice,
  moving: SITE_IMAGES.movingPacking,
  wholeHome: SITE_IMAGES.sceneStorage,
} as const

export const SERVICE_IMAGES: Record<string, string> = {
  'site-visit': SITE_IMAGES.sceneConsultation,
  'professional-organizing': SITE_IMAGES.sceneLivingRoom,
  'storage-design-installation': SITE_IMAGES.sceneCloset,
  'cleaning-housekeeping': SITE_IMAGES.sceneBathroom,
  'relocation-transition': SITE_IMAGES.movingPacking,
  'home-management': SITE_IMAGES.sceneStorage,
  'events-catering-decor': SITE_IMAGES.sceneEntryway,
  'training-development': SITE_IMAGES.sceneConsultation,
  'staffing-workforce': SITE_IMAGES.sceneOffice,
  'organizing-products': SITE_IMAGES.wovenBaskets,
}

export const CATEGORY_IMAGES: Record<string, string> = {
  kitchen: '/images/categories/cat-kitchen.png',
  pantry: '/images/categories/cat-pantry.png',
  fridge: '/images/categories/cat-fridge.png',
  'closet-bedroom': '/images/categories/cat-closet-bedroom.png',
  bathroom: '/images/categories/cat-bathroom.png',
  'beauty-cosmetics': '/images/categories/cat-beauty-cosmetics.png',
  stationery: '/images/categories/cat-stationery.png',
  'laundry-cleaning': '/images/categories/cat-laundry-cleaning.png',
  'shelves-drawers': '/images/categories/cat-shelves-drawers.png',
  baskets: '/images/categories/cat-baskets.png',
  'storage-containers': SITE_IMAGES.drawerDividers,
  travel: SITE_IMAGES.vacuumBags,
  'grooming-hygiene': SITE_IMAGES.makeupDrawer,
  hardware: SITE_IMAGES.underSink,
  gadgets: SITE_IMAGES.deskOrganizer,
  'interior-decor': SITE_IMAGES.tissueBox,
  'kids-corner': SITE_IMAGES.fabricOrganizerSet,
  furniture: SITE_IMAGES.tissueBox,
  'stands-racks': SITE_IMAGES.hangers,
  'car-organizers': SITE_IMAGES.shoeBoxes,
  dining: SITE_IMAGES.canDispenser,
  spices: SITE_IMAGES.spiceTray,
  health: SITE_IMAGES.eggContainer,
  packaging: SITE_IMAGES.iceTray,
}

export const BLOG_COVERS = {
  kitchen: SITE_IMAGES.sceneKitchen,
  home: SITE_IMAGES.sceneLivingRoom,
  products: SITE_IMAGES.acrylicBasket,
  moving: SITE_IMAGES.movingPacking,
  tips: SITE_IMAGES.sceneCloset,
  office: SITE_IMAGES.sceneOffice,
} as const

export function serviceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? SITE_IMAGES.sceneLivingRoom
}
