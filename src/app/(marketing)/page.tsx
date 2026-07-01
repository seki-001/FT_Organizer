import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import ServicesStrip from '@/components/sections/ServicesStrip'
import StatsSection from '@/components/sections/StatsSection'
import FeaturedProductsEditorial from '@/components/sections/FeaturedProductsEditorial'
import TransformationShowcase from '@/components/sections/TransformationShowcase'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import AboutTeaser from '@/components/sections/AboutTeaser'
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection'
import EditorialBlogPreview from '@/components/sections/EditorialBlogPreview'
import MediaFeaturesSection from '@/components/sections/MediaFeaturesSection'
import FooterCTABand from '@/components/sections/FooterCTABand'

export const metadata: Metadata = {
  title: 'Home',
  description:
    "Nairobi's premier organizing service — home, workplace, training and staffing solutions.",
}

export default function HomePage() {
  return (
    <main className="home-sections">
      <HeroSection />
      <ServicesStrip />
      <StatsSection />
      <FeaturedProductsEditorial />
      <TransformationShowcase />
      <TestimonialsSection />
      <AboutTeaser />
      <WhyChooseUsSection />
      <EditorialBlogPreview />
      <MediaFeaturesSection />
      <FooterCTABand />
    </main>
  )
}
