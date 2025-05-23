'use client'

import { useState } from 'react'
import Image from 'next/image'
import { XIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import useStore from '@/store';

export default function CompareRateDrawer() {
  const featuredMethods = useStore(state => state.paymentMethodList);
  const otherMethods = useStore(state => state.paymentMethodOtherList);
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="w-full bg-blue-50 border border-blue-500 text-blue-500 hover:bg-blue-100 rounded-full h-16 text-xl font-semibold"
          onClick={() => setOpen(true)}
        >
          Compare Rates
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 overflow-y-auto rounded-l-xl pb-8">
        <header className="sticky top-0 bg-white z-10 px-12 py-6 flex items-center">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Compare Rate</h2>
          </div>
          <Button
            className="ms-auto aspect-square px-0"
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            <XIcon className="size-6" />
          </Button>
        </header>
        <div className="px-12 mb-8">
          <p className="mb-4">Most rates includes additional exchange rate markup and service fees. Some providers claim to offer “no fees,” but they often include a <strong>hidden markup</strong> in the exchange rate, which means you may end up paying more than you expected.</p>
          <p>At Intuipay, we work with licensed onramp partners to offer you the best total rate available. Everything is shown up front, with no hidden charges. Your donation stays fast, transparent, and affordable.</p>
        </div>

        <div className="px-12">
          <div className="text-center text-gray-400 mb-6 relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
            <span className="relative bg-white px-4">Methods offered by Intuipay</span>
          </div>

          <div className="space-y-6">
            {featuredMethods.map((method) => (
              <div
                key={method.name}
                className={`rounded-xl overflow-hidden ${
                  method.name.toLowerCase().includes('usdc') ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                {method.name && (
                  <div
                    className={`text-xs font-semibold text-white px-4 pt-2.5 pb-1 ${
                      method.name.toLowerCase().includes('usdc')
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {method.name}
                  </div>
                )}
                <div className="bg-white m-1.5 rounded-lg px-7 py-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 flex-shrink-0">
                      <Image
                        src={`/images/information/${method.icon}.png` || '/placeholder.svg'}
                        alt={method.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-600">{method.name}</p>
                      {method.amountRange && <p className="text-2xl font-bold">
                        {method.amountRange[ 0 ].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - {method.amountRange[ 1 ].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {method.symbol}
                      </p>}
                      <p dangerouslySetInnerHTML={{ __html: method.description }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-gray-500 my-4 relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
            <span className="relative bg-white px-4">Other methods</span>
          </div>

          <div className="space-y-6">
            {otherMethods.map((method) => (
              <div key={method.name} className="bg-gray-50 rounded-2xl px-7 pt-8 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 flex-shrink-0">
                    <Image
                      src={`/images/information/${method.icon}.png` || '/placeholder.svg'}
                      alt={method.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      {method.name}
                    </p>
                    {method.amountRange && <p className="text-2xl font-bold">
                      {method.amountRange[ 0 ].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ${method.amountRange[ 1 ].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {method.symbol}
                    </p>}
                    {method.diffAmountRange && <p className="font-medium text-red-700">+ {method.diffAmountRange[ 0 ].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - {method.diffAmountRange[ 1 ].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {method.symbol}</p>}
                    <p dangerouslySetInnerHTML={{ __html: method.description }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
