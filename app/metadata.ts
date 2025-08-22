import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'Intuipay - Where Global Education Meets Next-Gen Payments',
    template: '%s | Intuipay',
  },
  description:
    'Support global universities and pay tuition & make donation across borders — with speed, trust, and simplicity.',
  keywords: [
    'global education',
    'international payments',
    'tuition payments',
    'cross-border payments',
    'education finance',
  ],
  authors: [{ name: 'Intuipay' }],
  creator: 'Intuipay',
  publisher: 'Intuipay',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://intuipay.xyz',
    title: 'Intuipay - Where Global Education Meets Next-Gen Payments',
    description:
      'Support global universities and pay tuition & make donation across borders — with speed, trust, and simplicity.',
    siteName: 'Intuipay',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Intuipay - Global Education Payments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intuipay - Where Global Education Meets Next-Gen Payments',
    description:
      'Support global universities and pay tuition & make donation across borders — with speed, trust, and simplicity.',
    images: ['/images/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://intuipay.xyz',
  },
};
