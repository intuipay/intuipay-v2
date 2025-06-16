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
  id: string;
  accepts: string;
  amount: string;
  banner: string;
  banners: string;
  campaign: string;
  category: string;
  description: string;
  email: string;
  end_at: string;
  github: string;
  goal_amount: string;
  location: string;
  org_contact: string;
  org_description: string;
  org_location: string;
  org_logo: string;
  org_name: string;
  org_slug: string;
  org_type: string;
  org_website: string;
  project_name: string;
  qrcode: string;
  social_links: Record<string, string>;
  status: string;
  tags: string;
  tags_1: string;
  type: string;
  wallet_address: string;
  website: string;
  backers: string;
  twitter: string
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
