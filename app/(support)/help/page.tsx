import { MagicWandIcon } from '@phosphor-icons/react/dist/ssr';
import { SiteFooter } from '@/components/site-footer';

export default function HelpPage() {
  return <>
    <main className="flex-1 flex flex-col justify-center items-center text-black/50">
      <MagicWandIcon size={64} className="mb-4" />
      <p className="text-sm">Working in progress</p>
    </main>
    <SiteFooter hasDivider />
  </>;
}
