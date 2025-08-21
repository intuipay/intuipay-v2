export default function FooterLinksSection() {
  return (
    <section className="bg-brand-blue w-screen ms-rest">
      <div className="px-8 xl:max-w-6xl 2xl:max-w-8xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {/* Left Column on Mobile - Product */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-sm font-semibold leading-tight">
              Product
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-black/70 text-sm font-normal leading-tight">
                Donation
              </div>
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
              <div className="text-black/70 text-sm font-normal leading-tight">
                Book a demo
              </div>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Sign in
              </div>
            </div>
          </div>

          {/* Left Column on Mobile - Resources */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-sm font-semibold leading-tight">
              Resources
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-black/70 text-sm font-normal leading-tight">
                Blog
              </div>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Help Center
              </div>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Knowledge Space
              </div>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Legal
              </div>
            </div>
          </div>

          {/* Right Column on Mobile - Social */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-sm font-semibold leading-tight">
              Social
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-black/70 text-sm font-normal leading-tight">
                X
              </div>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Facebook
              </div>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Instagram
              </div>
              <div className="text-black/70 text-sm font-normal leading-tight">
                Linkedin
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
