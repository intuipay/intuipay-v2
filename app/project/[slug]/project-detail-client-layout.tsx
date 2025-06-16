'use client' // This is now the top-level CLIENT COMPONENT for this page's content

import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  FlaskConical,
  MapPin,
  Landmark,
  Coins,
  PlayCircle,
  Mail,
  Link2,
  Github,
  Twitter,
  ShieldCheck,
  ExternalLink,
  Icon,
} from 'lucide-react'

import { CampaignTab } from '@/components/project-detail-tabs/campaign-tab'
import { AboutTab } from '@/components/project-detail-tabs/about-tab'
import { UpdatesTab } from '@/components/project-detail-tabs/updates-tab'
import { DonationsTab } from '@/components/project-detail-tabs/donations-tab'

import type { ProjectDataType } from './project-data'
import { Donations, ProjectInfo, Updates } from '@/types'
import { useMemo } from 'react'
import { enumToKeyLabel } from '@/lib/utils'
import { ProjectCategories, ProjectTypes } from '@/data'
import { ProjectDonationMethods } from '@/data'

type ProjectDetailClientLayoutProps = {
  project: ProjectDataType
  similarProjects: ProjectInfo[]
  donations: Donations
  updates: Updates
  updatesCount: number
}

export default function ProjectDetailClientLayout({ project, similarProjects, donations, updates, updatesCount }: ProjectDetailClientLayoutProps) {
  const isMovie = project.banner.includes('youtube.com') || project.banner.includes('youtu.be');
  const socialLinks = project.social_links ? JSON.parse(project.social_links as string) : {};

  const tocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'mission-statement', label: 'Mission Statement' },
    { id: 'why-donate', label: `Why donate to ${project.project_name}?` }, // Made dynamic
    { id: 'risks-challenges', label: 'Risks & Challenges' },
  ]

  const daysLeft = useMemo(() => Math.floor((new Date(project.end_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)), [project])

  return (
    <div className="flex flex-col min-h-screen bg-neutral-white text-neutral-text">
      <SiteHeader />
      <main className="w-full max-w-7xl mx-auto px-12 md:px-10 flex-grow py-20">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{project.project_name}</h1>
            <p className="text-black text-md sm:text-lg md:text-xl text-neutral-darkgray">{project.description}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-2/3">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-6 shadow-lg">
                <Image
                  src={project.banner || '/placeholder.svg'}
                  alt={project.project_name}
                  fill
                  className="object-cover"
                  priority // Good for LCP element
                />
                {isMovie && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayCircle className="w-16 h-16 text-white/80 hover:text-white cursor-pointer" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-darkgray mb-6">
                <span className="flex items-center">
                  <FlaskConical className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {enumToKeyLabel(ProjectCategories)[ project.category ]}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {project.location}
                </span>
                <span className="flex items-center">
                  <Landmark className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {enumToKeyLabel(ProjectTypes)[ project.type ]}
                </span>
                <span className="flex items-center">
                  <Coins className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {enumToKeyLabel(ProjectDonationMethods)[ project.accepts ]}
                </span>
              </div>

              <Tabs defaultValue="campaign" className="mb-8">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="campaign" className="py-2.5">
                    Campaign
                  </TabsTrigger>
                  <TabsTrigger value="about" className="py-2.5">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="updates" className="py-2.5 relative">
                    Updates
                    {updatesCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-action-blue text-white"
                      >
                        {updatesCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="donations" className="py-2.5">
                    Donations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="campaign" className="pt-6">
                  <CampaignTab project={project} />
                </TabsContent>
                <TabsContent value="about" className="pt-6">
                  <AboutTab project={project} />
                </TabsContent>
                <TabsContent value="updates" className="pt-6">
                  <UpdatesTab updates={updates} />
                </TabsContent>
                <TabsContent value="donations" className="pt-6">
                  <DonationsTab donations={donations} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column (Sticky Sidebar) */}
            <div className="lg:w-1/3 lg:sticky lg:top-24 self-start">
              <div className="border border-neutral-mediumgray/50 rounded-lg p-6 space-y-6">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={project.org_logo || '/placeholder.svg'} alt={project.org_name} />
                    <AvatarFallback>
                      <ShieldCheck className="w-5 h-5 text-intuipay-blue" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-lg">{project.org_name}</span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold mb-2">${project.amount.toLocaleString() || 0}</p>
                  <p className="text-sm text-neutral-darkgray mb-2">
                    pledged of ${project.goal_amount.toLocaleString()}
                  </p>
                  <Progress
                    value={parseInt(project.amount)}
                    max={parseInt(project.goal_amount)}
                    className="h-2 [&>div]:bg-action-blue"
                  />
                </div>
                <div className="flex text-center">
                  <div className='flex-1 text-left'>
                    <p className="text-xl sm:text-2xl font-semibold">{project.backers}</p>
                    <p className="text-xs text-neutral-darkgray">backers</p>
                  </div>
                  <div className='flex-1 text-left'>
                    <p className="text-xl sm:text-2xl font-semibold">{daysLeft}</p>
                    <p className="text-xs text-neutral-darkgray">days left</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm grid grid-cols-2">
                  <Link
                    href={`mailto:${project.email}`}
                    className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                  >
                    <Mail className="w-4 h-4" /> <span className="text-blue-btn">{project.email}</span>
                  </Link>
                  <Link
                    href={project.website || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                  >
                    <Link2 className="w-4 h-4" /> <span className="text-blue-btn">{project.website}</span>
                  </Link>
                  {project.github && <Link
                    href={`https://github.com/${project.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                  >
                    <Github className="w-4 h-4" /> <span className="text-blue-btn">{project.github}</span>
                    {project.github && <ExternalLink className="w-3 h-3 ml-1" />}
                  </Link>}
                  {
                    socialLinks && (
                      Object.entries(socialLinks).map(([key, value]) => (
                        <Link
                          href={value as string}
                          key={key}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                        >
                          <Image
                            className="size-3.5"
                            src={`/images/logos/${key === 'Twitter' ? 'x' : key.toLowerCase()}.svg`}
                            alt={key}
                            width={14}
                            height={14}
                            loading="lazy"
                          />
                          <span className="text-blue-btn">{key}</span>
                        </Link>
                      ))
                    )
                  }
                </div>
                <Button size="lg" className="w-full bg-action-blue hover:bg-action-blue/90 text-base py-3">
                  Donate Now
                </Button>
                <div className="pt-4 border-t border-neutral-mediumgray/30">
                  <ul className="space-y-2">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-neutral-darkgray hover:text-action-blue hover:underline"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-16 pt-12 border-t border-neutral-mediumgray/50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl">Similar Projects</h2>
              <Button variant="default" className="bg-neutral-text hover:bg-neutral-text/90">
                <Link href="/projects?category=similar" className='bg-black text-white text-xl py-3 px-6 rounded-lg'>Check more</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {similarProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
