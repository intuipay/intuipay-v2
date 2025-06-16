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
