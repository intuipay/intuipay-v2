import { Metadata } from 'next';
import { getDonationProjectBySlug, getProjectDetail } from '@/lib/data';
import DonationPageComp from '@/app/_components/donate/donate-page';
import CrowdFundingPageComp from '@/app/_components/crowdfunding/donate-page';
import { notFound } from 'next/navigation';
import { ProjectTypes } from '@/data';

export const runtime = 'edge';

type Props = {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params
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
}: Props) {
  const slug = (await params).slug[ 0 ]; // 目前定义的是动态路由 ...slug，所以返回的是数组，要提取第一个元素
  const project = await getDonationProjectBySlug(slug);

  if (!project) {
    return notFound();
  }
  console.log('project', slug, project);

  const projectDetail = await getProjectDetail(slug);
  console.log('Project Detail:', projectDetail, slug);
  if (!projectDetail) {
    return notFound();
  }
  if (projectDetail.type === ProjectTypes.Crownfunding) {
    return <CrowdFundingPageComp
      project={projectDetail}
      slug={slug}
    />;
  }

  return <DonationPageComp
    project={project}
    slug={slug}
  />;
}
