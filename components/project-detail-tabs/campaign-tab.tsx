'use client'

import Link from 'next/link'
import { marked } from 'marked'
import { Badge } from '@/components/ui/badge'
import type { ProjectDataType } from '@/app/project/[slug]/project-data'

type CampaignTabProps = {
  project: ProjectDataType
}

export function CampaignTab({ project }: CampaignTabProps) {
  return (
    <>
      <article id="overview" className="mb-8 scroll-mt-20 prose"
        dangerouslySetInnerHTML={{ __html: marked.parse(project.campaign) }}
      />
      <p className="text-sm text-neutral-darkgray mb-13 mt-5">
        Questions about this project?{' '}
        <Link href='/faq' className="text-action-blue hover:underline">
          Check out the FAQ
        </Link>
      </p>

      <div className="flex flex-wrap gap-4">
        {Array.isArray(project.tags) && project.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="font-normal text-neutral-darkgray border-neutral-mediumgray/70 text-sm">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  )
}
