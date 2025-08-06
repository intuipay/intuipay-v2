import type React from 'react'
import { Button } from '@/components/ui/button';
import BackButton from '@/components/back-button';
import { Web3Provider } from '@/components/providers/web3-provider';
import { getDonationProjectBySlug } from '@/lib/data';

export const runtime = 'edge';

export default async function DonateLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{slug: string}>
}) {
  const slug = (await params).slug;
  const project = await getDonationProjectBySlug(slug);
  const pageTitle = project?.project_name || 'Support';
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50 lg:bg-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between px-8 sm:px-30 py-4 bg-white lg:bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <BackButton className="hidden" />
            <div>
              <p className="text-sm text-gray-600">Donating to</p>
              <p className="font-medium text-gray-900 truncate">{pageTitle}</p>
            </div>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full hidden"
            type="button"
          >Sign In</Button>
        </header>

        {children}
      </div>
    </Web3Provider>
  )
}
