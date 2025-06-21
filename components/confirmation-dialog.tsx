'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Copy, Check } from "@phosphor-icons/react";
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export default function ConfirmationDialog({ open, onOpenChange, email }: ConfirmationDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const referralLink = `https://intuipay.xyz/?ref_id=${email}`

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`p-0 gap-0 overflow-hidden ${
          isMobile
            ? 'fixed inset-0 w-full h-full max-w-none rounded-none m-0 bg-gradient-to-b from-blue-50 to-pink-50'
            : 'sm:max-w-[30rem]'
        }`}
      >
        <button
          onClick={() => onOpenChange(false)}
          className={`absolute top-8 right-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            isMobile ? 'text-gray-700' : ''
          }`}
        >
          <X size={24} />
          <span className="sr-only">Close</span>
        </button>

        <div
          className={`flex flex-col items-center text-center bg-[url(/images/sidebar-bg.svg)] ${isMobile ? 'h-full justify-center px-6' : 'px-16 py-22'}`}
        >
          <div className="mb-6">
            <Image
              src="/images/intuipay-logo.svg"
              alt="Intuipay"
              width={122}
              height={24}
              className="h-6 w-auto"
              loading="lazy"
            />
          </div>

          <h2 className="text-2xl font-medium mb-4 text-pretty">
            Welcome. <span className="text-yellow-400">👋</span> You&apos;ve joined the waitlist!
          </h2>

          <p className="text-gray-800 mb-12 max-w-sm text-sm font-medium">
            We&apos;ll notify you as soon as Intuipay is ready, spread this exciting news to your friend today!
          </p>

          <div className="w-full mb-12">
            <p className="text-sm font-medium mb-2 text-left">Share your referral link</p>
            <div className="flex border rounded-lg bg-white">
              <div className="flex-grow p-3 font-medium truncate text-left max-w-72">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="p-4 flex items-center justify-center"
                aria-label="Copy referral link"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-blue-500" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <a
              href="https://x.com/intuipay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <span className="font-medium mr-2">Follow us on</span>
              <Image
                src="/images/x.svg"
                alt="X logo"
                width={20}
                height={20}
                className="size-5 block"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
