import { LegalPageMarkdown } from '@/components/legal-page-markdown';
import content from '@/app/_components/laws/privacy-policy/content.md';

export default function RulesPage() {
  return <LegalPageMarkdown content={content} />;
}
