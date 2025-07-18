import StructuredData from '@/components/structured-data'
import { SiteHeader } from '@/components/site-header'
import HeroSection from '@/app/_components/waitlist/hero-section';
import TrustSection from '@/app/_components/waitlist/trust-section';
import ImpactSection from '@/app/_components/waitlist/impact-section';
import WidgetSection from '@/app/_components/waitlist/widget-section';
import ShowcaseSection from '@/app/_components/waitlist/showcase-section';
import DashboardSection from '@/app/_components/waitlist/dashboard-section';
import TestimonialSection from '@/app/_components/waitlist/testimonial-section';
import CtaSection from '@/app/_components/waitlist/cta-section';
import FooterLinksSection from '@/app/_components/waitlist/footer-links-section';

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="flex flex-col min-h-screen">
        <SiteHeader />

        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Trust Section */}
          <TrustSection />

          {/* Impact Section */}
          <ImpactSection />

          {/* Widget Section */}
          <WidgetSection />

          {/* Showcase Section */}
          <ShowcaseSection />

          {/* Dashboard Section */}
          <DashboardSection />

          {/* Testimonial Section */}
          <TestimonialSection />

          {/* CTA Section */}
          <CtaSection />

          {/* Footer Section */}
          <FooterLinksSection />

        </main>

        {/* Footer */}
        <footer className="bg-brand-blue">
          <div className="mb-16 max-w-7xl mx-auto">
            <p className="text-xs text-neutral-darkgray mb-4 md:mb-0 text-[#737373] mt-8">
              &copy; {new Date().getFullYear()} Intuipay Holding PTE. LTD. All rights reserved.
              <span className="text-neutral-darkgray ms-2">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
