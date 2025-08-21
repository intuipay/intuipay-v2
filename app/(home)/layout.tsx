import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return <>
    <SiteHeader user={session?.user} />
    {children}
  </>;
}
