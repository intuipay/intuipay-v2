import ProjectList from '@/app/_components/projects/project-list';
import { getProjectCount, getProjects } from '@/lib/data';

export const runtime = 'edge';

export const metadata = {
  title: 'Projects',
  description: 'Projects',
}

type Props = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
    search: string;
    order_by: string;
    order_dir: string;
  }>
};
export default async function ProjectsPage({ searchParams }: Props) {
  const { page, pageSize, search, order_by, order_dir } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;
  const pageSizeNumber = pageSize ? parseInt(pageSize) : 9;
  const [projects, total] = await Promise.all([
    getProjects(pageNumber, pageSizeNumber, search, order_by, order_dir),
    getProjectCount(),
  ]);

  return (
    <ProjectList
      data={projects}
      page={pageNumber}
      pageSize={pageSizeNumber}
      total={total}
    />
  )
}
