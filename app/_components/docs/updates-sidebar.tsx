import Link from 'next/link';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import { ActiveLink } from "@/components/view/active-link";

export default function UpdatesSidebar() {
  return <>
    <div className="uppercase text-xs font-bold text-black/50 mb-4">Announcements</div>
    <div className="space-y-2.5">
      <ActiveLink
        activeClassName="bg-brand-blue-100/50"
        className="px-3 h-9 text-sm font-semibold flex items-center"
        href="/updates/2025-08-announcements"
      >
        Aug 2025
      </ActiveLink>
    </div>
    <div className="uppercase text-xs font-bold text-black/50 my-4">Release notes</div>
    <div className="space-y-2.5">
      <ActiveLink
        activeClassName="bg-brand-blue-100/50"
        className="px-3 h-9 text-sm font-semibold flex items-center"
        href="/updates/2025-08-release-notes"
      >
        Aug 2025
      </ActiveLink>
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
