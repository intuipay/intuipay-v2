import type React from 'react'
import { Button } from '@/components/ui/button';
import BackButton from '@/components/back-button';
import { Web3Provider } from '@/components/providers/web3-provider';
import { getDonationProjectBySlug } from '@/lib/data';

export const runtime = 'edge';

export default async function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50 lg:bg-gray-100">
        {children}
      </div>
    </Web3Provider>
  )
}
