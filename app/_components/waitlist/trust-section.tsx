'use client'

import { useState } from 'react'

const partners = [
  { name: 'Metamask', logo: '/images/information/metamask.svg' },
  { name: 'PayPal', logo: '/images/information/paypal.svg' },
  { name: 'MoonPay', logo: '/images/information/moonpay.svg' },
  { name: 'Transak', logo: '/images/information/transak.svg' },
]

export default function TrustSection() {
  const [isPaused, setIsPaused] = useState(false)

  // 创建足够多的重复内容确保在所有屏幕尺寸上都能无缝滚动
  const duplicatedPartners = [
    ...partners,
    ...partners,
    ...partners,
    ...partners,
    ...partners,
    ...partners
  ]

  return (
    <section className="py-12 max-w-7xl mx-auto px-16">
      <div className="flex flex-col justify-center items-center gap-12">
        <div className="text-center">
          <span className="text-black text-3xl font-medium">Trust by </span>
          <span className="text-blue-600 text-3xl font-medium">Institutions & Nonprofits</span>
        </div>
      </div>

      <div className="w-full overflow-hidden mt-12">
        <div
          className={`flex items-center gap-16 min-w-max ${isPaused ? 'animate-pause' : 'animate-scroll-continuous'
            }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-16 w-32 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} Logo`}
                className="max-h-12 max-w-24 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
