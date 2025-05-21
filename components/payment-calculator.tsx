'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import CompareRateDrawer from './compare-rate-drawer'
import { Combobox } from '@headlessui/react';
import MyCombobox from '@/components/my-combobox';
import { CurrencyList } from '@/data';

export default function PaymentCalculator() {
  const [fromCountry, setFromCountry] = useState('China')
  const [toCountry, setToCountry] = useState('United States')
  const [university, setUniversity] = useState('Emory University')
  const [amount, setAmount] = useState('24,000 USD')

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label htmlFor="from-country" className="block text-sm font-medium">
          Paying From
        </label>
        <MyCombobox
          options={CurrencyList.map(currency => currency.country)}
          onChange={setFromCountry}
          value={fromCountry}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="to-country" className="block text-sm font-medium">
          Institution Destination
        </label>
        <Select defaultValue={toCountry} onValueChange={setToCountry}>
          <SelectTrigger id="to-country" className="w-full border rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/flag-us.png"
                  alt="US flag"
                  width={24}
                  height={24}
                  className="object-cover"
                  priority
                />
              </div>
              <SelectValue placeholder="Select country" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue={university} onValueChange={setUniversity}>
          <SelectTrigger id="university" className="w-full border rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-blue-900 flex items-center justify-center text-white text-xs flex-shrink-0">
                E
              </div>
              <SelectValue placeholder="Select university" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Emory University">Emory University</SelectItem>
            <SelectItem value="Harvard University">Harvard University</SelectItem>
            <SelectItem value="Stanford University">Stanford University</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-medium">
          Payment Amount
        </label>
        <Select defaultValue={amount} onValueChange={setAmount}>
          <SelectTrigger id="amount" className="w-full border rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/flag-us.png"
                  alt="US flag"
                  width={24}
                  height={24}
                  className="object-cover"
                  priority
                />
              </div>
              <SelectValue placeholder="Select amount" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24,000 USD">24,000 USD</SelectItem>
            <SelectItem value="30,000 USD">30,000 USD</SelectItem>
            <SelectItem value="50,000 USD">50,000 USD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 space-y-2">
        <p>Best price paying with Intuipay</p>
        <p className="text-3xl font-bold">175,432.18 CNY</p>
        <p>Will take only <strong>~20-60 mins</strong></p>
      </div>

      <CompareRateDrawer />
    </div>
  )
}
