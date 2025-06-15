'use client'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { ProjectDataType } from '@/app/project/[slug]/project-data'

type CampaignTabProps = {
  project: Pick<
    ProjectDataType,
    'overview' | 'missionStatement' | 'whyDonate' | 'risksChallenges' | 'faqLink' | 'tags' | 'title'
  >
}

export function CampaignTab({ project }: CampaignTabProps) {
  return (
    <>
      <section id="overview" className="mb-8 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">Overview</h2>
        <p className="text-neutral-darkgray leading-relaxed mb-4">{project.overview}</p>
        <div className="bg-intuipay-lighterblue/30 aspect-video rounded-md p-4 mb-6 flex items-center justify-center">
          <p className="text-center text-neutral-darkgray">
            Placeholder for embedded content (e.g., video, interactive demo)
          </p>
        </div>
      </section>

      <section id="mission-statement" className="mb-8 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">Mission Statement</h2>
        <p className="text-neutral-darkgray leading-relaxed">{project.missionStatement}</p>
      </section>

      <section id="why-donate" className="mb-8 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">Why donate to {project.title}?</h2>
        <ul className="space-y-3">
          {project.whyDonate.map((item, index) => (
            <li key={index} className="text-neutral-darkgray leading-relaxed">
              <strong className="text-neutral-text">{item.title}:</strong> {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section id="risks-challenges" className="mb-8 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">Risks & Challenges</h2>
        <ul className="space-y-3">
          {project.risksChallenges.map((item, index) => (
            <li key={index} className="text-neutral-darkgray leading-relaxed">
              <strong className="text-neutral-text">{item.title}:</strong> {item.text}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-neutral-darkgray mb-8">
        Questions about this project?{' '}
        <Link href={project.faqLink} className="text-action-blue hover:underline">
          Check out the FAQ
        </Link>
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="font-normal text-neutral-darkgray border-neutral-mediumgray/70">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  )
}
