export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Intuipay",
    url: "https://intuipay.com",
    logo: "https://intuipay.com/images/intuipay-logo.png",
    description:
      "Support global universities and pay tuition & make donation across borders — with speed, trust, and simplicity.",
    sameAs: ["https://twitter.com/intuipay", "https://www.linkedin.com/company/intuipay"],
    offers: {
      "@type": "Offer",
      name: "Global Education Payments",
      description: "Fast and secure international payments for education",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
