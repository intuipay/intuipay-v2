import Link from 'next/link';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';

export default function UpdatesSidebar() {
  return <>
    <div className="uppercase text-xs font-bold text-black/50 mb-4">Announcements</div>
    <div className="space-y-2.5">
      <Link
        className="px-3 h-9 bg-brand-blue/50 text-sm font-semibold flex items-center"
        href="/about"
      >
        About
      </Link>
    </div>
    <div className="uppercase text-xs font-bold text-black/50 my-4">Release notes</div>
    <div className="space-y-2.5">
      <Link
        className="px-3 h-9 bg-brand-blue/50 text-sm font-semibold flex items-center"
        href="/about"
      >
        About
      </Link>
    </div>
    <div className="mt-auto sticky bottom-8 space-y-4">
      <Link
        className="flex items-center gap-2 text-black/50 hover:text-blue-600 hover:underline"
        href="/docs"
      >
        <span className="text-xs font-bold uppercase">Get started</span>
        <ArrowUpRightIcon className="size-4" />
      </Link>
      <Link
        className="flex items-center gap-2 text-black/50 hover:text-blue-600 hover:underline"
        href="/knowledge"
      >
        <span className="text-xs font-bold uppercase">Documentation</span>
        <ArrowUpRightIcon className="size-4" />
      </Link>
      <Link
        className="flex items-center gap-2 text-black/50 hover:text-blue-600 hover:underline"
        href="/support"
      >
        <span className="text-xs font-bold uppercase">Help</span>
        <ArrowUpRightIcon className="size-4" />
      </Link>
    </div>
  </>;
}
