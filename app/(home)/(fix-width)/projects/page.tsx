import ProjectHomepage from '@/app/_components/projects/project-homepage';
import ProjectList, { ProjectListSkeleton } from '@/app/_components/projects/project-list';
import { Suspense } from 'react';

export const metadata = {
  title: 'Projects',
  description: 'Projects',
};

// Corrected type for searchParams in Next.js App Router
type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    order_by?: string;
    order_dir?: string;
    category?: string;
    progress?: string;
    location?: string;
    donationMethods?: string;
    projectType?: string;
    excludes?: string;
  }>
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const theSearchParams = await searchParams;
  const pageNumber = theSearchParams.page ? parseInt(theSearchParams.page) : 1;
  const pageSizeNumber = theSearchParams.pageSize ? parseInt(theSearchParams.pageSize) : 9;
  const search = theSearchParams.search;
  const orderBy = theSearchParams.order_by;
  const orderDir = theSearchParams.order_dir;

  // Extract filter parameters (will be passed as strings or undefined)
  const category = theSearchParams.category;
  const progress = theSearchParams.progress;
  const location = theSearchParams.location;
  const donationMethods = theSearchParams.donationMethods;
  const projectType = theSearchParams.projectType;
  const excludes = theSearchParams.excludes;

  const projectListKey = `${pageNumber}-${pageSizeNumber}-${search}-${orderBy}-${orderDir}-${category}-${progress}-${location}-${donationMethods}-${projectType}-${excludes}`;

  return (
    <ProjectHomepage
      initialSearch={search}
      initialOrderBy={orderBy}
      initialOrderDir={orderDir}
      initialCategory={category}
      initialProgress={progress}
      initialLocation={location}
      initialDonationMethods={donationMethods}
      initialProjectType={projectType}
      initialExcludes={excludes}
    >
      <Suspense key={projectListKey} fallback={<ProjectListSkeleton />}>
        <ProjectList
          page={pageNumber}
          pageSize={pageSizeNumber}
          search={search}
          order_by={orderBy}
          order_dir={orderDir}
          category={category}
          progress={progress}
          location={location}
          donationMethods={donationMethods}
          projectType={projectType}
          excludes={excludes}
        />
      </Suspense>
    </ProjectHomepage>
  );
}
