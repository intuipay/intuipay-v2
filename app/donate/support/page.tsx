import { ChevronLeft, ArrowLeft, Mail, MailboxIcon, HeadsetIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image';

export default function SupportPage() {
  return (
    <main className="lg:flex lg:items-center lg:justify-center lg:min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-xl mx-auto bg-white lg:rounded-2xl lg:shadow-lg px-8 py-6 lg:px-10">
        {/* Content */}
        <div className="space-y-12">
          {/* Header */}
          <div className="flex items-center justify-center relative mb-8">
            <Link href="/donate/neurobridge" className="absolute left-0 p-1 lg:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-center text-gray-900">Contact Us</h1>
          </div>

          {/* Description */}
          <div className="text-center">
            <p className="font-medium leading-relaxed">
              Our support team is available 24/7 to assist you with any questions or concerns. We&apos;re committed to
              providing a prompt and reliable response whenever you need help.
            </p>
          </div>

          {/* Customer Support Section */}
          <div className="border bg-white rounded-lg p-6 space-y-6 shadow-md">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Customer Support</h2>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <MailboxIcon className="siz-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-black/50 mb-1">Email Address</p>
                <p>
                  <a
                    href="mailto:help@intuipay.com"
                    target="_blank"
                  >
                    help@intuipay.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between mt-12 text-sm font-semibold text-black px-3">
          <Link
            className="flex items-center gap-2 hover:text-blue-600 hover:underline transition-colors"
            href="/"
          >
            <span>Powered by</span>
            <Image
              alt="Intuipay Logo"
              className="h-3.5"
              src="/images/intuipay-logo.svg"
              width={71}
              height={14}
              loading="lazy"
            />
          </Link>
          <Link
            href="/donate/tos"
            className="hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
          >
            Terms & Conditions
          </Link>
        </footer>
      </div>
    </main>
  )
}
