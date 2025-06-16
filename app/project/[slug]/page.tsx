// This is now a SERVER COMPONENT by default
import type { Metadata, ResolvingMetadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import ProjectDetailClientLayout from './project-detail-client-layout' // New Client Component
import type { ProjectDataType } from './project-data'
import { getProjectDetail, getDonations, getUpdates, getUpdatesCount } from '@/lib/data'
import { Donations, Updates } from '@/types'

// Simulate fetching project data by slug (replace with actual data fetching)
async function getProjectDetailById(slug: string): Promise<ProjectDataType> {
  const detail = await getProjectDetail(slug)
  return detail
}

async function getDonationsById(projectId: string, page: number): Promise<Donations> {
  const donations = await getDonations(projectId, page)
  return donations
}
async function getUpdatesById(projectId: string, page: number): Promise<Updates> {
  const updates = await getUpdates(projectId, page)
  return updates
}
async function getUpdatesCountById(projectId: string): Promise<any> {
  const updateCount = await getUpdatesCount(projectId)
  return updateCount
}

// Simulate fetching similar projects (replace with actual logic)
async function getSimilarProjects(currentProjectSlug: string): Promise<any[]> {
  // Filter out the current project or fetch genuinely similar ones
  return [
    {
      id: 'quantumleap-ai', // Example, ensure this is not the current project
      slug: 'quantumleap-ai',
      title: 'QuantumLeap AI',
      description:
        'Developing next-generation AI algorithms using quantum computing principles for complex problem solving.',
      universityName: 'ArtCenter College',
      imageUrl: '/placeholder-xg1ua.png',
      totalRaised: 876543.21,
    },
    {
      id: 'biosynth-ethics',
      slug: 'biosynth-ethics',
      title: 'BioSynth Ethics',
      description: 'Exploring the ethical implications of synthetic biology and AI in creating novel life forms.',
      universityName: 'UCLA',
      imageUrl: '/placeholder-qtpze.png',
      totalRaised: 500000.0,
    },
    {
      id: 'ai-climate-model',
      slug: 'ai-climate-model',
      title: 'AI Climate Model',
      description: 'Advanced AI modeling for predicting climate change impacts with higher accuracy.',
      universityName: 'Stanford University',
      imageUrl: '/abstract-climate-change-ai-model-4.png',
      totalRaised: 750000.0,
    },
  ].filter((p) => p.slug !== currentProjectSlug) // Basic filter
}

// Dynamic Metadata Generation for SEO
type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectDetailById(id)

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
  const similarProjects = await getSimilarProjects(slug) // TODO
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
      <div className="flex flex-col min-h-screen bg-neutral-white text-neutral-text">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-lg text-neutral-darkgray">
              Sorry, we couldn&apos;t find the project you&apos;re looking for.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return <ProjectDetailClientLayout project={project} similarProjects={similarProjects} donations={donations} updates={updates} updatesCount={updatesCount} />
}
