import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import {OfficialArticles} from "@/types";

export default function SupportKnowledgeSpace() {
  const articles: OfficialArticles[] = [
    {
      digest: 'Integrating a donation widget into your website is one of the most effective...',
      published_at: '',
      slug: 'how-to-embed-your-intuipay-donation-widget-on-any-website',
      title: 'How to Embed Your Intuipay Donation Widget on Any Website',
    },
    {
      digest: 'Cryptocurrency donations have exploded in popularity among American philanthropists, ...',
      published_at: '',
      slug: 'why-donate-in-crypto-tax-benefits-and-beyond-usa',
      title: 'Why Donate in Crypto: Tax Benefits and Beyond (USA)',
    },
    {
      digest: 'The global framework for cryptocurrency donations to charitable organizations is rapidly evolving, ...',
      published_at: '',
      slug: 'global-cryptocurrency-charity-landscape',
      title: 'Global Cryptocurrency Charity Landscape\n',
    }
  ];

  return (
    <section className="bg-background-gray py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-x-8 gap-y-12">
        <h2 className="col-span-3 text-3xl font-semibold">Knowledge Space</h2>
        {articles.map(article => (
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-6">{article.title}</h3>
            <p className="font-medium leading-normal mb-6">{article.digest}</p>
            <Button
              asChild
              className="w-min bg-background-gray border-black hover:bg-white rounded-full px-8 h-10 [&_svg]:size-6 gap-2.5 mt-auto text-base font-semibold"
              variant="outline"
            >
              <Link href={`/knowledge/${article.slug}`}>
                Learn more
                <ArrowUpRightIcon />
              </Link>
            </Button>
          </div>
        ))}
        <div className="col-span-3 flex justify-center">
          <Button
            asChild
            className="rounded-full px-8 h-10 text-base font-semibold"
          >
            <Link
              href="/knowledge"
            >View all articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
