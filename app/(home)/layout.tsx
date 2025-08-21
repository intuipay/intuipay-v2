import { SiteHeader } from '@/components/site-header';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return <>
    <SiteHeader user={session?.user} />
    {children}
  </>;
}
