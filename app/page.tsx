import Image from 'next/image'
import PaymentCalculator from '@/components/payment-calculator'
import WaitlistForm from '@/components/waitlist-form'
import StructuredData from '@/components/structured-data'
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="min-h-screen flex flex-col">
        <header className="container mx-auto px-8 sm:px-4 py-4 sm:py-7.5 flex justify-between items-center border-b">
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
          <Link
            className="text-black" aria-label="Close"
            href="https://x.com/intuipay"
          >
            <Image
              src="/images/x.svg"
              alt="X logo"
              width={20}
              height={20}
              className="size-5 block"
            />
          </Link>
        </header>

        <main className="flex-1 container mx-auto md:p-8">
          <section className="xl:flex xl:items-center">
            <div className="xl:w-1/2 flex-none p-8 md:p-0 mb-12 xl:mb-0">
              <h1 className="sm:w-3/4 mx-auto sm:min-w-107 text-4xl sm:text-6xl xl:text-5xl 2xl:text-6xl font-medium mb-6 text-nowrap">
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

              <p className="sm:w-3/4 mx-auto sm:min-w-107 text-xl mb-16">
                Support global universities and pay tuition & make donation across borders — with speed, trust, and
                simplicity.
              </p>

              <WaitlistForm className="sm:w-3/4 mx-auto sm:min-w-107" />
            </div>

            <div className="xl:w-1/2 flex-none bg-slate-50 px-8 py-13  md:rounded-2xl bg-[url(/images/sidebar-bg.svg)] bg-cover bg-center">
              <div className="w-81.5 sm:w-107 mx-auto  p-8 md:px-14 md:py-15 bg-white rounded-2xl shadow-md">
                <PaymentCalculator />
              </div>
            </div>
          </section>
        </main>

        <footer className="container mx-auto px-4 py-6 text-gray-500 text-sm border-t">
          © 2025 Intuipay Holding PTE. LTD. All rights reserved. v{process.env.NEXT_PUBLIC_APP_VERSION}
        </footer>
      </div>
    </>
  )
}
