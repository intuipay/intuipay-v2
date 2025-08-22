import type React from 'react';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/back-button';

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-gray-50 lg:bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="items-center justify-between p-4 bg-white lg:bg-gray-50 border-b hidden sm:flex">
        <div className="flex items-center gap-3">
          <BackButton />
          <div className="font-medium text-gray-900 truncate">Support</div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full hidden"
          type="button"
        >Sign In</Button>
      </header>

      {children}
    </div>
  );
}
