import type React from 'react'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white lg:bg-gray-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm text-gray-600">Donating to</p>
            <p className="font-medium text-gray-900">NeuroBridge: The si...</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">Sign In</Button>
      </header>

      {children}
    </div>
  )
}
