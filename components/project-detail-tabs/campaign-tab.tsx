'use client';

import Link from 'next/link';
import { marked } from 'marked';
import { Badge } from '@/components/ui/badge';
import type { ProjectInfo } from '@/types';

type CampaignTabProps = {
  project: ProjectInfo
}

export function CampaignTab({ project }: CampaignTabProps) {
  const tags = project.tags ? JSON.parse(project.tags) : [];
  const [introductionOfProject, riskAndChallenges] = project.campaign.split('<--! separator -->');


  return (
    <>
      <article>
        <h1 className='text-2xl font-semibold mb-6'>Introduction of project</h1>
        <section className="mb-13 scroll-mt-20 prose"
          dangerouslySetInnerHTML={{ __html: marked.parse(introductionOfProject) as string }}
        />

        <h1 className='text-2xl font-semibold mb-6'>Risks & Challenges</h1>
        <section className="mb-13 scroll-mt-20 prose"
          dangerouslySetInnerHTML={{ __html: marked.parse(riskAndChallenges) as string }}
        />
      </article>
      <div className="flex flex-wrap gap-4">
        {tags.map((tag: string) => (
          <Badge
            key={tag}
            variant="outline"
            className="font-normal text-neutral-darkgray border-neutral-mediumgray/70 text-sm py-1.5 px-3 rounded-3xl"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
}
