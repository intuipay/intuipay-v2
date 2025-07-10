import Image from 'next/image'
import PaymentCalculator from '@/components/payment-calculator'
import WaitlistForm from '@/components/waitlist-form'
import StructuredData from '@/components/structured-data'
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="relative bg-white min-h-screen">
        {/* Header */}
        <header className="w-full py-6 absolute top-0 left-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-between items-center">
              <div className="flex items-center">
                <Image
                  src="/images/intuipay-logo.svg"
                  alt="Intuipay"
                  width={122}
                  height={24}
                  className="h-5 sm:h-6 w-auto"
                  priority
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="px-2 py-1 rounded-lg flex justify-center items-center">
                  <div className="flex flex-col justify-center items-start">
                    <div className="text-blue-600 text-base font-bold  capitalize tracking-tight">Donate</div>
                    <div className="h-0 outline outline-[1.50px] outline-blue-600" />
                  </div>
                </div>
                <div className="px-2 py-1 rounded-lg flex justify-center items-center">
                  <div className="text-black/70 text-base font-medium  capitalize tracking-tight">Pay</div>
                </div>
                <div className="px-2 py-1 rounded-lg flex justify-center items-center">
                  <div className="text-black/70 text-base font-medium  capitalize tracking-tight">About</div>
                </div>
                <div className="px-2 py-1 rounded-lg flex justify-center items-center">
                  <div className="text-black/70 text-base font-medium  capitalize tracking-tight">Support</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg flex justify-center items-center gap-2">
                  <div className="text-Black text-base font-medium ">EN</div>
                  <div className="w-4 h-4 relative">
                    <div className="w-3 h-1.5 left-[3.38px] top-[6.75px] absolute outline outline-1 outline-Black" />
                  </div>
                </div>
                <div className="px-6 py-2 bg-Black rounded-[32px] flex justify-center items-center">
                  <div className="text-white text-base font-medium ">Get started</div>
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <section className="py-32 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-start items-center gap-24">
              <div className="flex-1 flex flex-col justify-start items-start gap-16">
                <div className="flex flex-col justify-start items-start gap-8">
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

                  <p className="text-xl mb-16">
                    Support global universities and pay tuition & make donation across borders — with speed, trust, and
                    simplicity.
                  </p>
                </div>

                <div className="flex justify-start items-center gap-8">
                  <button className="btn btn-neutral rounded-full text-xl font-semibold">
                    Get started
                  </button>

                  <div className="rounded-[100px] flex justify-center items-center py-4">
                    <div className="text-Black text-xl font-semibold underline">For organizations</div>
                  </div>
                </div>
              </div>

              {/* Payment Calculator Widget */}
              <div className="px-10 py-16 bg-white rounded-[20px] shadow-[0px_3px_8px_0px_rgba(40,48,62,0.02)] shadow-[0px_14px_14px_0px_rgba(40,48,62,0.02)] shadow-[0px_31px_19px_0px_rgba(40,48,62,0.02)] shadow-[0px_55px_22px_0px_rgba(40,48,62,0.01)] shadow-[0px_87px_24px_0px_rgba(40,48,62,0.00)] outline outline-1 outline-black/5 flex flex-col justify-start items-center gap-12">
                <div className="flex flex-col justify-start items-start gap-12">
                  <div className="flex flex-col justify-start items-center gap-6">
                    <div className="text-Black text-xl font-semibold ">Make your donation today</div>

                    <div className="flex justify-start items-center gap-5">
                      <div className="flex-1 px-4 py-3 bg-indigo-100 rounded-lg outline outline-1 outline-blue-600 flex justify-start items-center gap-3">
                        <div className="w-7 h-7 bg-white rounded-full" />
                        <div className="w-4 h-4 relative">
                          <div className="w-3 h-2.5 left-[1.50px] top-[3px] absolute bg-blue-600" />
                        </div>
                        <div className="text-blue-600 text-base font-semibold ">Crypto</div>
                      </div>
                      <div className="flex-1 px-4 py-3 bg-neutral-100 rounded-lg flex justify-start items-center gap-3">
                        <div className="w-7 h-7 bg-white rounded-full" />
                        <div className="w-4 h-4 relative">
                          <div className="w-3.5 h-2.5 left-[0.50px] top-[3px] absolute bg-Black" />
                        </div>
                        <div className="text-Black text-base font-semibold ">Cash</div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-2">
                      <div className="text-black/50 text-sm font-semibold ">Donate with</div>
                      <div className="px-4 py-3 bg-white rounded-lg outline outline-1 outline-black/10 flex justify-between items-center">
                        <div className="flex justify-start items-center gap-3">
                          <img className="w-6 h-6" src="https://placehold.co/24x24" alt="USDC Icon" />
                          <div className="text-Black text-sm font-semibold ">USDC</div>
                        </div>
                        <div className="w-4 h-4 relative">
                          <div className="w-2.5 h-[5px] left-[3px] top-[6px] absolute outline outline-1 outline-zinc-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-2">
                      <div className="text-black/50 text-sm font-semibold ">Amount</div>
                      <div className="px-4 py-3 bg-white rounded-lg outline outline-1 outline-black/10 flex justify-start items-center gap-3">
                        <div className="flex-1 text-black/50 text-sm font-semibold ">1.0</div>
                        <div className="flex justify-start items-center gap-1">
                          <div className="text-Black text-sm font-semibold ">USDC</div>
                          <div className="text-Black text-sm font-semibold ">≈</div>
                          <div className="text-Black text-sm font-semibold ">$</div>
                        </div>
                        <div className="flex-1 text-black/50 text-sm font-semibold ">1.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-6">
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <span className="text-Black text-3xl font-medium ">Trust by </span>
                  <span className="text-blue-600 text-3xl font-medium ">Institutions & Nonprofits</span>
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start gap-8">
              <div className="text-black text-6xl font-medium  capitalize">Creating Exceptional Impact</div>
              <div className="text-black/50 text-xl font-normal ">
                Our mission is to help you reach your mission. Crypto, Stock, and Legacy Giving - now in one enterprise-ready donation platform. Sign up today and raise more money to impact more lives.
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-24 bg-violet-100 rounded-[32px] flex justify-start items-center gap-24">
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium  capitalize">9,000+</div>
                  <div className="text-black/50 text-xl font-normal ">World-Changing Organizations we serve</div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium  capitalize">$15,000</div>
                  <div className="text-black/50 text-xl font-normal ">Average donation size for our customers</div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium  capitalize">75x</div>
                  <div className="text-black/50 text-xl font-normal ">Higher than average ACH/debit/credit donation</div>
                </div>
              </div>
            </div>
          </section>

          {/* Widget Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
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
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start gap-16">
              <div className="flex flex-col justify-start items-start gap-6">
                <div className="text-black text-6xl font-medium  capitalize">Marketplace</div>
                <div className="text-black/50 text-xl font-normal ">
                  Powered by stables, Intuipay's product suite transforms how education gets funded
                </div>
              </div>

              <div className="w-full flex justify-center items-center gap-8 overflow-x-auto">
                {Array(8).fill(null).map((_, index) => (
                  <div key={index} className="min-w-64 p-4 bg-white rounded-xl outline outline-[0.50px] outline-black/20 flex flex-col justify-start items-start gap-4">
                    <div className="text-black text-base font-medium ">NeuroBridge</div>
                    <div className="opacity-60 text-black/50 text-xs font-medium ">
                      Bridging Brain Health and AI for Early Alzheimer's Detection
                    </div>
                    <div className="flex justify-start items-center gap-2.5">
                      <img className="w-6 h-6 rounded-full" src="https://placehold.co/26x26" alt="University Logo" />
                      <div className="flex-1 text-black text-xs font-medium ">Emory University</div>
                    </div>
                    <div className="h-[0.80px] bg-zinc-300" />
                    <div className="w-full flex justify-between items-center">
                      <div className="opacity-60 text-black text-xs font-medium ">Total Raised</div>
                      <div className="text-black text-xl font-medium ">$ 123,4567.00</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dashboard Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start gap-16">
              <div className="flex flex-col justify-start items-center gap-6 w-full">
                <div className="text-black text-6xl font-medium  capitalize">Organization dashboard</div>
                <div className="text-black/50 text-xl font-normal ">
                  Powered by stables, Intuipay's product suite transforms how education gets funded
                </div>
              </div>

              <div className="w-full px-32 py-16 bg-neutral-50 rounded-3xl flex flex-col justify-start items-start gap-6">
                <div className="w-full px-8 py-6 bg-white rounded-2xl outline outline-2 outline-black/10 flex justify-between items-start">
                  <div className="w-64 flex flex-col justify-start items-start gap-3">
                    <div className="text-Black text-sm font-semibold ">Balance</div>
                    <div className="text-Black text-3xl font-semibold ">$12,345.00</div>
                    <div className="text-black/60 text-sm font-semibold ">
                      The next withdraw period: 07/05/2024
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <div className="text-blue-600 text-sm font-semibold ">How it works</div>
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <div className="text-Black text-sm font-semibold ">Withdraw History</div>
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
                      <div className="text-Black text-2xl font-semibold ">{item.amount}</div>
                      <div className="flex justify-start items-center gap-1">
                        <div className={`w-2 h-2 ${item.color} rounded-full`} />
                        <div className="flex-1 text-black/70 text-sm font-semibold ">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-start items-start gap-24">
              <div className="flex-1 text-black text-6xl font-medium  capitalize">Testimonial</div>
              <div className="flex-1 flex flex-col justify-start items-start gap-8">
                <div className="text-black/50 text-xl font-normal ">
                  "Engiven has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Engiven's features into our website and customize it to our brand standards."
                </div>
                <div className="text-black/70 text-xl font-semibold ">Name / logo</div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-violet-100 rounded-tl-[64px] rounded-tr-[64px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-start items-center gap-16">
              <div className="flex flex-col justify-start items-center gap-6">
                <div className="text-Black text-6xl font-medium  capitalize">Simplify Complex Giving</div>
                <div className="text-black/70 text-xl font-normal ">
                  Powered by stables, Intuipay's product suite transforms how education gets funded
                </div>
              </div>
              <button className="btn btn-neutral rounded-full text-xl font-semibold">
                Book a demo
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-violet-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="pt-8 border-t border-black/10 flex justify-between items-center">
              <div className="text-black/40 text-sm font-normal ">© 2025 IntuiPay. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
