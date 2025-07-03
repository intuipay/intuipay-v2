// This is now a SERVER COMPONENT by default
import type { Metadata, ResolvingMetadata } from 'next'
import ProjectDetailClientLayout from './project-detail-client-layout' // New Client Component
import { getProjectDetail, getProjects } from '@/lib/data'
import { ProjectCategories } from '@/data';

// Dynamic Metadata Generation for SEO
type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectDetail(slug)

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
  const project = await getProjectDetail(slug);
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
    },
  );

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

  return (
    <ProjectDetailClientLayout
      project={project}
      similarProjects={similarProjects}
      slug={slug}
    />
  )
}
