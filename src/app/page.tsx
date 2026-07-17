import { Hero } from "@/components/landing/hero"
import { QuickFilters } from "@/components/landing/quick-filters"
import { Categories } from "@/components/landing/categories"
import { FeaturedProperties } from "@/components/landing/featured-properties"
import { PopularLocations } from "@/components/landing/popular-locations"
import { AISection } from "@/components/landing/ai-section"
import { WhyInzuLink } from "@/components/landing/why-inzulink"
import { Statistics } from "@/components/landing/statistics"
import { Testimonials } from "@/components/landing/testimonials"
import { DownloadApp } from "@/components/landing/download-app"
import { CTA } from "@/components/landing/cta"
import { FAQ } from "@/components/landing/faq"

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickFilters />
      <Categories />
      <FeaturedProperties />
      <PopularLocations />
      <AISection />
      <WhyInzuLink />
      <Statistics />
      <Testimonials />
      <DownloadApp />
      <CTA />
      <FAQ />
    </>
  )
}
