import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {OfficialArticles} from "@/types";

export default function SupportWhatsNew() {
  const updates: OfficialArticles[] = [];

  return (
    <section className="py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-12">What's new at Intuipay</h2>
      {updates.map((update, index) => (
        <>
          <article className="px-2">
            <h3 className="text-xl font-semibold mb-2">Dev Mode MCP Server in beta</h3>
            <div className="flex">
              <div className="pe-2 border-r me-2 border-black/20 text-link text-sm font-medium/5">March 21, 2024</div>
              <p className="text-gray-700 text-sm/5">
                Select a frame or node in the Figma desktop app and generate code from those...
              </p>
            </div>
          </article>
          {index < updates.length - 1 && <hr className="my-8 border-black/20" />}
        </>
      ))}
      <div className="flex justify-center mt-12">
        <Button
          asChild
          className="rounded-full px-8 h-10 text-base font-semibold"
        >
          <Link
            href="/updates"
          >View all updates</Link>
        </Button>
      </div>
    </section>
  );
}
