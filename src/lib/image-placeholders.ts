/**
 * Curated Unsplash imagery until brand photography is in /public.
 */
export const IMG = {
  heroBg:
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80',
  avatars: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=72&h=72&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=72&h=72&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=72&h=72&fit=crop',
  ],
  faithPortrait:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=675&fit=crop',
  services: {
    beforeAfter1:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&fit=crop',
    beforeAfter2:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300&fit=crop',
    beforeAfter3:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&fit=crop',
    default:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&fit=crop',
  },
  serviceBySlug: {
    'general-decluttering': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&fit=crop',
    'whole-house-organizing': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&fit=crop',
    'moving-house': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop',
    'shelving-and-storage': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&fit=crop',
    'packing-and-removal': 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&fit=crop',
    'paperwork-management': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&fit=crop',
    'online-coaching': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&fit=crop',
    'online-consulting': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&fit=crop',
    'home-staging': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&fit=crop',
    'space-planning': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&fit=crop',
    'office-organizing': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&fit=crop',
  } as Record<string, string>,
  gallery: {
    transform1:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&fit=crop',
    transform2:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&fit=crop',
    transform3:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&fit=crop',
    transform4:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&fit=crop',
    transform5:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&fit=crop',
    testimonial1:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&fit=crop',
    testimonial2:
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&fit=crop',
  },
} as const

export function serviceImage(slug: string): string {
  return IMG.serviceBySlug[slug] ?? IMG.services.default
}
