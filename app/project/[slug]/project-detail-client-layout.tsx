"use client" // This is now the top-level CLIENT COMPONENT for this page's content

import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"

import { CampaignTab } from "@/components/project-detail-tabs/campaign-tab"
import { AboutTab } from "@/components/project-detail-tabs/about-tab"
import { UpdatesTab } from "@/components/project-detail-tabs/updates-tab"
import { DonationsTab } from "@/components/project-detail-tabs/donations-tab"

import type { ProjectDataType } from "./project-data"

type ProjectDetailClientLayoutProps = {
  project: ProjectDataType
  similarProjects: any[] // Define a more specific type if available
}

export default function ProjectDetailClientLayout({ project, similarProjects }: ProjectDetailClientLayoutProps) {
  const fundingPercentage = (project.funding.current / project.funding.goal) * 100

  const tocItems = [
    { id: "overview", label: "Overview" },
    { id: "mission-statement", label: "Mission Statement" },
    { id: "why-donate", label: `Why donate to ${project.title}?` }, // Made dynamic
    { id: "risks-challenges", label: "Risks & Challenges" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-neutral-white text-neutral-text">
      <SiteHeader />
      <main className="flex-grow py-8 md:py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{project.title}</h1>
            <p className="text-md sm:text-lg md:text-xl text-neutral-darkgray">{project.subtitle}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-2/3">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-6 shadow-lg">
                <Image
                  src={project.heroImageUrl || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority // Good for LCP element
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <PlayCircle className="w-16 h-16 text-white/80 hover:text-white cursor-pointer" />
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-darkgray mb-6">
                <span className="flex items-center">
                  <FlaskConical className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {project.category}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {project.location}
                </span>
                <span className="flex items-center">
                  <Landmark className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {project.projectType}
                </span>
                <span className="flex items-center">
                  <Coins className="w-4 h-4 mr-1.5 text-intuipay-blue" /> {project.donationAccepts}
                </span>
              </div>

              <Tabs defaultValue="campaign" className="mb-8">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                  <TabsTrigger value="campaign" className="py-2.5">
                    Campaign
                  </TabsTrigger>
                  <TabsTrigger value="about" className="py-2.5">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="updates" className="py-2.5 relative">
                    Updates
                    {project.updatesCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-action-blue text-white"
                      >
                        {project.updatesCount}
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
                  <AboutTab university={project.university} />
                </TabsContent>
                <TabsContent value="updates" className="pt-6">
                  <UpdatesTab updates={project.updates} />
                </TabsContent>
                <TabsContent value="donations" className="pt-6">
                  <DonationsTab donations={project.donations} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column (Sticky Sidebar) */}
            <div className="lg:w-1/3 lg:sticky lg:top-24 self-start">
              <div className="border border-neutral-mediumgray/50 rounded-lg p-6 space-y-6">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={project.university.logoUrl || "/placeholder.svg"} alt={project.university.name} />
                    <AvatarFallback>
                      <ShieldCheck className="w-5 h-5 text-intuipay-blue" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-lg">{project.university.name}</span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold mb-1">${project.funding.current.toLocaleString()}</p>
                  <p className="text-sm text-neutral-darkgray mb-2">
                    pledged of ${project.funding.goal.toLocaleString()} goal
                  </p>
                  <Progress value={fundingPercentage} className="h-2 [&>div]:bg-action-blue" />
                </div>
                <div className="flex justify-between text-center">
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold">{project.backers}</p>
                    <p className="text-xs text-neutral-darkgray">backers</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold">{project.daysLeft}</p>
                    <p className="text-xs text-neutral-darkgray">days left</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <Link
                    href={`mailto:${project.contact.email}`}
                    className="flex items-center text-neutral-darkgray hover:text-action-blue"
                  >
                    <Mail className="w-4 h-4 mr-2" /> {project.contact.email}
                  </Link>
                  <Link
                    href={project.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neutral-darkgray hover:text-action-blue"
                  >
                    <Link2 className="w-4 h-4 mr-2" /> {project.contact.website}{" "}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                  <Link
                    href={`https://github.com/${project.contact.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neutral-darkgray hover:text-action-blue"
                  >
                    <Github className="w-4 h-4 mr-2" /> {project.contact.github}{" "}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                  <Link
                    href={`https://twitter.com/${project.contact.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neutral-darkgray hover:text-action-blue"
                  >
                    <Twitter className="w-4 h-4 mr-2" /> @{project.contact.twitter}{" "}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
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
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Similar Projects</h2>
              <Button variant="default" asChild className="bg-neutral-text text-neutral-white hover:bg-neutral-text/90">
                <Link href="/projects?category=similar">Check more</Link>
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
