import SupportHeroSection from '@/app/_components/support/hero-section';
import SupportFeatures from '@/app/_components/support/features';
import SupportWhatsNew from '@/app/_components/support/whats-new';
import SupportKnowledgeSpace from '@/app/_components/support/knowledge-space';
import SupportNeedMore from '@/app/_components/support/need-more';
import { SiteFooter } from '@/components/site-footer';

export default function SupportHome() {
  return <>
    <main className="flex-1">
      <SupportHeroSection />
      <SupportFeatures />
      <SupportWhatsNew />
      <SupportKnowledgeSpace />
      <SupportNeedMore />
    </main>
    <SiteFooter />
  </>;
}
