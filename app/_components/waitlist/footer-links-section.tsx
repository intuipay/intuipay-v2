import Link from 'next/link';

export default function FooterLinksSection() {
  return (
    <section className="bg-brand-blue-100 w-screen ms-rest">
      <div className="px-8 xl:max-w-6xl 2xl:max-w-8xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {/* Left Column on Mobile - Product */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-sm font-semibold leading-tight">
              Product
            </div>
            <div className="flex flex-col gap-2">
              <Link className="text-black/70 text-sm font-normal leading-tight" href="/projects">
                Crowdfunding
              </Link>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Payment
              </div>
            </div>
          </div>

          {/* Right Column on Mobile - For organizations */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-sm font-semibold leading-tight">
              For organizations
            </div>
            <div className="flex flex-col gap-2">
              <Link className="text-black/70 text-sm font-normal leading-tight" href="https://calendly.com/harry-intuipay/30min">
                Book a demo
              </Link>
              <Link className="text-black/70 text-sm font-normal leading-tight" href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/login`}>
                Sign in
              </Link>
            </div>
          </div>

          {/* Left Column on Mobile - Resources */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-sm font-semibold leading-tight">
              Resources
            </div>
            <div className="flex flex-col gap-2">
              <Link className="text-black/70 text-sm font-normal leading-tight" href="/updates">
                Blog
              </Link>
              <Link className="text-black/70 text-sm font-normal leading-tight" href="/help">
                Help Center
              </Link>
              <Link className="text-black/70 text-sm font-normal leading-tight" href="/knowledge">
                Knowledge Space
              </Link>
              <Link className="text-black/70 text-sm font-normal leading-tight" href="/legal">
                Legal
              </Link>
            </div>
          </div>

          {/* Right Column on Mobile - Social */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-sm font-semibold leading-tight">
              Social
            </div>
            <div className="flex flex-col gap-2">
              <Link className="text-black/70 text-sm font-normal leading-tight" href="https://x.com/intuipay">
                X
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
