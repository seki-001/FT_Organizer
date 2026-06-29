import { SERVICE_IMAGES, SITE_IMAGES } from '@/lib/site-images'

/** Lifestyle scenes for editorial blends — each key uses a distinct image */
export const ILLUSTRATIONS = {
  homeOrganizing: SITE_IMAGES.sceneLivingRoom,
  cleaningTeam: SITE_IMAGES.sceneOffice,
  cleaningPanorama: SITE_IMAGES.sceneLaundry,
  homeRenovation: SITE_IMAGES.sceneEntryway,
  diyBuilders: SITE_IMAGES.sceneKitchen,
  movingBoxes: SITE_IMAGES.movingPacking,
  painter: SITE_IMAGES.sceneBathroom,
  carpenter: SITE_IMAGES.sceneStorage,
  closetStudio: SITE_IMAGES.sceneCloset,
} as const

export type IllustrationKey = keyof typeof ILLUSTRATIONS

export const SERVICE_ILLUSTRATIONS: Record<string, IllustrationKey> = {
  'general-decluttering': 'homeOrganizing',
  'whole-house-organizing': 'carpenter',
  'moving-house': 'movingBoxes',
  'shelving-and-storage': 'closetStudio',
  'packing-and-removal': 'movingBoxes',
  'paperwork-management': 'cleaningTeam',
  'online-coaching': 'homeOrganizing',
  'online-consulting': 'homeRenovation',
  'home-staging': 'painter',
  'space-planning': 'diyBuilders',
  'office-organizing': 'cleaningTeam',
}

export function illustrationForService(slug: string): string {
  return SERVICE_IMAGES[slug] ?? SITE_IMAGES.sceneLivingRoom
}
