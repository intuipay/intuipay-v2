import { Metadata } from 'next';
import { getDonationProjectBySlug } from '@/lib/data';
import DonationPageComp from '@/app/_components/donate/donate-page';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata> {
  const slug = (await params).slug;
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
      title: project.project_name,
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
  const slug = (await params).slug;
  const project = await getDonationProjectBySlug(slug);

  if (!project) {
    return notFound();
  }

  return <DonationPageComp
    project={project}
    slug={slug}
  />;
}
