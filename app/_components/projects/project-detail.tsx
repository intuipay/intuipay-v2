'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EnvelopeIcon, LinkIcon, GithubLogoIcon, PlayCircleIcon } from '@phosphor-icons/react';

import { CampaignTab } from '@/components/project-detail-tabs/campaign-tab';
import { AboutTab } from '@/components/project-detail-tabs/about-tab';
import { UpdatesTab } from '@/components/project-detail-tabs/updates-tab';
import { DonationsTab } from '@/components/project-detail-tabs/donations-tab';
import { RewardsTab } from '@/components/project-detail-tabs/rewards-tab';

import { ProjectInfo, RewardDraft } from '@/types';
import { useMemo, useState } from 'react';
import { enumToKeyLabel } from '@/lib/utils';
import { ProjectCategories, ProjectTypes } from '@/data';
import { ProjectDonationMethods } from '@/data';


type ProjectDetailClientLayoutProps = {
  id?: number;
  project: ProjectInfo;
  similarProjects?: ProjectInfo[];
  slug: string;
}

export default function ProjectDetailClientLayout({
  id,
  project,
  similarProjects = [],
  slug,
}: ProjectDetailClientLayoutProps) {
  const isMovie = project.banner.includes('youtube.com') || project.banner.includes('youtu.be');

  function formatSocialLinks(socialLinks: Record<string, string> | string, name = '') {
    const domainReg = /^https?:\/\//;
    if (typeof socialLinks === 'string') { // process github
      if (!socialLinks) return '';
      socialLinks = socialLinks.replace('@', '');
      if (!domainReg.test(socialLinks)) {
        socialLinks = `https://www.${name}.com/${socialLinks}`;
      }
    } else { // process social_links
      for (const key in socialLinks) {
        const isTikTok = key.toLocaleLowerCase() === 'tiktok';
        const isLinkedIn = key.toLocaleLowerCase() === 'linkedin';
        const isTelegram = key.toLocaleLowerCase() === 'telegram';

        if (socialLinks.hasOwnProperty(key)) {
          if (!socialLinks[ key ] || socialLinks[ key ].trim() === '') {
            continue;
          }
          if (!isTikTok && socialLinks[ key ].startsWith('@')) { // tiktok is a special case
            socialLinks[ key ] = socialLinks[ key ].replace('@', '');
          }

          if (!domainReg.test(socialLinks[ key ])) {
            if (isLinkedIn && !socialLinks[ key ].startsWith('school')) {
              socialLinks[ key ] = `school/${socialLinks[ key ]}`;
            }
            socialLinks[ key ] = `https://www.${key.toLowerCase()}.com/${isTikTok && !socialLinks[ key ].includes('@') ? '@' + socialLinks[ key ] : socialLinks[ key ]}`;
          }

          if (isTelegram && socialLinks[ key ]) {
            socialLinks[ key ] = `https://t.me/${socialLinks[ key ]}`;
          }
        }
      }
    }
    return socialLinks;
  }
  const socialLinks = formatSocialLinks(project.social_links ? JSON.parse(project.social_links as string) : {});
  const [tab, setTab] = useState('campaign');
  const [updatesCount, setUpdatesCount] = useState(0);

  function extractSecondLevelHeadings(markdownString: string) {
    //匹配二级标题
    const regex = /^#{2,3}\s+(.+)/gm;
    let match;
    const headings = [];

    while ((match = regex.exec(markdownString)) !== null) {
      const boldPattern = /\*\*(.*?)\*\*/gm;
      const matchedTitle = match[ 1 ];
      const processedTitle = matchedTitle.replace(boldPattern, '$1');
      headings.push(processedTitle);
    }

    return headings;
  }
  const titles = extractSecondLevelHeadings(project.campaign);

  const daysLeft = useMemo(() => Math.floor((new Date(project.end_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)), [project]);

  const rewards = useMemo(() => {
    return project.rewards ? JSON.parse(project.rewards) : [];
  }, [project]);

  return (
    <div className="container">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-4">{project.project_name}</h1>
        <p className="text-xl text-black/60">{project.project_subtitle || project.description}</p>
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
                <PlayCircleIcon size={64} className="w-16 h-16 text-white/80 hover:text-white cursor-pointer" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-darkgray mb-6">
            <span className="flex items-center">
              <Image src='/images/project/FlaskConical.svg' alt="FlaskConical" className="w-4 h-4 mr-1.5" width={16} height={16} /> {enumToKeyLabel(ProjectCategories)[ project.category ]}
            </span>
            <span className="flex items-center">
              <Image src='/images/project/MapPin.svg' alt="MapPin" className="w-4 h-4 mr-1.5" width={16} height={16} /> {project.location}
            </span>
            <span className="flex items-center">
              <Image src='/images/project/Landmark.svg' alt="Landmark" className="w-4 h-4 mr-1.5" width={16} height={16} /> {enumToKeyLabel(ProjectTypes)[ project.type ]}
            </span>
            <span className="flex items-center">
              <Image src='/images/project/Coin.svg' alt="Coin" className="w-4 h-4 mr-1.5" width={16} height={16} /> {enumToKeyLabel(ProjectDonationMethods)[ project.accepts ]}
            </span>
          </div>
        </div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 self-start">
          <div className="border border-neutral-mediumgray/50 rounded-lg p-6 space-y-6">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                {
                  project.org_logo ?
                  <AvatarImage src={project.org_logo} alt={project.org_name} /> :
                  <AvatarFallback>
                    {project.org_name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                }

              </Avatar>
              <span className="font-semibold text-lg truncate">{project.org_name}</span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold mb-2">${project.amount.toLocaleString() || 0}</p>
              <p className="text-sm text-neutral-darkgray mb-2">
                pledged of ${(project.goal_amount / 100).toLocaleString()}
              </p>
              <Progress
                value={project.amount}
                max={project.goal_amount}
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
            <div className="text-sm grid grid-cols-2 gap-4">
              {project.email && (
                <Link
                  href={`mailto:${project.email}`}
                  className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                >
                  <EnvelopeIcon size={16} /> <span className="truncate text-primary">{project.email}</span>
                </Link>
              )}
              {project.website && (
                <Link
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                >
                  <LinkIcon size={16} /> <span className="truncate text-primary">{project.website.replace(/^https?:\/\//, '')}</span>
                </Link>
              )}
              {project.github && (
                <Link
                  href={formatSocialLinks(project.github, 'github')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                >
                  <GithubLogoIcon size={16} /> <span className="truncate text-primary">{project.github}</span>
                </Link>
              )}
              {socialLinks && Object.entries(socialLinks).map(([key, value]) => 
                value && (
                  <Link
                    href={value}
                    key={key}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-neutral-darkgray hover:text-action-blue"
                  >
                    <Image
                      className="size-3.5"
                      src={`/images/logos/${key.toLowerCase() === 'twitter' ? 'x' : key.toLowerCase()}.svg`}
                      alt={key}
                      width={14}
                      height={14}
                      loading="lazy"
                    />
                    <span className="truncate text-primary">{key}</span>
                  </Link>
                )
              )}
            </div>
            <Button
              asChild
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-base py-3"
              size="lg"
            >
              <Link
                href={`/donate/${slug}`}
                target="_blank"
              >
                Donate Now
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        <Tabs defaultValue={tab} className="mb-8 lg:w-2/3" onValueChange={(val) => { setTab(val); }}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="campaign" className="py-2.5">
              Campaign
            </TabsTrigger>
            <TabsTrigger value="about" className="py-2.5">
              About
            </TabsTrigger>
            <TabsTrigger value="rewards" className="py-2.5">
              Rewards
            </TabsTrigger>
            <TabsTrigger
              value="updates"
              className="py-2.5 relative"
              disabled={slug === 'preview'}
            >
              Updates
              {(
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 bg-secondary text-primary rounded-1"
                >
                  {updatesCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="py-2.5"
              disabled={slug === 'preview'}
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaign" className="mt-14">
            <CampaignTab project={project} />
          </TabsContent>
          <TabsContent value="about" className="mt-14">
            <AboutTab project={project} />
          </TabsContent>
          <TabsContent value="rewards" className="mt-14">
            <RewardsTab project={project} rewards={rewards} />
          </TabsContent>
          <TabsContent value="updates" className="mt-14">
            <UpdatesTab projectId={project.id} onUpdate={setUpdatesCount} />
          </TabsContent>
          <TabsContent value="history" className="mt-14">
            <DonationsTab projectId={project.id} />
          </TabsContent>
        </Tabs>

        {tab === 'campaign' && <div className='mt-24 flex-1'>
          <ul className="space-y-2">
            {titles.map((item) => (
              <li key={item}>
                <a
                  href={'#'}
                  className="text-sm font-semibold text-neutral-darkgray border-transparent border-l-2 hover:border-primary pl-2"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>}
        
        {
          tab === 'rewards' &&
          <div className='mt-24 flex-1'>
            <ul className="space-y-3">
              {rewards && rewards.length > 0 ? (
                rewards.map((reward: RewardDraft, index: number) => (
                  <li key={reward.id}>
                    <a
                      href={`#reward-${reward.id || index}`}
                      className="text-sm font-medium text-gray-700 border-transparent border-l-2 hover:border-primary pl-3 py-1 block transition-colors w-full text-left cursor-pointer"
                    >
                      <p className="truncate font-semibold">{reward.title}</p>
                      <p className="text-xs text-gray-500 font-medium">${reward.amount}</p>
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 pl-3 py-1">
                  No rewards available
                </li>
              )}
            </ul>
          </div>
        }
      </div>

      {similarProjects.length > 0 && <section className="mt-16 pt-12 border-t border-neutral-mediumgray/50">
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
      </section>}
    </div>
  );
}
