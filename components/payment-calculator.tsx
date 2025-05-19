"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import CompareRateDrawer from "./compare-rate-drawer"

export default function PaymentCalculator() {
  const [fromCountry, setFromCountry] = useState("China")
  const [toCountry, setToCountry] = useState("United States")
  const [university, setUniversity] = useState("Emory University")
  const [amount, setAmount] = useState("24,000 USD")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="from-country" className="block text-sm font-medium">
          Paying From
        </label>
        <Select defaultValue={fromCountry} onValueChange={setFromCountry}>
          <SelectTrigger id="from-country" className="w-full border rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/images/flag-china.png"
                  alt="China flag"
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
            <SelectItem value="China">China</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Nigeria">Nigeria</SelectItem>
          </SelectContent>
        </Select>
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
      </div>

      <div className="space-y-2">
        <label htmlFor="university" className="block text-sm font-medium">
          University
        </label>
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

      <div className="pt-4">
        <p className="text-sm">Best price paying with Intuipay</p>
        <p className="text-3xl font-bold">175,432.18 CNY</p>
        <p className="text-sm">Will take only ~20-60 mins</p>
      </div>

      <CompareRateDrawer />
    </div>
  )
}
