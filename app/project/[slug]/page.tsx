// This is now a SERVER COMPONENT by default
import type { Metadata, ResolvingMetadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import ProjectDetailClientLayout from "./project-detail-client-layout" // New Client Component
import { projectData as mockProjectData } from "./project-data-mock" // Mock data source
import type { ProjectDataType } from "./project-data"

// Simulate fetching project data by slug (replace with actual data fetching)
async function getProjectBySlug(slug: string): Promise<ProjectDataType | null> {
  // In a real app, you'd fetch from your database or API
  // For now, we'll find it in the mock data if the slug matches, otherwise return the first mock.
  // This is a very basic simulation.
  if (mockProjectData.slug === slug) {
    return mockProjectData
  }
  // Fallback or error handling if slug not found
  // For this example, let's return the default mock if no specific slug matches
  // or handle it as 'not found' in a real scenario.
  // For now, we'll just return the mockProjectData as if it's the one for any slug.
  // You should implement proper slug-based fetching.
  console.warn(
    `Mock data fetching: Returning default project for slug "${slug}". Implement actual slug-based fetching.`,
  )
  return mockProjectData
}

// Simulate fetching similar projects (replace with actual logic)
async function getSimilarProjects(currentProjectSlug: string): Promise<any[]> {
  // Filter out the current project or fetch genuinely similar ones
  return [
    {
      id: "quantumleap-ai", // Example, ensure this is not the current project
      slug: "quantumleap-ai",
      title: "QuantumLeap AI",
      description:
        "Developing next-generation AI algorithms using quantum computing principles for complex problem solving.",
      universityName: "ArtCenter College",
      imageUrl: "/placeholder-xg1ua.png",
      totalRaised: 876543.21,
    },
    {
      id: "biosynth-ethics",
      slug: "biosynth-ethics",
      title: "BioSynth Ethics",
      description: "Exploring the ethical implications of synthetic biology and AI in creating novel life forms.",
      universityName: "UCLA",
      imageUrl: "/placeholder-qtpze.png",
      totalRaised: 500000.0,
    },
    {
      id: "ai-climate-model",
      slug: "ai-climate-model",
      title: "AI Climate Model",
      description: "Advanced AI modeling for predicting climate change impacts with higher accuracy.",
      universityName: "Stanford University",
      imageUrl: "/abstract-climate-change-ai-model-4.png",
      totalRaised: 750000.0,
    },
  ].filter((p) => p.slug !== currentProjectSlug) // Basic filter
}

// Dynamic Metadata Generation for SEO
type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug
  const project = await getProjectBySlug(slug)

  if (!project) {
    // Optionally, return metadata for a "not found" page
    return {
      title: "Project Not Found",
      description: "The project you are looking for does not exist.",
    }
  }

  return {
    title: `${project.title} | Intuipay`,
    description: project.subtitle || project.overview.substring(0, 160), // Use subtitle or truncated overview
    openGraph: {
      title: project.title,
      description: project.subtitle || project.overview.substring(0, 160),
      images: [
        {
          url: project.heroImageUrl || "/hero-image.jpeg", // Ensure you have a fallback
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: "article", // Or 'website' depending on the content
    },
    // You can add more metadata here (twitter cards, etc.)
  }
}

// This is the main Server Component for the page
export default async function ProjectDetailPageServer({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  const similarProjects = await getSimilarProjects(params.slug)

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

  return <ProjectDetailClientLayout project={project} similarProjects={similarProjects} />
}
