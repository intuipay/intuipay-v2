'use client'

import Link from 'next/link'
import { marked } from 'marked'
import { Badge } from '@/components/ui/badge'
import type { ProjectInfo } from '@/types'

type CampaignTabProps = {
  project: ProjectInfo
}

export function CampaignTab({ project }: CampaignTabProps) {
  const tags = project.tags ? JSON.parse(project.tags) : [];
  return (
    <>
      <article className="mb-8 scroll-mt-20 prose"
        dangerouslySetInnerHTML={{ __html: marked.parse(project.campaign) as string }}
      />
      <p className="text-neutral-darkgray mb-13 mt-5">
        Questions about this project?{' '}
        <Link href='/faq' className="text-action-blue underline hover:no-underline">
          Check out the FAQ
        </Link>
      </p>
      <div className="flex flex-wrap gap-4">
        {tags.map((tag: string) => (
          <Badge
            key={tag}
            variant="outline"
            className="font-normal text-neutral-darkgray border-neutral-mediumgray/70 text-sm py-1.5 px-3"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </>
  )
}
