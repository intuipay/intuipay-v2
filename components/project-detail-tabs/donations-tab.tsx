'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users } from "@phosphor-icons/react";
import { Donation } from '@/types'

type DonationsTabProps = {
  projectId: number;
}

export function DonationsTab({ projectId }: DonationsTabProps) {
  const [donationSort, setDonationSort] = useState<'newest' | 'top'>('newest')
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function fetchDonations() {
    if (isLoading) return;

    setIsLoading(true);
    const searchParams = new URLSearchParams();
    searchParams.set('order_by', donationSort === 'newest' ? 'id' : 'amount');
    searchParams.set('start', ((page - 1) * 20).toString());
    searchParams.set('pagesize', '20');
    const response = await fetch(`/api/project/${projectId}/donations?${searchParams.toString()}`);
    const data = await response.json();
    setDonations(data.data);
    setIsLoaded(true);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, [donationSort, projectId]);

  if (isLoaded && donations.length === 0) {
    return <p className="text-center text-gray-500 py-4">No donations yet for this project.</p>
  }

  if (isLoading) {
    return <p className="text-center text-gray-500 py-4">Loading...</p>
  }

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
        {donations.map((donation, index) => (
          // 没有id，暂时用index
          <div key={index} className="py-4 border-b border-neutral-mediumgray/30 last:border-b-0">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-2 items-center text-sm">
              <div className="sm:col-span-3 flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarFallback>
                    <Users size={16} className="text-neutral-darkgray" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-neutral-text">{donation.first_name + donation.last_name}</p>
                  {/* 没有相关字段，先注释 */}
                  {/* <p className="text-xs text-neutral-darkgray">{donation.timeAgo}</p> */}
                </div>
              </div>
              <div className="sm:col-span-3 text-left sm:text-left">
                <div className="flex items-center">
                  {/* 没有相关字段，先注释 */}
                  {/* {typeof donation.currencyIcon === 'function' ? (
                    <donation.currencyIcon />
                  ) : (
                    <donation.currencyIcon className="w-4 h-4 mr-1 text-neutral-darkgray" />
                  )} */}
                  <span className="ml-1 font-medium text-neutral-text">
                    {donation.amount} {donation.currency}
                  </span>
                </div>
                {/* 没有相关字段，先注释 */}
                {/* <p className="text-xs text-neutral-darkgray">${donation.amountUSD}</p> */}
              </div>
              <div className="sm:col-span-3 text-left sm:text-left">
                <p className="text-xs text-neutral-darkgray mb-0.5">Donate from</p>
                <div className="flex items-center">
                  {/* 没有相关字段，先注释 */}
                  {/* <span className="mr-1.5 text-base">{donation.countryFlag}</span> */}
                  <span className="text-neutral-text">{donation.country}</span>
                </div>
              </div>
              <div className="sm:col-span-3 text-left sm:text-left">
                <p className="text-xs text-neutral-darkgray mb-0.5">Donate via</p>
                {/* 没有相关字段，先注释 */}
                {/* <div className="flex items-center">
                  {typeof donation.paymentIcon === 'function' ? (
                    <donation.paymentIcon />
                  ) : (
                    <donation.paymentIcon className="w-4 h-4 mr-1.5 text-neutral-darkgray" />
                  )}
                  <span className="text-neutral-text">{donation.paymentMethod}</span>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
