import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support | NeuroBridge",
  description: "Get help and support for your NeuroBridge donation",
}

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
