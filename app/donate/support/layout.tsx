import type React from 'react'
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
      <header className="flex items-center justify-between p-4 bg-white lg:bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <Button
            className="size-8"
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="font-medium text-gray-900 truncate">Support</div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full hidden"
          type="button"
        >Sign In</Button>
      </header>

      {children}
    </div>
  )
}
