import { CodeIcon, CoinsIcon, GlobeIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr';

export default function WidgetSection() {
  return (
    <section className="px-8 py-12 md:px-12 md:py-20 lg:px-16 lg:py-28 xl:p-28 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8 md:gap-16">
        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Widget Demo - First on mobile, Right on desktop */}
          <div className="order-1 lg:order-2 flex-1 bg-lime-50 rounded-[32px] h-60 lg:h-[585px] flex items-center justify-center p-4 lg:p-8">
            <div className="w-full aspect-[1240/824] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden">
              <video
                src="/images/mockup_light.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Text Content - Second on mobile, Left on desktop */}
          <div className="order-2 lg:order-1 flex-1 flex flex-col justify-center">
            <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="text-[#2461f2] text-sm lg:text-base font-medium font-['Neue_Montreal'] capitalize tracking-[0.64px]">
                Accept Crypto with Ease
              </div>
              <div className="text-black text-[28px] lg:text-[56px] font-medium font-['Neue_Montreal'] capitalize leading-normal">
                Plug-and-Play Donation Widget
              </div>
              <div className="text-black/50 text-sm lg:text-base font-normal leading-6">
                Seamlessly embed crypto giving into your website in minutes — no developers required.
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 border border-black/70 rounded-full w-fit">
              <span className="text-black/70 text-lg lg:text-xl font-semibold leading-6">
                See how it works
              </span>
              <ArrowUpRightIcon size={24} />
            </button>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-gray-200"></div>

        {/* Features Row */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-24">
          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            <CodeIcon size={32} />
            <div className="text-black/70 text-sm md:text-base font-normal leading-6">
              Simple HTML iframe embedding set-up
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            <CoinsIcon size={32} />
            <div className="text-black/70 text-sm md:text-base font-normal leading-6">
              30+ cryptocurrencies accepted
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            <GlobeIcon size={32} />
            <div className="text-black/70 text-sm md:text-base font-normal leading-6">
              Automatic conversion to local fiat currencies
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
