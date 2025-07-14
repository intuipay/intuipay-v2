import { GraduationCapIcon, ArrowsDownUpIcon, MagnifyingGlassIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr';

export default function ShowcaseSection() {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="flex flex-col gap-8 md:gap-16">
        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-center">
          {/* Project Demo - First on mobile, Right on desktop */}
          <div className="order-1 lg:order-2 flex-1 bg-[#fff8e8] rounded-[32px] h-[396px] lg:h-[585px] flex items-center justify-center p-4 lg:p-8 overflow-hidden">
            <div className="w-full flex flex-col gap-4 lg:gap-8">
              {/* Top Card */}
              <div className="bg-[#ffefc1] rounded-3xl lg:h-[148px] w-full"></div>

              {/* Main Project Card */}
              <div className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] p-4 lg:p-8">
                <div className="flex flex-col gap-3 lg:gap-6">
                  {/* Project Info */}
                  <div className="flex flex-col gap-2 lg:gap-3">
                    <div className="text-black text-sm lg:text-base font-semibold leading-6">
                      NeuroBridge
                    </div>
                    <div className="text-black text-sm lg:text-base font-semibold leading-6">
                      Bridging Brain Health and AI for Early Alzheimer's Detection
                    </div>
                  </div>

                  {/* Verification */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <img
                        src="/images/verified.gif"
                        alt="Widget Demo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-black text-lg lg:text-2xl font-semibold leading-8">
                      Verified by universities
                    </div>
                  </div>

                  {/* Total Raised */}
                  <div className="flex justify-between items-center">
                    <div className="text-black text-sm lg:text-base font-semibold leading-6">
                      Total Raised
                    </div>
                    <div className="text-black text-sm lg:text-base font-semibold leading-6">
                      $ 123,456.00
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card */}
              <div className="bg-[#ffefc1] rounded-3xl lg:h-[168px] w-full"></div>
            </div>
          </div>

          {/* Text Content - Second on mobile, Left on desktop */}
          <div className="order-2 lg:order-1 flex-1 lg:h-[585px] flex flex-col justify-center">
            <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="text-[#2461f2] text-sm lg:text-base font-medium font-['Neue_Montreal'] capitalize tracking-[0.64px]">
                Reach A Global Community
              </div>
              <div className="text-black text-[28px] lg:text-[56px] font-medium font-['Neue_Montreal'] capitalize leading-normal">
                Showcase Your Projects To Crypto Donors
              </div>
              <div className="text-black/50 text-sm lg:text-base font-normal leading-6">
                Get discovered by donors around the world who want to directly support impactful research and education.
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 border border-black/70 rounded-full w-fit">
              <span className="text-black/70 text-lg lg:text-xl font-semibold leading-6">
                Explore Marketplace
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
            <GraduationCapIcon size={32} />
            <div className="text-black/70 text-sm md:text-base font-normal leading-6">
              Verified projects from universities and researchers in 20+ countries
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            <ArrowsDownUpIcon size={32} />
            <div className="text-black/70 text-sm md:text-base font-normal leading-6">
              Transparent donation tracking
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            <MagnifyingGlassIcon size={32} />
            <div className="text-black/70 text-sm md:text-base font-normal leading-6">
              Direct support to institutions or specific researchers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
