import Post from '@/app/_components/laws/privacy-policy/content.md';
import { MarkdownArticle } from '@/components/md-article';

export default function RulesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <MarkdownArticle className="max-w-none">
        <Post />
      </MarkdownArticle>
    </div>
  );
}
