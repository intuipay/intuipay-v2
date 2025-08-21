import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';

export default function SupportKnowledgeSpace() {
  return (
    <section className="bg-background-gray py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-x-8 gap-y-12">
        <h2 className="col-span-3 text-3xl font-semibold">Knowledge Space</h2>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-6">Dev Mode MCP Server in beta</h3>
          <p className="font-medium leading-normal mb-6">Select a frame or node in the Figma desktop app and generate code from those...</p>
          <Button
            asChild
            className="w-min bg-background-gray border-black hover:bg-white rounded-full px-8 h-10 [&_svg]:size-6 gap-2.5 mt-auto text-base font-semibold"
            variant="outline"
          >
            <Link href="#">
              Learn more
              <ArrowUpRightIcon />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-6">Dev Mode MCP Server in beta</h3>
          <p className="font-medium leading-normal mb-6">Select a frame or node in the Figma desktop app and generate code from those...</p>
          <Button
            asChild
            className="w-min bg-background-gray border-black hover:bg-white rounded-full px-8 h-10 [&_svg]:size-6 gap-2.5 mt-auto text-base font-semibold"
            variant="outline"
          >
            <Link href="#">
              Learn more
              <ArrowUpRightIcon />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-6">Dev Mode MCP Server in beta</h3>
          <p className="font-medium leading-normal mb-6">Select a frame or node in the Figma desktop app and generate code from those...</p>
          <Button
            asChild
            className="w-min bg-background-gray border-black hover:bg-white rounded-full px-8 h-10 [&_svg]:size-6 gap-2.5 mt-auto text-base font-semibold"
            variant="outline"
          >
            <Link href="#">
              Learn more
              <ArrowUpRightIcon />
            </Link>
          </Button>
        </div>
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
