import { MarkdownArticle } from '@/components/md-article';
import slugify from 'slugify';
import { KnowledgeBaseArticles } from '@/content';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/${slug}.md`);

  return (
    <MarkdownArticle>
      <Post />
    </MarkdownArticle>
  );
}

export function generateStaticParams() {
  return KnowledgeBaseArticles.map(item => ({
    slug: slugify(item, { lower: true, remove: /[*+~.()'"!:@]/g })
  }));
}

export const dynamicParams = false;
