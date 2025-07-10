import StructuredData from '@/components/structured-data'
import PaymentDemo from '@/components/payment-demo'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="flex flex-col min-h-screen">
        <SiteHeader />

        {/* Main Content */}
         <main className="flex-1 max-w-7xl mx-auto px-12 md:px-10 py-8">
          <section className="xl:flex xl:items-center">
            <div className="xl:w-1/2 flex-none mb-12 xl:mb-0">
              <h1 className="sm:w-3/4 sm:min-w-107 text-3xl sm:text-6xl xl:text-5xl 2xl:text-6xl font-medium mb-6 text-nowrap">
                Where{' '}
                <span className="inline-flex items-center align-top w-25 relative me-1 md:me-3" aria-label="Flags">
                  <span className="size-7 md:size-11 text-base md:text-2xl border rounded-full flex justify-center items-center rotate-12 absolute z-50 top-2 left-0 bg-white">🇸🇬</span>
                  <span className="size-7 md:size-11 text-base md:text-2xl border rounded-full flex justify-center items-center rotate-12 absolute z-40 top-2 left-5 bg-white">🇺🇸</span>
                  <span className="size-7 md:size-11 text-base md:text-2xl border rounded-full flex justify-center items-center rotate-12 absolute z-30 top-2 left-10 bg-white">🇸🇦</span>
                  <span className="size-7 md:size-11 text-base md:text-2xl border rounded-full flex justify-center items-center rotate-12 absolute z-20 top-2 left-15 bg-white">🇵🇱</span>
                  <span className="size-7 md:size-11 text-base md:text-2xl border rounded-full flex justify-center items-center rotate-12 absolute z-10 top-2 left-20 bg-white">🇦🇺</span>
                </span>{' '}
                Global
                <br />
                Education Meets{' '}
                <span className="text-yellow-400" aria-hidden="true">
                  👋
                </span>
                <br />
                <span className="text-blue-500">Next-Gen Payments.</span>
              </h1>

              <p className="sm:w-3/4 sm:min-w-107 text-xl mb-16">
                Support global universities and pay tuition & make donation across borders — with speed, trust, and
                simplicity.
              </p>

              <div className="flex justify-start items-center gap-8">
                <button className="btn btn-neutral rounded-full text-xl font-semibold">
                  Get started
                </button>

                <div className="rounded-[100px] flex justify-center items-center py-4">
                  <div className="text-Black text-xl font-semibold underline">For organizations</div>
                </div>
              </div>
            </div>

            

            <div className="xl:w-1/2 flex-none bg-slate-50 px-8 py-13  md:rounded-2xl bg-[url(/images/sidebar-bg.svg)] bg-cover bg-center">
              <div className="w-81.5 sm:w-107 mx-auto  p-8 md:px-13 md:py-12 bg-white rounded-2xl shadow-md">
                <PaymentDemo />
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="py-32">
            <div className="flex flex-col justify-center items-center gap-6">
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <span className="text-Black text-3xl font-medium font-['Neue_Montreal']">Trust by </span>
                  <span className="text-blue-600 text-3xl font-medium font-['Neue_Montreal']">Institutions & Nonprofits</span>
                </div>
              </div>

              <div className="w-full max-w-[1614px] flex justify-center items-center gap-32 flex-wrap">
                <img src="/images/information/metamask.svg" alt="Partner Logo" />
                <img src="/images/information/paypal.svg" alt="Partner Logo" />
                <img src="/images/information/moonpay.svg" alt="Partner Logo" />
                <img src="/images/information/transak.svg" alt="Partner Logo" />
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="py-16">
            <div className="flex flex-col justify-center items-start gap-8">
              <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">Creating Exceptional Impact</div>
              <div className="text-black/50 text-xl font-normal font-['Inter']">
                Our mission is to help you reach your mission. Crypto, Stock, and Legacy Giving - now in one enterprise-ready donation platform.
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-16">
            <div className="">
              <div className="p-24 bg-violet-100 rounded-[32px] flex justify-start items-center gap-24">
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">9,000+</div>
                  <div className="text-black/50 text-xl font-normal font-['Inter']">World-Changing Organizations we serve</div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">$15,000</div>
                  <div className="text-black/50 text-xl font-normal font-['Inter']">Average donation size for our customers</div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">75x</div>
                  <div className="text-black/50 text-xl font-normal font-['Inter']">Higher than average ACH/debit/credit donation</div>
                </div>
              </div>
            </div>
          </section>

          {/* Widget Section */}
          <section className="py-16">
            <div className="flex justify-between items-center">
              <div className="w-[628px] flex flex-col justify-start items-start gap-8">
                <div className="flex flex-col justify-start items-start gap-6">
                  <div className="text-black text-6xl font-medium  capitalize">Widget</div>
                  <div className="text-black/50 text-xl font-normal ">
                    Powered by stables, Intuipay's product suite transforms how education gets funded
                  </div>
                </div>

                <div className="w-[600px] flex flex-col justify-start items-start gap-8">
                  {[
                    'Simple HTML iframe embedding set-up',
                    '30+ cryptocurrencies accepted',
                    'Automatic conversion to local fiat currencies'
                  ].map((feature, index) => (
                    <div key={index} className="flex flex-col justify-start items-start gap-6">
                      <div className="text-black/70 text-xl font-semibold ">{feature}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-neutral-100 rounded-2xl outline outline-2 outline-black/20 flex justify-center items-center">
                <img className="w-64 h-80 rounded-2xl" src="/images/information/widget.svg" alt="Widget Screenshot" />
              </div>
            </div>
          </section>

          {/* Marketplace Section */}
          <section className="py-16 -mx-12 md:-mx-10 px-12 md:px-10 bg-gray-50">
            <div className="flex flex-col justify-center items-start gap-16">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">Marketplace</div>
                <div className="text-black/50 text-xl font-normal font-['Inter']">
                  Powered by stables, Intuipay's product suite transforms how education gets funded
                </div>
              </div>

              <div className="w-full flex justify-center items-center gap-8 overflow-x-auto">
                {Array(8).fill(null).map((_, index) => (
                  <div key={index} className="min-w-64 p-4 bg-white rounded-xl outline outline-[0.50px] outline-black/20 flex flex-col justify-start items-start gap-4">
                    <div className="text-black text-base font-medium font-['Inter']">NeuroBridge</div>
                    <div className="opacity-60 text-black/50 text-xs font-medium font-['Inter']">
                      Bridging Brain Health and AI for Early Alzheimer's Detection
                    </div>
                    <div className="flex justify-start items-center gap-2.5">
                      <img className="w-6 h-6 rounded-full" src="https://placehold.co/26x26" alt="University Logo" />
                      <div className="flex-1 text-black text-xs font-medium font-['Inter']">Emory University</div>
                    </div>
                    <div className="h-[0.80px] bg-zinc-300" />
                    <div className="w-full flex justify-between items-center">
                      <div className="opacity-60 text-black text-xs font-medium font-['Inter']">Total Raised</div>
                      <div className="text-black text-xl font-medium font-['Inter']">$ 123,4567.00</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dashboard Section */}
          <section className="py-16">
            <div className="flex flex-col justify-center items-start gap-16">
              <div className="flex flex-col justify-start items-center gap-6 w-full">
                <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">Organization dashboard</div>
                <div className="text-black/50 text-xl font-normal font-['Inter']">
                  Powered by stables, Intuipay's product suite transforms how education gets funded
                </div>
              </div>

              <div className="w-full px-32 py-16 bg-neutral-50 rounded-3xl flex flex-col justify-start items-start gap-6">
                <div className="w-full px-8 py-6 bg-white rounded-2xl outline outline-2 outline-black/10 flex justify-between items-start">
                  <div className="w-64 flex flex-col justify-start items-start gap-3">
                    <div className="text-Black text-sm font-semibold font-['Inter']">Balance</div>
                    <div className="text-Black text-3xl font-semibold font-['Inter']">$12,345.00</div>
                    <div className="text-black/60 text-sm font-semibold font-['Inter']">
                      The next withdraw period: 07/05/2024
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="text-blue-600 text-sm font-semibold font-['Inter']">How it works</div>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <div className="text-Black text-sm font-semibold font-['Inter']">Withdraw History</div>
                    </div>
                  </div>
                </div>

                <div className="w-full rounded-2xl flex justify-start items-center gap-4">
                  {[
                    { amount: '$1,234.00', label: 'Total received this month', color: 'bg-red-500' },
                    { amount: '$1,234.00', label: 'Total donated this month', color: 'bg-lime-500' },
                    { amount: '$1,234.00', label: 'Processing received', color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex-1 p-6 bg-white rounded-2xl outline outline-2 outline-black/10 flex flex-col justify-start items-start gap-4">
                      <div className="text-Black text-2xl font-semibold font-['Inter']">{item.amount}</div>
                      <div className="flex justify-start items-center gap-1">
                        <div className={`w-2 h-2 ${item.color} rounded-full`} />
                        <div className="flex-1 text-black/70 text-sm font-semibold font-['Inter']">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-16">
            <div className="flex justify-start items-start gap-24">
              <div className="flex-1 text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">Testimonial</div>
              <div className="flex-1 flex flex-col justify-start items-start gap-8">
                <div className="text-black/50 text-xl font-normal font-['Inter']">
                  "Engiven has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Engiven's features into our website and customize it to our brand standards."
                </div>
                <div className="text-black/70 text-xl font-semibold font-['Inter']">Name / logo</div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-violet-100 rounded-tl-[64px] rounded-tr-[64px] -mx-12 md:-mx-10">
            <div className="px-12 md:px-10 py-16 flex flex-col justify-start items-center gap-16">
              <div className="flex flex-col justify-start items-center gap-6">
                <div className="text-Black text-6xl font-medium font-['Neue_Montreal'] capitalize">Simplify Complex Giving</div>
                <div className="text-black/70 text-xl font-normal font-['Inter']">
                  Powered by stables, Intuipay's product suite transforms how education gets funded
                </div>
              </div>
              <button className="btn btn-neutral rounded-full text-xl font-semibold">Book a demo</button>
             </div>
           </section>

        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    </>
  )
}
