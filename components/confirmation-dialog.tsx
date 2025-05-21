'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export default function ConfirmationDialog({ open, onOpenChange, email }: ConfirmationDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Generate a unique referral ID based on email (in a real app, this would come from the backend)
  const referralId = 'PIRHAHIM1D'
  const referralLink = `intuipay.ref_id=${referralId}`

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
            : 'sm:max-w-md'
        }`}
      >
        <button
          onClick={() => onOpenChange(false)}
          className={`absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            isMobile ? 'text-gray-700' : ''
          }`}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div
          className={`flex flex-col items-center text-center ${isMobile ? 'h-full justify-center px-6' : 'px-6 py-10'}`}
        >
          <div className="mb-6">
            <Image src="/images/intuipay-logo.png" alt="Intuipay" width={130} height={40} className="h-10 w-auto" />
          </div>

          <h2 className="text-2xl font-semibold mb-3">
            Welcome. <span className="text-yellow-400">👋</span> You&apos;ve joined the waitlist!
          </h2>

          <p className="text-gray-600 mb-8 max-w-sm">
            We&apos;ll notify you as soon as Intuipay is ready, spread this exciting news to your friend today!
          </p>

          <div className="w-full mb-8">
            <p className="text-sm font-medium mb-2 text-left">Share your referral link</p>
            <div className="flex">
              <div className="flex-grow bg-white border rounded-l-md p-3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="bg-white border border-l-0 rounded-r-md p-3 flex items-center justify-center"
                aria-label="Copy referral link"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-blue-500" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <span className="mr-2">Follow us on</span>
            <a
              href="https://twitter.com/intuipay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <X size={16} />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
