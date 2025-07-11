import StructuredData from '@/components/structured-data'
import PaymentDemo from '@/components/payment-demo'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card'; // Changed to named import
import { ProjectInfo } from '@/types';
import { AnimatedCounter } from '@/components/animated-counter';
import TrustSection from '@/components/trust-section';

export default async function Home() {
  const projects = await getProjects(1, 8, '', 'id', 'desc');

  return (
    <>
      <StructuredData />
      <div className="flex flex-col min-h-screen">
        <SiteHeader />

        {/* Hero Section */}
         <main className="flex-1">
          <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-6 md:px-10">
            <div className="max-w-7xl mx-auto xl:flex xl:items-center xl:gap-16">
            <div className="xl:w-1/2 flex-none mb-12 xl:mb-0">
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

              <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 sm:gap-8">
                <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors">
                  Get started
                </button>

                <button className="text-black text-lg font-medium underline hover:no-underline transition-all">
                  I want to fund my project
                </button>
              </div>
            </div>

            

            <div className="xl:w-1/2 flex-none px-6 py-12">
              <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                <PaymentDemo />
              </div>
            </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">

          {/* Trust Section */}
          <TrustSection />

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
                  <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">
                    <AnimatedCounter 
                      end={9000} 
                      suffix="+" 
                      className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize"
                    />
                  </div>
                  <div className="text-black/50 text-xl font-normal font-['Inter']">World-Changing Organizations we serve</div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">
                    <AnimatedCounter 
                      end={15000} 
                      prefix="$" 
                      className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize"
                    />
                  </div>
                  <div className="text-black/50 text-xl font-normal font-['Inter']">Average donation size for our customers</div>
                </div>
                <div className="flex-1 flex flex-col justify-start items-start gap-8">
                  <div className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize">
                    <AnimatedCounter 
                      end={75} 
                      suffix="x" 
                      className="text-black text-6xl font-medium font-['Neue_Montreal'] capitalize"
                    />
                  </div>
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
                {projects.map((project: ProjectInfo) => (
                  <ProjectCard key={project.id} project={project} />
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
                    <div className="text-Black text-3xl font-semibold font-['Inter']">
                      <AnimatedCounter 
                        end={12345} 
                        prefix="$" 
                        suffix=".00"
                        className="text-Black text-3xl font-semibold font-['Inter']"
                      />
                    </div>
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
                    { amount: 1234, label: 'Total received this month', color: 'bg-red-500' },
                    { amount: 1234, label: 'Total donated this month', color: 'bg-lime-500' },
                    { amount: 1234, label: 'Processing received', color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex-1 p-6 bg-white rounded-2xl outline outline-2 outline-black/10 flex flex-col justify-start items-start gap-4">
                      <div className="text-Black text-2xl font-semibold font-['Inter']">
                        <AnimatedCounter 
                          end={item.amount} 
                          prefix="$" 
                          suffix=".00"
                          className="text-Black text-2xl font-semibold font-['Inter']"
                          duration={1800}
                        />
                      </div>
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
          </div>

        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    </>
  )
}
