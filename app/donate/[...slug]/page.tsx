import { Metadata } from 'next';
import { getDonationProjectBySlug, getProjectDetail } from '@/lib/data';
import DonationPageComp from '@/app/_components/donate/donate-page';
import CrowdFundingPageComp from '@/app/_components/crowdfunding/donate-page';
import { notFound } from 'next/navigation';
import BackButton from '@/components/back-button';
import type React from 'react';
import { ProjectTypes } from '@/data';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string; reward_id?: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const slug = (await params).slug[ 0 ];
  const project = await getDonationProjectBySlug(slug);
  if (!project) {
    return {
      title: 'Donation Project Not Found',
      description: 'The requested donation project does not exist.',
    };
  }

  return {
    title: project.project_name,
    description: project.description,
    openGraph: {
      title: `Donate to ${project.project_name}`,
      description: project.description,
      images: [
        {
          url: project.banner,
          width: 1200,
          height: 630,
          alt: project.project_name,
        },
      ],
    },
  };
}

export default async function DonatePage({
  params,
  searchParams,
}: Props) {
  const slug = (await params).slug[ 0 ]; // 目前定义的是动态路由 ...slug，所以返回的是数组，要提取第一个元素
  const resolvedSearchParams = await searchParams;
  const isPreview = !!resolvedSearchParams.preview;
  const project = await getProjectDetail(slug);
  const pageTitle = project?.project_name || 'Support';

  if (!project) {
    return notFound();
  }

  if (project.type === ProjectTypes.Crownfunding) {
    return <>
      <header className="flex items-center justify-between px-8 sm:px-30 py-4 bg-white lg:bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <BackButton className="hidden" />
          <div>
            <p className="text-sm text-gray-600">Pledging to</p>
            <p className="font-medium text-gray-900 truncate">{pageTitle}</p>
          </div>
        </div>
      </header>
      <CrowdFundingPageComp
        project={project}
        slug={slug}
        defaultSelectedRewardId={resolvedSearchParams.reward_id as string | undefined}
      />
    </>;
  }

  return <>
    {!isPreview && <header className="flex items-center justify-between px-8 sm:px-30 py-4 bg-white lg:bg-gray-50 border-b">
      <div className="flex items-center gap-3">
        <BackButton className="hidden" />
        <div>
          <p className="text-sm text-gray-600">Donating to</p>
          <p className="font-medium text-gray-900 truncate">{pageTitle}</p>
        </div>
      </div>
    </header>}

    <DonationPageComp
      isPreview={isPreview}
      project={project}
      slug={slug}
    />
  </>;
}
