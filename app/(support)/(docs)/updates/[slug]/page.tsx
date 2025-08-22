import { MarkdownArticle } from '@/components/md-article';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const [year, month, ...rest] = slug.split('-');
  const { default: Post } = await import(`@/content/${rest.join('-')}/${year}-${month}.md`);

  return (
    <MarkdownArticle>
      <Post />
    </MarkdownArticle>
  );
}
