// No changes needed here, it serves as the data source for the mock fetching function.
import { CircleDollarSign, Wallet, BanknoteIcon as BankIcon, CreditCard } from "lucide-react"
import type { ProjectDataType } from "./project-data"

export const projectData: ProjectDataType = {
  slug: "neurobridge", // This slug will be used by the mock getProjectBySlug
  title: "NeuroBridge",
  subtitle: "Bridging Brain Health and AI for Early Alzheimer's Detection",
  heroImageUrl: "/savannah-lion-king.png",
  category: "Health & Medical",
  location: "Atlanta, GA",
  projectType: "Non-Profit / Academic Research",
  donationAccepts: "Accept Crypto / Cash",
  university: {
    name: "Emory University",
    logoUrl: "/emory-shield-logo.png",
    description:
      "Alzheimer's disease affects over 6 million Americans, with early symptoms often going undetected until irreversible damage occurs. NeuroBridge is a multi-disciplinary research initiative at Emory University's Goizueta Alzheimer's Disease Research Center, combining neuroscience, machine learning, and public health to create a scalable AI-based diagnostic tool for the early detection of Alzheimer's through non-invasive EEG and behavioral biomarkers.",
    contactEmail: "info@emory.edu",
    website: "https://www.emory.edu/home/research/index.html",
    location: "Atlanta, GA",
    aboutImage: "/lab-research-photo.png",
    socials: {
      linkedin: "https://linkedin.com/school/emory-university/",
      instagram: "https://instagram.com/emoryuniversity/",
      twitter: "https://twitter.com/EmoryUniversity",
      youtube: "https://youtube.com/emoryuniversity",
      facebook: "https://facebook.com/EmoryUniversity",
    },
  },
  funding: {
    current: 1255,
    goal: 4000,
  },
  backers: 123,
  daysLeft: 123,
  contact: {
    email: "contact@neurobridge.org",
    website: "https://neurobridge.org",
    github: "neurobridge-research",
    twitter: "NeuroBridgeX",
  },
  overview:
    "Alzheimer's disease affects over 6 million Americans, with early symptoms often going undetected until irreversible damage occurs. NeuroBridge is a multi-disciplinary research initiative at Emory University's Goizueta Alzheimer's Disease Research Center, combining neuroscience, machine learning, and public health to create a scalable AI-based diagnostic tool for the early detection of Alzheimer's through non-invasive EEG and behavioral biomarkers.",
  missionStatement:
    "To bridge the gap between early symptom onset and diagnosis by developing an AI-powered tool that can identify subtle cognitive decline in at-risk populations—especially underserved communities—5-10 years before traditional diagnosis methods.",
  whyDonate: [
    {
      title: "Accelerate Discovery",
      text: "Help us train and validate cutting-edge AI models using one of the largest longitudinal cognitive datasets in the Southeast.",
    },
    {
      title: "Support Equity",
      text: "Your donation enables free cognitive screening clinics in underrepresented communities across Georgia.",
    },
    {
      title: "Drive Global Impact",
      text: "Findings will be published open-access, with tools made freely available to clinics worldwide.",
    },
    {
      title: "Create Hope",
      text: "Earlier diagnosis means earlier interventions, longer independence, and more time with loved ones.",
    },
  ],
  risksChallenges: [
    {
      title: "Technical Limitations",
      text: "AI prediction models may require years of refinement and validation before FDA approval.",
    },
    {
      title: "Data Privacy",
      text: "Safeguarding sensitive neurological and behavioral data demands strict governance and continuous investment.",
    },
    {
      title: "Equity in Application",
      text: "Ensuring diagnostic tools work equally well across diverse populations is an ongoing challenge we are committed to addressing.",
    },
  ],
  faqLink: "/faq#neurobridge",
  tags: [
    "Alzheimer's",
    "Brain Health",
    "Cognitive Neuroscience",
    "Digital Biomarkers",
    "Aging & Elder Care",
    "Biomedical Research",
    "Early Detection",
    "Public Health",
  ],
  updatesCount: 4,
  updates: [
    {
      id: "update-1",
      date: "2022-10-22T10:00:00Z",
      title: "Funds distribution conversation is going strong!",
      content:
        "How should we distribute these funds to verified projects? The conversation is going strong in our forum! We have decided to continue the discussion until we raise $250,000 of matching funds at which point we will put the options to a vote. If you're interested in contributing to the conversation, jump into our forum and weigh in with your thoughts!",
      media: {
        type: "placeholder",
        url: "/placeholder-g5b97.png",
        alt: "Media placeholder for funds distribution update",
      },
    },
    {
      id: "update-2",
      date: "2022-10-22T09:00:00Z",
      title: "Funds distribution conversation is going strong!",
      content:
        "How should we distribute these funds to verified projects? The conversation is going strong in our forum! We have decided to continue the discussion until we raise $250,000 of matching funds at which point we will put the options to a vote. If you're interested in contributing to the conversation, jump into our forum and weigh in with your thoughts!",
    },
    {
      id: "update-3",
      date: "2022-10-22T08:00:00Z",
      title: "Funds distribution conversation is going strong!",
      content:
        "How should we distribute these funds to verified projects? The conversation is going strong in our forum! We have decided to continue the discussion until we raise $250,000 of matching funds at which point we will put the options to a vote. If you're interested in contributing to the conversation, jump into our forum and weigh in with your thoughts!",
    },
    {
      id: "update-4",
      date: "2022-10-22T07:00:00Z",
      title: "Project Launched! 🎉",
      content:
        "We are thrilled to announce that NeuroBridge has officially launched. Thank you to all our early supporters!",
    },
  ],
  donations: [
    {
      id: "don-1",
      donorName: "Anonymous",
      timeAgo: "38 mins ago",
      amountOriginal: "46,500",
      currencyOriginal: "USDC",
      currencyIcon: CircleDollarSign,
      amountUSD: "46,494.89",
      countryFlag: "🇨🇳",
      countryName: "China",
      paymentMethod: "Wallet",
      paymentIcon: Wallet,
    },
    {
      id: "don-2",
      donorName: "Anonymous",
      timeAgo: "38 mins ago",
      amountOriginal: "335088.65",
      currencyOriginal: "CNY",
      currencyIcon: () => <span className="text-red-500 font-bold">¥</span>,
      amountUSD: "46,494.89",
      countryFlag: "🇨🇳",
      countryName: "China",
      paymentMethod: "Wallet",
      paymentIcon: Wallet,
    },
    {
      id: "don-3",
      donorName: "Jon Ruth",
      timeAgo: "1 hr ago",
      amountOriginal: "46,494.89",
      currencyOriginal: "USD",
      currencyIcon: () => <span className="font-bold">$</span>,
      amountUSD: "46,494.89",
      countryFlag: "🇺🇸",
      countryName: "United States",
      paymentMethod: "Bank Transfer",
      paymentIcon: BankIcon,
    },
    {
      id: "don-4",
      donorName: "Zoe Zhang",
      timeAgo: "3 hrs ago",
      amountOriginal: "721.12",
      currencyOriginal: "CNY",
      currencyIcon: () => <span className="text-red-500 font-bold">¥</span>,
      amountUSD: "100.00",
      countryFlag: "🇺🇸",
      countryName: "United States",
      paymentMethod: "Mastercard",
      paymentIcon: CreditCard,
    },
    {
      id: "don-5",
      donorName: "Anonymous",
      timeAgo: "06/12/25",
      amountOriginal: "46,500",
      currencyOriginal: "USDC",
      currencyIcon: CircleDollarSign,
      amountUSD: "46,494.89",
      countryFlag: "🇺🇸",
      countryName: "United States",
      paymentMethod: "Alipay",
      paymentIcon: () => <span className="font-bold text-blue-600">A</span>,
    },
    {
      id: "don-6",
      donorName: "Anonymous",
      timeAgo: "06/12/25",
      amountOriginal: "46,500",
      currencyOriginal: "USDC",
      currencyIcon: CircleDollarSign,
      amountUSD: "46,494.89",
      countryFlag: "🇨🇳",
      countryName: "China",
      paymentMethod: "Wallet",
      paymentIcon: Wallet,
    },
  ],
}
