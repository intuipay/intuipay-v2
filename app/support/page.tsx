import { ChevronLeft, ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 lg:bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white lg:bg-gray-50">
        <div className="flex items-center gap-3">
          <Link href="/donate/neurobridge">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <p className="text-sm text-gray-600">Donating to</p>
            <p className="font-medium text-gray-900">NeuroBridge</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">Sign In</Button>
      </header>

      {/* Main Content */}
      <main className="lg:flex lg:items-center lg:justify-center lg:min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md mx-auto bg-white lg:rounded-2xl lg:shadow-lg lg:p-8 p-4">
          {/* Content */}
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-center relative mb-8">
              <Link href="/donate/neurobridge" className="absolute left-0 p-1 lg:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold text-center text-gray-900">Contact Us</h1>
            </div>

            {/* Description */}
            <div className="text-center space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Our support team is available 24/7 to assist you with any questions or concerns. We&apos;re committed to
                providing a prompt and reliable response whenever you need help.
              </p>
            </div>

            {/* Customer Support Section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Customer Support</h2>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <a
                    href="mailto:help@intuipay.com"
                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                  >
                    help@intuipay.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between mt-8 pt-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-medium text-gray-700">🔷 Intuipay</span>
            </div>
            <span className="text-gray-500">Terms & Conditions</span>
          </footer>
        </div>
      </main>
    </div>
  )
}
