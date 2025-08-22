import { MarkdownArticle } from '@/components/md-article';
import slugify from 'slugify';
import { DocumentationArticles } from '@/content';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/docs/${slug}.md`);

  return (
    <MarkdownArticle>
      <Post />
    </MarkdownArticle>
  );
}
