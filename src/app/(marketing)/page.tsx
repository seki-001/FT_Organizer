import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import HomeTrustStrip from '@/components/sections/home/HomeTrustStrip'
import HomeServicesOverview from '@/components/sections/home/HomeServicesOverview'
import HomeRelocationHighlight from '@/components/sections/home/HomeRelocationHighlight'
import HomeHowItWorks from '@/components/sections/home/HomeHowItWorks'
import HomeSiteVisitExplainer from '@/components/sections/home/HomeSiteVisitExplainer'
import HomePortfolioPreview from '@/components/sections/home/HomePortfolioPreview'
import FeaturedProductsEditorial from '@/components/sections/FeaturedProductsEditorial'
import HomeLoyaltyTeaser from '@/components/sections/home/HomeLoyaltyTeaser'
import HomeFollowUpTeaser from '@/components/sections/home/HomeFollowUpTeaser'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/ui/CTASection'

export const metadata: Metadata = {
  title: 'Home | Faith The Organizer',
  description:
    'Faith The Organizer — From Clutter to Order. Premium organizing across East Africa. Book a site visit (KSh 3,000), explore nine services, shop storage products, and see our portfolio.',
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HomeTrustStrip />
      <HomeServicesOverview />
      <HomeRelocationHighlight />
      <HomeHowItWorks />
      <HomeSiteVisitExplainer />
      <HomePortfolioPreview />
      <FeaturedProductsEditorial />
      <HomeLoyaltyTeaser />
      <HomeFollowUpTeaser />
      <TestimonialsSection />
      <CTASection
        variant="cream"
        title="Ready for calm, functional spaces?"
        description="Book a site visit across East Africa. We assess your space, share a clear plan, and help you move from clutter to order."
        primaryLabel="Book Site Visit"
        primaryHref="/book"
        secondaryLabel="Explore Services"
        secondaryHref="/services"
      />
    </main>
  )
}
