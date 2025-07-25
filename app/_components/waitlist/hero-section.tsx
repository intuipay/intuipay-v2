import PaymentDemo from '@/components/payment-demo'

export default function HeroSection() {
  return (
    <section className="xl:py-16 xl:px-16 2xl:px-20">
      <div className="bg-brand-blue xl:rounded-3xl p-6 md:p-10 xl:p-16 2xl:p-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-16 gap-12">
          <div className="lg:w-1/2 flex-none">
            <h1 className="text-3xl md:text-6xl font-medium font-neue-montreal mb-6 leading-tight">
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
              <span className="text-blue-600">The Future Of Giving</span>
            </h1>

            <p className="text-base mb-8 md:mb-12 lg:mb-16 text-black/50 max-w-md">
              Accept borderless donations and connect with donors who support education, research, and innovation.
            </p>

            <div className="flex flex-col sm:flex-row justify-start items-center sm:items-center gap-4 sm:gap-8">
              <button className="bg-black text-white px-8 py-3 rounded-full text-base md:text-xl font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto">
                Get started
              </button>

              <button className="text-black text-base md:text-xl font-medium underline hover:no-underline transition-all">
                I want to fund my project
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 flex-none">
            <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <PaymentDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
