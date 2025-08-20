'use client';

import { ChevronLeft, ArrowLeft, Mail, MailboxIcon, HeadsetIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image';
import { MouseEvent } from 'react';

export default function SupportPage() {
  function doBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.history.back();
  }

  return (
    <main className="flex-1 sm:py-20 flex flex-col">
      <div className="w-full flex flex-col flex-1 max-w-xl mx-auto bg-white lg:rounded-2xl lg:shadow-lg px-8 py-6 lg:px-10">
        {/* Content */}
        <div className="space-y-12 flex-1">
          {/* Header */}
          <div className="flex items-center justify-center relative mb-8">
            <Link
              className="absolute top-0 left-0"
              href="/donate/"
              onClick={doBack}
            >
              <XIcon className="size-6 sm:hidden" />
              <ArrowLeft className="size-6 hidden sm:bottom-0" />
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
            <h2 className="font-medium text-gray-500 uppercase tracking-wide">Customer Support</h2>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <MailboxIcon className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-black/50 mb-1">Email Address</p>
                <p>
                  <a
                    className="hover:text-blue-600"
                    href="mailto:support@intuipay.xyz"
                    target="_blank"
                  >
                    support@intuipay.xyz
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between mt-12 text-sm font-semibold text-black">
          <Link
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
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
            href="/terms-of-use"
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            Terms & Conditions
          </Link>
        </footer>
      </div>
    </main>
  )
}
