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
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log('session in landing page', session);
  return (
    <>
      <StructuredData />
      <div className="flex flex-col min-h-screen">
        <SiteHeader user={session?.user} />

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
          <div className="my-16 px-8 xl:max-w-6xl 2xl:max-w-8xl mx-auto">
            <p className="text-xs text-black">
              &copy; {new Date().getFullYear()} Intuipay Holding PTE. LTD. All rights reserved.
              <span>v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
