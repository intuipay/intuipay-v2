import Link from 'next/link';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import slugify from 'slugify';
import { ActiveLink } from '@/components/view/active-link';
import { KnowledgeBaseArticles } from '@/content';

export default function DocsAndKnowledgeSidebar() {
  return (
    <>
      <div className="uppercase text-xs font-bold text-black/50 mb-4">Documentation</div>
      <div className="space-y-2.5">
        <ActiveLink
          activeClassName="bg-brand-blue-100/50"
          className="px-3 py-2 text-sm font-semibold flex items-center"
          href="/docs"
        >
          Getting started
        </ActiveLink>
      </div>
      <div className="uppercase text-xs font-bold text-black/50 my-4">Knowledge Space</div>
      <div className="space-y-2.5">
        {KnowledgeBaseArticles.map(item => <ActiveLink
          activeClassName="bg-brand-blue-100/50"
          className="px-3 py-2 text-sm font-semibold flex items-center"
          href={`/knowledge/${slugify(item, { lower: true, remove: /[*+~.()'"!:@]/g })}`}
          key={item}
        >{item}</ActiveLink>)}
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
    </>
  );
}
