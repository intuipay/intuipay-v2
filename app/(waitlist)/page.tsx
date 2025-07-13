import StructuredData from '@/components/structured-data'
import PaymentDemo from '@/components/payment-demo'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getProjects } from '@/lib/data';
import { AnimatedCounter } from '@/components/animated-counter';
import TrustSection from '@/components/trust-section';
import { CodeIcon, CoinsIcon, GlobeIcon, GraduationCapIcon, ArrowsDownUpIcon, MagnifyingGlassIcon, MoneyIcon, ReceiptIcon, FilesIcon } from '@phosphor-icons/react/ssr';

export default async function Home() {
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
          <section className="py-[120px]">
            <div className="flex flex-col items-center gap-24">
              <div className="flex flex-col items-center gap-8 w-full">
                <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize text-center">
                  Creating Exceptional Impact
                </div>
                <div className="text-black/50 text-base font-normal font-['Inter'] text-center max-w-4xl leading-6">
                  Our mission is to help you reach your mission. Crypto, Stock, and Legacy Giving - now in one enterprise-ready donation platform. Sign up today and raise more money to impact more lives.
                </div>
              </div>
              
              <div className="flex flex-row gap-8 w-full">
                <div className="flex-1 bg-[#f5f5f7] rounded-[32px] p-12">
                  <div className="flex flex-col gap-8">
                    <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize">
                      70%
                    </div>
                    <div className="text-black/50 text-base font-normal font-['Inter'] leading-6">
                      of Forbes' top 100 charities accept crypto donations
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 bg-[#f5f5f7] rounded-[32px] p-12">
                  <div className="flex flex-col gap-8">
                    <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize">
                      600Mn
                    </div>
                    <div className="text-black/50 text-base font-normal font-['Inter'] leading-6">
                      crypto users worldwide
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 bg-[#f5f5f7] rounded-[32px] p-12">
                  <div className="flex flex-col gap-8">
                    <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize">
                      $2.5B
                    </div>
                    <div className="text-black/50 text-base font-normal font-['Inter'] leading-6">
                      crypto giving expected in 2025 with growing trends
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Widget Section */}
          <section className="py-[120px]">
            <div className="flex flex-col gap-16">
              {/* Main Content Row */}
              <div className="flex flex-row gap-16 items-center">
                {/* Left Content */}
                <div className="flex-1 h-[585px] flex flex-col justify-center">
                  <div className="flex flex-col gap-6 mb-8">
                    <div className="text-[#2461f2] text-base font-medium font-['Neue_Montreal'] capitalize tracking-[0.64px]">
                      Accept Crypto with Ease
                    </div>
                    <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize leading-normal">
                      Plug-and-Play Donation Widget
                    </div>
                    <div className="text-black/50 text-base font-normal font-['Inter'] leading-6">
                      Seamlessly embed crypto giving into your website in minutes — no developers required.
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 px-8 py-4 border border-black/70 rounded-full w-fit">
                    <span className="text-black/70 text-xl font-semibold font-['Inter'] leading-6">
                      See how it works
                    </span>
                    <div className="w-6 h-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Right Content - Widget Demo */}
                <div className="flex-1 bg-[#f1fbe8] rounded-[32px] h-[585px] flex items-center justify-center p-8">
                  <div className="w-full aspect-[1240/824] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden">
                    <img 
                      src="/images/information/widget.svg" 
                      alt="Widget Demo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Divider Line */}
              <div className="w-full h-px bg-gray-200"></div>

              {/* Features Row */}
              <div className="flex flex-row gap-24">
                <div className="flex-1 flex flex-col gap-6">
                  <CodeIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Simple HTML iframe embedding set-up
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <CoinsIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    30+ cryptocurrencies accepted
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <GlobeIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Automatic conversion to local fiat currencies
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Showcase Section */}
          <section className="py-[120px]">
            <div className="flex flex-col gap-16">
              {/* Main Content Row */}
              <div className="flex flex-row gap-24 items-center">
                {/* Left Content */}
                <div className="flex-1 h-[585px] flex flex-col justify-center">
                  <div className="flex flex-col gap-6 mb-8">
                    <div className="text-[#2461f2] text-base font-medium font-['Neue_Montreal'] capitalize tracking-[0.64px]">
                      Reach A Global Community
                    </div>
                    <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize leading-normal">
                      Showcase Your Projects To Crypto Donors
                    </div>
                    <div className="text-black/50 text-base font-normal font-['Inter'] leading-6">
                      Get discovered by donors around the world who want to directly support impactful research and education.
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 px-8 py-4 border border-black/70 rounded-full w-fit">
                    <span className="text-black/70 text-xl font-semibold font-['Inter'] leading-6">
                      Explore Marketplace
                    </span>
                    <div className="w-6 h-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Right Content - Project Demo */}
                <div className="flex-1 bg-[#fff8e8] rounded-[32px] h-[585px] flex items-center justify-center p-8">
                  <div className="w-full flex flex-col gap-8">
                    {/* Top Card */}
                    <div className="bg-[#ffefc1] rounded-3xl h-[148px] w-full"></div>
                    
                    {/* Main Project Card */}
                    <div className="bg-white rounded-3xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] p-8">
                      <div className="flex flex-col gap-6">
                        {/* Project Info */}
                        <div className="flex flex-col gap-3">
                          <div className="text-black text-base font-semibold font-['Inter'] leading-6">
                            NeuroBridge
                          </div>
                          <div className="text-black text-base font-semibold font-['Inter'] leading-6">
                            Bridging Brain Health and AI for Early Alzheimer's Detection
                          </div>
                        </div>
                        
                        {/* Verification */}
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="2"/>
                            </svg>
                          </div>
                          <div className="text-black text-2xl font-semibold font-['Inter'] leading-8">
                            Verified by universities
                          </div>
                        </div>
                        
                        {/* Total Raised */}
                        <div className="flex justify-between items-center">
                          <div className="text-black text-base font-semibold font-['Inter'] leading-6">
                            Total Raised
                          </div>
                          <div className="text-black text-base font-semibold font-['Inter'] leading-6">
                            $ 123,456.00
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Card */}
                    <div className="bg-[#ffefc1] rounded-3xl h-[168px] w-full"></div>
                  </div>
                </div>
              </div>

              {/* Divider Line */}
              <div className="w-full h-px bg-gray-200"></div>

              {/* Features Row */}
              <div className="flex flex-row gap-24">
                <div className="flex-1 flex flex-col gap-6">
                  <GraduationCapIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Verified projects from universities and researchers in 20+ countries
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <ArrowsDownUpIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Transparent donation tracking
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <MagnifyingGlassIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Direct support to institutions or specific researchers
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard Section */}
          <section className="py-[120px]">
            <div className="flex flex-col gap-16">
              {/* Main Content Row */}
              <div className="flex flex-row gap-24 items-center">
                {/* Left Content */}
                <div className="flex-1 h-[585px] flex flex-col justify-center">
                  <div className="flex flex-col gap-6 mb-8">
                    <div className="text-[#2461f2] text-base font-medium font-['Neue_Montreal'] capitalize tracking-[0.64px]">
                      Control, Track, Report
                    </div>
                    <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize leading-normal">
                      All-in-One Dashboard For Your Crypto Giving
                    </div>
                    <div className="text-black/50 text-base font-normal font-['Inter'] leading-6">
                      Manage donations, compliance, and reporting — all from a single place, designed for institutional needs.
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 px-8 py-4 border border-black/70 rounded-full w-fit">
                    <span className="text-black/70 text-xl font-semibold font-['Inter'] leading-6">
                      Create account
                    </span>
                    <div className="w-6 h-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Right Content - Dashboard Demo */}
                <div className="flex-1 bg-[#f6e7fe] rounded-[32px] h-[585px] flex items-center justify-center pl-8 pr-0 py-0">
                  <div className="w-full flex flex-col gap-8">
                    {/* Main Balance Card */}
                    <div className="bg-white rounded-l-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] px-8 py-6">
                      <div className="w-[263px] flex flex-col gap-3">
                        <div className="text-black text-sm font-semibold font-['Inter'] leading-5">
                          Balance
                        </div>
                        <div className="text-black text-[32px] font-semibold font-['Inter'] leading-10">
                          $12,345.00
                        </div>
                        <div className="text-black/60 text-sm font-semibold font-['Inter'] leading-5">
                          The next withdraw period: 07/05/2024
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="flex gap-8">
                      {/* Total received card */}
                      <div className="flex-1 bg-white rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] p-6">
                        <div className="flex flex-col gap-4">
                          <div className="text-black text-2xl font-semibold font-['Inter'] leading-8">
                            $1,234.00
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="text-black/70 text-sm font-semibold font-['Inter'] leading-5">
                              Total received this month
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Processing received card */}
                      <div className="flex-1 bg-white rounded-l-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] p-6">
                        <div className="flex flex-col gap-4">
                          <div className="text-black text-2xl font-semibold font-['Inter'] leading-8">
                            $1,234.00
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="text-black/70 text-sm font-semibold font-['Inter'] leading-5">
                              Processing received
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider Line */}
              <div className="w-full h-px bg-gray-200"></div>

              {/* Features Row */}
              <div className="flex flex-row gap-24">
                <div className="flex-1 flex flex-col gap-6">
                  <MoneyIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Monitor real-time donations and currency breakdowns
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <ReceiptIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Manage receipts, project listings, and donor data
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <FilesIcon size={32} />
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6">
                    Download reports for finance and tax teams
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-[120px]">
            <div className="flex flex-row gap-24 items-start">
              <div className="flex-1 text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize leading-normal">
                Testimonial
              </div>
              <div className="flex-1 flex flex-col gap-24 items-start justify-center">
                {/* First Testimonial */}
                <div className="flex flex-col gap-8 w-full">
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6 w-full">
                    "Intuipay has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Intuipay's features into our website and customize it to our brand standards."
                  </div>
                  <div className="text-black/70 text-xl font-semibold font-['Inter'] leading-6 w-full">
                    Name / logo
                  </div>
                </div>
                
                {/* Second Testimonial */}
                <div className="flex flex-col gap-8 w-full">
                  <div className="text-black/70 text-base font-normal font-['Inter'] leading-6 w-full">
                    "Intuipay has been great. The website is easy to navigate and almost everything is automated. Whenever we have a question, the team is always quick to get back to us. We can incorporate Engiven's features into our website and customize it to our brand standards."
                  </div>
                  <div className="text-black/70 text-xl font-semibold font-['Inter'] leading-6 w-full">
                    Name / logo
                  </div>
                </div>
              </div>
            </div>
          </section>

          </div>

          {/* CTA Section */}
          <section className="bg-violet-100 rounded-tl-[64px] rounded-tr-[64px]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-[120px] flex flex-col justify-start items-center gap-16">
              <div className="flex flex-col justify-start items-center gap-6">
                <div className="text-black text-[56px] font-medium font-['Neue_Montreal'] capitalize">Simplify Education Giving</div>
                <div className="text-black/50 text-[20px] font-normal font-['Inter']">
                  Powered by stables, Intuipay's product suite transforms how education gets funded
                </div>
              </div>
              <button className="bg-black text-white px-8 py-4 rounded-[40px] text-[20px] font-semibold font-['Inter'] leading-6">Book a demo</button>
             </div>
           </section>

          {/* Footer Section */}
          <section className="bg-violet-100">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-[120px] py-12">
              <div className="flex flex-row justify-between gap-8">
                {/* Product Column */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="text-black text-[14px] font-semibold font-['Inter'] leading-5">
                    Product
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Donation
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Payment
                    </div>
                  </div>
                </div>

                {/* For organizations Column */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="text-black text-[14px] font-semibold font-['Inter'] leading-5">
                    For organizations
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Book a demo
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Sign in
                    </div>
                  </div>
                </div>

                {/* Resources Column */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="text-black text-[14px] font-semibold font-['Inter'] leading-5">
                    Resources
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Blog
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Help Center
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Knowledge Space
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Legal
                    </div>
                  </div>
                </div>

                {/* Social Column */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="text-black text-[14px] font-semibold font-['Inter'] leading-5">
                    Social
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      X
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Facebook
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Instagram
                    </div>
                    <div className="text-black/70 text-[14px] font-normal font-['Inter'] leading-5">
                      Linkedin
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    </>
  )
}
