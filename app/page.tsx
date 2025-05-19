import Image from "next/image"
import { X } from "lucide-react"
import PaymentCalculator from "@/components/payment-calculator"
import WaitlistForm from "@/components/waitlist-form"
import StructuredData from "@/components/structured-data"

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="min-h-screen flex flex-col">
        <header className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/images/intuipay-logo.png"
              alt="Intuipay"
              width={130}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <button className="text-black" aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <main className="flex-1 container mx-auto px-4 py-6 md:py-12">
          <section className="md:flex md:items-start md:gap-12 lg:gap-24">
            <div className="md:flex-1 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Where{" "}
                <span className="inline-flex items-center mx-1" aria-label="Flags">
                  <span className="flex space-x-1">
                    <span className="w-5 h-3 bg-red-500 rounded-sm"></span>
                    <span className="w-5 h-3 bg-green-600 rounded-sm"></span>
                    <span className="w-5 h-3 bg-red-600 rounded-sm"></span>
                    <span className="w-5 h-3 bg-blue-600 rounded-sm"></span>
                  </span>
                </span>{" "}
                Global
                <br />
                Education Meets{" "}
                <span className="text-yellow-400" aria-hidden="true">
                  👋
                </span>
                <br />
                <span className="text-blue-500">Next-Gen Payments.</span>
              </h1>

              <p className="text-lg mb-8">
                Support global universities and pay tuition & make donation across borders — with speed, trust, and
                simplicity.
              </p>

              <WaitlistForm />
            </div>

            <div className="md:flex-1 bg-slate-50 p-4 md:p-8 rounded-3xl">
              <PaymentCalculator />
            </div>
          </section>
        </main>

        <footer className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          © 2025 IntuiPay. All rights reserved.
        </footer>
      </div>
    </>
  )
}
