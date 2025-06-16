// This is now a SERVER COMPONENT by default
import type { Metadata, ResolvingMetadata } from 'next'
import ProjectDetailClientLayout from './project-detail-client-layout' // New Client Component
import { getProjectDetail, getDonations, getUpdates, getUpdatesCount, getProjects } from '@/lib/data'
import { Donations, ProjectInfo, Updates } from '@/types'
import { ProjectCategories } from '@/data';

export const runtime = 'edge';

// Simulate fetching project data by slug (replace with actual data fetching)
// 异步函数，根据slug获取项目详情
async function getProjectDetailById(slug: string): Promise<ProjectInfo> {
  // 调用getProjectDetail函数，传入slug参数，获取项目详情
  const detail = await getProjectDetail(slug)
  // 返回项目详情
  return detail
}

async function getDonationsById(projectId: number, page: number): Promise<Donations> {
  const donations = await getDonations(projectId, page)
  return donations
}
async function getUpdatesById(projectId: number, page: number): Promise<Updates> {
  const updates = await getUpdates(projectId, page)
  return updates
}
async function getUpdatesCountById(projectId: number): Promise<any> {
  const updateCount = await getUpdatesCount(projectId)
  return updateCount
}


// Dynamic Metadata Generation for SEO
type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetailById(slug)

  if (!project) {
    // Optionally, return metadata for a "not found" page
    return {
      title: 'Project Not Found',
      description: 'The project you are looking for does not exist.',
    }
  }

  return {
    title: `${project.project_name} | Intuipay`,
    description: project.description,
    openGraph: {
      title: project.project_name,
      description: project.description,
      images: [
        {
          url: project.banner || '/hero-image.jpeg', // Ensure you have a fallback
          width: 1200,
          height: 630,
          alt: project.project_name,
        },
      ],
      type: 'article', // Or 'website' depending on the content
    },
    // You can add more metadata here (twitter cards, etc.)
  }
}

// This is the main Server Component for the page
export default async function ProjectDetailPageServer({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const project = await getProjectDetailById(slug)
  const donations: Donations = await getDonationsById(project.id, 1)
  const similarProjects = await getProjects(
    1,
    3,
    '',
    'id',
    'desc',
    {
      category: project.category as ProjectCategories,
      progress: 0,
      location: '',
      donationMethods: 0,
      projectType: 0,
      excludes: project.id,
     });
  console.log('similarProjects: ', similarProjects);
  const updates = await getUpdatesById(project.id, 1)
  console.log('updates: ', updates);
  const updatesCount = await getUpdatesCountById(project.id)
  console.log('updatesCount: ', updatesCount);

  if (!project) {
    // Handle project not found (e.g., return a 404 page or a specific component)
    // For Next.js App Router, you can use the `notFound()` function from `next/navigation`
    // import { notFound } from 'next/navigation';
    // notFound();
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-lg text-neutral-darkgray">
          Sorry, we couldn&apos;t find the project you&apos;re looking for.
        </p>
      </div>
    )
  }

  return <ProjectDetailClientLayout project={project} similarProjects={similarProjects} donations={donations} updates={updates} updatesCount={updatesCount} />
}
