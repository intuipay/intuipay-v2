export default function ImpactSection() {
  return (
    <section className="px-8 py-12 md:px-12 md:py-20 lg:px-16 lg:py-28 xl:p-28 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-12 md:gap-24">
        <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
          <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize text-center">
            Creating Exceptional Impact
          </div>
          <div className="text-black/50 text-sm md:text-base font-normal text-center leading-normal">
            Our mission is to help you reach your mission. Crypto, Stock, and Legacy Giving - now in one enterprise-ready donation platform. Sign up today and raise more money to impact more lives.
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="flex-1 bg-neutral-100 rounded-[32px] p-6 md:p-12">
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">
                70%
              </div>
              <div className="text-black/50 text-sm md:text-base font-normal leading-normal">
                of Forbes' top 100 charities accept crypto donations
              </div>
            </div>
          </div>

          <div className="flex-1 bg-neutral-100 rounded-[32px] p-6 md:p-12">
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">
                600Mn
              </div>
              <div className="text-black/50 text-sm md:text-base font-normal leading-normal">
                crypto users worldwide
              </div>
            </div>
          </div>

          <div className="flex-1 bg-neutral-100 rounded-[32px] p-6 md:p-12">
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">
                $2.5B
              </div>
              <div className="text-black/50 text-sm md:text-base font-normal leading-normal">
                crypto giving expected in 2025 with growing trends
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
