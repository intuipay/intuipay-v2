import StructuredData from '@/components/structured-data'
import PaymentDemo from '@/components/payment-demo'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
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

        <main className="flex-1">
          {/* Hero Section */}
          <section className="xl:py-16 xl:px-16 2xl:px-20">
            <div className="bg-brand-blue xl:rounded-3xl p-6 md:p-10 xl:p-16 2xl:p-20">
              <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center xl:gap-16 gap-12">
                <div className="xl:w-1/2 flex-none">
                  <h1 className="text-3xl sm:text-5xl xl:text-4xl 2xl:text-5xl font-medium mb-6 leading-tight">
                    Where{' '}
                    <span className="inline-flex items-center align-top w-20 relative me-2" aria-label="Flags">
                      <span className="size-6 md:size-8 text-sm md:text-lg border rounded-full flex justify-center items-center absolute z-40 top-0 left-0 bg-white">🇸🇬</span>
                      <span className="size-6 md:size-8 text-sm md:text-lg border rounded-full flex justify-center items-center absolute z-30 top-0 left-3 bg-white">🇺🇸</span>
                      <span className="size-6 md:size-8 text-sm md:text-lg border rounded-full flex justify-center items-center absolute z-20 top-0 left-6 bg-white">🇸🇦</span>
                      <span className="size-6 md:size-8 text-sm md:text-lg border rounded-full flex justify-center items-center absolute z-10 top-0 left-9 bg-white">🇵🇱</span>
                      <span className="size-6 md:size-8 text-sm md:text-lg border rounded-full flex justify-center items-center absolute z-0 top-0 left-12 bg-white">🇦🇺</span>
                    </span>{' '}
                    Global
                    <br />
                    Education Meets{' '}
                    <span className="text-red-500" aria-hidden="true">
                      ❤️
                    </span>
                    <br />
                    <span className="text-blue-500">The Future Of Giving</span>
                  </h1>

                  <p className="text-lg mb-8 text-gray-600 max-w-md">
                    Accept borderless donations and connect with donors who support education, research, and innovation.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-start items-center sm:items-center gap-4 sm:gap-8">
                    <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto">
                      Get started
                    </button>

                    <button className="text-black text-lg font-medium underline hover:no-underline transition-all">
                      I want to fund my project
                    </button>
                  </div>
                </div>

                <div className="xl:w-1/2 flex-none px-6">
                  <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <PaymentDemo />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <TrustSection />

          {/* Impact Section */}
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <ImpactSection />
          </div>

          {/* Widget Section */}
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <WidgetSection />
          </div>

          {/* Showcase Section */}
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <ShowcaseSection />
          </div>

          {/* Dashboard Section */}
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <DashboardSection />
          </div>

          {/* Testimonial Section */}
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <TestimonialSection />
          </div>

          {/* CTA Section */}
          <CtaSection />

          {/* Footer Section */}
          <FooterLinksSection />

        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    </>
  )
}
