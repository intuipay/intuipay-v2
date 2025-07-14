export default function FooterLinksSection() {
  return (
    <section className="bg-brand-blue">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-[120px] py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {/* Left Column on Mobile - Product */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-[14px] font-semibold leading-5">
              Product
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Donation
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Payment
              </div>
            </div>
          </div>

          {/* Right Column on Mobile - For organizations */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-[14px] font-semibold leading-5">
              For organizations
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Book a demo
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Sign in
              </div>
            </div>
          </div>

          {/* Left Column on Mobile - Resources */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-[14px] font-semibold leading-5">
              Resources
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Blog
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Help Center
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Knowledge Space
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Legal
              </div>
            </div>
          </div>

          {/* Right Column on Mobile - Social */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-black text-[14px] font-semibold leading-5">
              Social
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-black/70 text-[14px] font-normal leading-5">
                X
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Facebook
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Instagram
              </div>
              <div className="text-black/70 text-[14px] font-normal leading-5">
                Linkedin
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
