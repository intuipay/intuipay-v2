// No changes needed here, but ensure it's correctly defining types used by both server and client.
// It's good practice to define the shape of your data, especially when passing it around.
// This is a simplified version based on current mock data.
import type { LucideIcon } from 'lucide-react'
import type { JSX } from 'react/jsx-runtime'

type StringOrComponent = string | (() => JSX.Element) | LucideIcon

export type ProjectUpdate = {
  id: string
  date: string
  title: string
  content: string
  media?: {
    type: 'placeholder' | 'image' | 'video'
    url: string
    alt?: string
  }
}

export type ProjectDonation = {
  id: string
  donorName: string
  timeAgo: string
  amountOriginal: string
  currencyOriginal: string
  amountUSD: string
  countryFlag: string
  countryName: string
  paymentMethod: string
}

export type UniversityData = {
  name: string
  logoUrl: string
  description: string
  contactEmail: string
  website: string
  location: string
  aboutImage: string
  socials: {
    linkedin?: string
    instagram?: string
    twitter?: string
    youtube?: string
    facebook?: string
  }
}

export type ProjectDataType = {
  slug: string
  title: string
  subtitle: string
  heroImageUrl: string
  category: string
  location: string
  projectType: string
  donationAccepts: string
  university: UniversityData
  funding: {
    current: number
    goal: number
  }
  backers: number
  daysLeft: number
  contact: {
    email: string
    website: string
    github: string
    twitter: string
  }
  overview: string
  missionStatement: string
  whyDonate: Array<{ title: string; text: string }>
  risksChallenges: Array<{ title: string; text: string }>
  faqLink: string
  tags: string[]
  updatesCount: number
  updates: ProjectUpdate[]
  donations: ProjectDonation[]
}

// Type for similar project cards (simplified)
export type SimilarProject = {
  id: string
  slug: string
  title: string
  description: string
  universityName: string
  imageUrl: string
  totalRaised: number
}
