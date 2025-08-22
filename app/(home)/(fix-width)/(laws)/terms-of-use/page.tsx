import Content from '@/app/_components/laws/terms-of-use/content.md';
import { MarkdownArticle } from '@/components/md-article';

export default function RulesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <MarkdownArticle className="max-w-none">
        <Content />
      </MarkdownArticle>
    </div>
  );
}
