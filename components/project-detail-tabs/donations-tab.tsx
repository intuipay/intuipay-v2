'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import type { ProjectDataType } from '@/app/project/[slug]/project-data'

type DonationsTabProps = {
  donations: ProjectDataType['donations']
}

export function DonationsTab({ donations }: DonationsTabProps) {
  const [donationSort, setDonationSort] = useState<'newest' | 'top'>('newest')

  const sortedDonations = [...donations].sort((a, b) => {
    if (donationSort === 'top') {
      // Assuming amountUSD is a string like "$46,494.89", need to parse it
      const amountA = Number.parseFloat(a.amountUSD.replace(/[^0-9.-]+/g, ''))
      const amountB = Number.parseFloat(b.amountUSD.replace(/[^0-9.-]+/g, ''))
      return amountB - amountA // Sort descending for "top"
    }
    // For "newest", assuming data is already somewhat sorted or rely on original order
    // If timeAgo is like "38 mins ago", "1 hr ago", "06/12/25", parsing is complex.
    // For robust "newest" sorting, you'd need a proper date object for each donation.
    // For now, we'll keep the original order for "newest" or reverse it if it's oldest first.
    // This example doesn't implement complex date parsing for sorting.
    return 0 // Default: no change for "newest" based on current data
  })

  return (
    <>
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant={donationSort === 'newest' ? 'default' : 'outline'}
          onClick={() => setDonationSort('newest')}
          className={`rounded-full px-4 py-1.5 text-sm ${donationSort === 'newest' ? 'bg-neutral-text text-neutral-white hover:bg-neutral-text/90' : 'border-neutral-mediumgray text-neutral-darkgray'}`}
        >
          Newest
        </Button>
        <Button
          variant={donationSort === 'top' ? 'default' : 'outline'}
          onClick={() => setDonationSort('top')}
          className={`rounded-full px-4 py-1.5 text-sm ${donationSort === 'top' ? 'bg-neutral-text text-neutral-white hover:bg-neutral-text/90' : 'border-neutral-mediumgray text-neutral-darkgray'}`}
        >
          Top
        </Button>
      </div>

      <div className="space-y-4">
        {sortedDonations && sortedDonations.length > 0 ? (
          sortedDonations.map((donation) => (
            <div key={donation.id} className="py-4 border-b border-neutral-mediumgray/30 last:border-b-0">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-2 items-center text-sm">
                <div className="sm:col-span-3 flex items-center">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarFallback>
                      <Users className="w-4 h-4 text-neutral-darkgray" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-neutral-text">{donation.donorName}</p>
                    <p className="text-xs text-neutral-darkgray">{donation.timeAgo}</p>
                  </div>
                </div>
                <div className="sm:col-span-3 text-left sm:text-left">
                  <div className="flex items-center">
                    {typeof donation.currencyIcon === 'function' ? (
                      <donation.currencyIcon />
                    ) : (
                      <donation.currencyIcon className="w-4 h-4 mr-1 text-neutral-darkgray" />
                    )}
                    <span className="ml-1 font-medium text-neutral-text">
                      {donation.amountOriginal} {donation.currencyOriginal}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-darkgray">${donation.amountUSD}</p>
                </div>
                <div className="sm:col-span-3 text-left sm:text-left">
                  <p className="text-xs text-neutral-darkgray mb-0.5">Donate from</p>
                  <div className="flex items-center">
                    <span className="mr-1.5 text-base">{donation.countryFlag}</span>
                    <span className="text-neutral-text">{donation.countryName}</span>
                  </div>
                </div>
                <div className="sm:col-span-3 text-left sm:text-left">
                  <p className="text-xs text-neutral-darkgray mb-0.5">Donate via</p>
                  <div className="flex items-center">
                    {typeof donation.paymentIcon === 'function' ? (
                      <donation.paymentIcon />
                    ) : (
                      <donation.paymentIcon className="w-4 h-4 mr-1.5 text-neutral-darkgray" />
                    )}
                    <span className="text-neutral-text">{donation.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No donations yet for this project.</p>
        )}
      </div>
    </>
  )
}
