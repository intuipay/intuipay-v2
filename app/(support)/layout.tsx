import { SupportHeader } from '@/components/support-header';
import { SiteFooter } from '@/components/site-footer';
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
    <SupportHeader user={session?.user} />
    {children}
  </>;
}
