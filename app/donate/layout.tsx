import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donate | NeuroBridge",
  description: "Make a donation to NeuroBridge",
}

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
