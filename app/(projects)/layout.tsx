import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'


export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex flex-col min-h-screen bg-neutral-white text-neutral-text">
      <SiteHeader />
      <main className="w-full max-w-7xl mx-auto flex-grow px-12 md:px-10 py-20 sm:py-20">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
