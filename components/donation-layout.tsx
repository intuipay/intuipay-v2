"use client"

import type React from "react"

import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { Header } from "@/components/header"
import { ProgressSteps } from "@/components/progress-steps"
import { Footer } from "@/components/footer"

export function DonationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 lg:bg-gray-100">
      <Header />

      <main className="lg:flex lg:items-center lg:justify-center lg:min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto bg-white lg:rounded-2xl lg:shadow-lg lg:p-8 p-4"
        >
          {/* Hero Image */}
          <div className="mb-8">
            <div className="relative w-full h-48 lg:h-56 rounded-2xl overflow-hidden">
              <Image
                src="/hero-image.png"
                alt="Lion King inspired scene with lions silhouetted against full moon"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Progress Steps */}
          <ProgressSteps />

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <Footer />
        </motion.div>
      </main>
    </div>
  )
}
