import ProjectList from '../_components/projects/project-list';
import { getProjectCount, getProjects } from '@/lib/data';

export const metadata = {
  title: 'Projects',
  description: 'Projects',
}

type Props = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>
};
export default async function ProjectsPage({ searchParams }: Props) {
  const { page, pageSize } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;
  const pageSizeNumber = pageSize ? parseInt(pageSize) : 9;
  const [projects, total] = await Promise.all([
    getProjects(pageNumber, pageSizeNumber),
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
