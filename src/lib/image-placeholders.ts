import { BLOG_COVERS, ROOM_IMAGES, SERVICE_IMAGES, SITE_IMAGES } from '@/lib/site-images'
import { CLIENT_AVATARS } from '@/lib/avatars'

export const IMG = {
  heroBg: SITE_IMAGES.heroLivingRoom,
  avatars: [...CLIENT_AVATARS],
  faithPortrait: SITE_IMAGES.hero,
  services: {
    beforeAfter1: SITE_IMAGES.sceneLivingRoom,
    beforeAfter2: SITE_IMAGES.sceneCloset,
    beforeAfter3: SITE_IMAGES.sceneKitchen,
    default: SITE_IMAGES.sceneStorage,
  },
  serviceBySlug: SERVICE_IMAGES,
  gallery: {
    transform1: SITE_IMAGES.sceneLivingRoom,
    transform2: SITE_IMAGES.sceneCloset,
    transform3: SITE_IMAGES.sceneKitchen,
    transform4: SITE_IMAGES.sceneOffice,
    transform5: SITE_IMAGES.sceneLaundry,
    testimonial1: SITE_IMAGES.sceneConsultation,
    testimonial2: SITE_IMAGES.scenePantry,
  },
  rooms: ROOM_IMAGES,
  blog: BLOG_COVERS,
} as const

export function serviceImage(slug: string): string {
  return SERVICE_IMAGES[slug] ?? SITE_IMAGES.sceneLivingRoom
}
