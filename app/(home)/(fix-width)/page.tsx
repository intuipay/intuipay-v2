import StructuredData from '@/components/structured-data'
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

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Section */}
      <TrustSection />

      {/* Impact Section */}
      <ImpactSection />

      {/* Showcase Section */}
      <ShowcaseSection />

      {/* Widget Section */}
      <WidgetSection />

      {/* Dashboard Section */}
      <DashboardSection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* CTA Section */}
      <CtaSection />
      {/* Footer Section */}
      <FooterLinksSection />
    </>
  )
}
