// This is now a SERVER COMPONENT by default
import type { Metadata, ResolvingMetadata } from 'next'
import ProjectDetailClientLayout from '@/app/_components/projects/project-detail';
import { getProjectDetail, getProjects } from '@/lib/data'
import { ProjectCategories } from '@/data';

export const runtime = 'edge';


// Dynamic Metadata Generation for SEO
type Props = {
  params: Promise<{ id: string }>
}

// This is the main Server Component for the page
export default async function ProjectDetailPageServer({ params }: { params: { id: string } }) {
  const { id } = await params;
  const project = await getProjectDetail('preview', Number(id));

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
      id={Number(id)}
      project={project}
      slug="preview"
    />
  )
}
