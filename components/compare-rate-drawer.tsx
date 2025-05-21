'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface PaymentMethod {
  id: string
  name: string
  currency: string
  amount: string
  amountRange?: string
  additionalFees?: string
  timeframe: string
  icon: string
  color?: string
  label?: string
  requiresNotice?: boolean
}

export default function CompareRateDrawer() {
  const [open, setOpen] = useState(false)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'edu-chain-cny',
      name: 'Edu Chain in Chinese Yuan',
      currency: 'CNY',
      amount: '175,432.18',
      timeframe: '~20-60 mins',
      icon: '/images/edu-chain-icon.png',
      color: 'blue',
      label: 'FAST & MOST POPULAR',
    },
    {
      id: 'edu-chain-usdc',
      name: 'Edu Chain in USD Coin',
      currency: 'USDC',
      amount: '24,000.00',
      timeframe: '10 mins',
      icon: '/images/usdc-icon.png',
      color: 'green',
      label: 'FASTEST & CHEAPEST, IF YOU ALREADY OWN ENOUGH USDC',
    },
    {
      id: 'alipay',
      name: 'Alipay pay in Chinese Yuan',
      currency: 'CNY',
      amountRange: '180,643.03 - 180,888.88',
      additionalFees: '+ 5,210.85 - 5,444.44 CNY',
      timeframe: '1-2 days',
      icon: '/images/alipay-icon.png',
    },
    {
      id: 'rmb-transfer',
      name: 'RMB transfer in Chinese Yuan',
      currency: 'CNY',
      amountRange: '181,222.02 - 180,888.88',
      additionalFees: '+ 5,210.85 - 5,444.44 CNY',
      timeframe: '3-7 days',
      icon: '/images/bank-icon.png',
      requiresNotice: true,
    },
    {
      id: 'unionpay',
      name: 'UnionPay Debit / Credit card in Chinese Yuan',
      currency: 'CNY',
      amountRange: '181,222.02 - 180,888.88',
      additionalFees: '+ 5,210.85 - 5,444.44 CNY',
      timeframe: '3-7 days',
      icon: '/images/unionpay-icon.png',
    },
    {
      id: 'mastercard',
      name: 'Mastercard Debit / Credit card in Chinese Yuan',
      currency: 'CNY',
      amountRange: '181,222.02 - 180,888.88',
      additionalFees: '+ 5,210.85 - 5,444.44 CNY',
      timeframe: '3-7 days',
      icon: '/images/mastercard-icon.png',
    },
    {
      id: 'visa',
      name: 'Visa Debit / Credit card in Chinese Yuan',
      currency: 'CNY',
      amountRange: '181,222.02 - 180,888.88',
      additionalFees: '+ 5,210.85 - 5,444.44 CNY',
      timeframe: '3-7 days',
      icon: '/images/visa-icon.png',
    },
  ]

  const featuredMethods = paymentMethods.slice(0, 2)
  const otherMethods = paymentMethods.slice(2)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="w-full bg-blue-50 border border-blue-500 text-blue-500 hover:bg-blue-100 rounded-full h-16 text-xl font-semibold"
          onClick={() => setOpen(true)}
        >
          Compare Rate
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Compare Rate</h2>
          </div>
        </div>

        <div className="p-4">
          <div className="text-center text-gray-500 text-sm mb-4 relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
            <span className="relative bg-white px-4">Methods offered by Intuipay</span>
          </div>

          <div className="space-y-4">
            {featuredMethods.map((method) => (
              <div
                key={method.id}
                className={`rounded-xl overflow-hidden ${
                  method.color === 'blue' ? 'bg-blue-500' : method.color === 'green' ? 'bg-green-500' : 'bg-gray-100'
                }`}
              >
                {method.label && (
                  <div
                    className={`text-xs font-bold text-white px-4 py-2 ${
                      method.color === 'blue'
                        ? 'bg-blue-500'
                        : method.color === 'green'
                          ? 'bg-green-500'
                          : 'bg-gray-500'
                    }`}
                  >
                    {method.label}
                  </div>
                )}
                <div className="bg-white m-1 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={method.icon || '/placeholder.svg'}
                        alt={method.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{method.name}</p>
                      {method.amountRange ? (
                        <p className="text-2xl font-bold">
                          {method.amountRange} {method.currency}
                        </p>
                      ) : (
                        <p className="text-2xl font-bold">
                          {method.amount} {method.currency}
                        </p>
                      )}
                      {method.additionalFees && <p className="text-sm text-orange-500">{method.additionalFees}</p>}
                      <p className="text-sm">Will take only {method.timeframe}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-gray-500 text-sm my-4 relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
            <span className="relative bg-white px-4">Other methods</span>
          </div>

          <div className="space-y-4">
            {otherMethods.map((method) => (
              <div key={method.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      src={method.icon || '/placeholder.svg'}
                      alt={method.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {method.name}
                      {method.requiresNotice && (
                        <span> -A Payment notice / bill / invoice from institution is required</span>
                      )}
                    </p>
                    <p className="text-xl font-bold">
                      {method.amountRange} {method.currency}
                    </p>
                    {method.additionalFees && <p className="text-sm text-orange-500">{method.additionalFees}</p>}
                    <p className="text-sm">Will take {method.timeframe}</p>
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
