import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import EditorialServicesGrid from '@/components/sections/EditorialServicesGrid'
import BoldStatsBlock from '@/components/sections/BoldStatsBlock'
import FeaturedProductsEditorial from '@/components/sections/FeaturedProductsEditorial'
import TransformationShowcase from '@/components/sections/TransformationShowcase'
import EditorialBlogPreview from '@/components/sections/EditorialBlogPreview'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import AboutTeaser from '@/components/sections/AboutTeaser'
import FooterCTABand from '@/components/sections/FooterCTABand'

export const metadata: Metadata = {
  title: 'Home | Faith The Organizer',
  description:
    'Faith The Organizer — From Clutter to Order. Nairobi\'s premier home & office organizing service. Book decluttering, whole-house organizing, office organizing and more.',
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <EditorialServicesGrid />
      <BoldStatsBlock />
      <FeaturedProductsEditorial />
      <TransformationShowcase />
      <EditorialBlogPreview />
      <TestimonialsSection />
      <AboutTeaser />
      <FooterCTABand />
    </main>
  )
}
