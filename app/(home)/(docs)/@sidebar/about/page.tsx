import Link from 'next/link';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';

export default function AboutSidebar() {
  return <>
    <div className="uppercase text-xs font-bold text-black/50 mb-4">What is Intuipay</div>
    <div>
      <Link
        className="px-3 h-9 bg-brand-blue-100/50 text-sm font-semibold flex items-center"
        href="/about"
      >
        About
      </Link>
    </div>
    <div className="mt-auto sticky bottom-8 space-y-4">
      <Link
        className="flex items-center gap-2 hover:text-blue-600 hover:underline"
        href="/updates"
      >
        <span className="text-sm font-semibold">Updates</span>
        <ArrowUpRightIcon className="size-4" />
      </Link>
      <Link
        className="flex items-center gap-2 hover:text-blue-600 hover:underline"
        href="/support"
      >
        <span className="text-sm font-semibold">Help</span>
        <ArrowUpRightIcon className="size-4" />
      </Link>
    </div>
  </>;
}
