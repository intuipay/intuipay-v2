'use client'

import Image from 'next/image'
import Link from 'next/link'
import { marked } from 'marked'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Envelope,
  MapPin,
  Link as LinkIcon,
  ArrowSquareOut,
  LinkedinLogo,
  InstagramLogo,
  TwitterLogo,
  YoutubeLogo,
  FacebookLogo
} from '@phosphor-icons/react';
import type { ProjectDataType } from '@/app/project/[slug]/project-data'

type AboutTabProps = {
  project: ProjectDataType
}

export function AboutTab({ project }: AboutTabProps) {
  const {
    org_logo,
    org_name,
    org_description,
    email,
    org_location,
    org_website,
  } = project;
  return (
    <section>
      <h2 className="text-3xl mb-14">About this organization</h2>
      <div className="flex items-center mb-10">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={org_logo} alt={org_name} />
          <AvatarFallback>{org_name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold">{org_name}</h3>
      </div>
      <article className="text-neutral-darkgray leading-relaxed mb-10 prose"
        dangerouslySetInnerHTML={{ __html: marked.parse(org_description) }}
      />

      <div className="space-y-2 mb-10 text-sm">
        <Link
          href={`mailto:${email}`}
          className="flex items-center text-neutral-darkgray hover:text-action-blue"
        >
          <Envelope size={16} className="mr-2" /> Contact Us
        </Link>
        <p className="flex items-center text-neutral-darkgray">
          <MapPin size={16} className="mr-2" /> {org_location}
        </p>
        <Link
          href={org_website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-neutral-darkgray hover:text-action-blue"
        >
          <LinkIcon size={16} className="mr-2" /> {org_website} <ArrowSquareOut size={12} className="ml-1" />
        </Link>
      </div>

      <div className="flex space-x-3 mb-6">
        {(
          <Link
            href=''
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <LinkedinLogo size={20} />
          </Link>
        )}
        {(
          <Link
            href=''
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <InstagramLogo size={20} />
          </Link>
        )}
        {(
          <Link
            href=''
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <TwitterLogo size={20} />
          </Link>
        )}
        {(
          <Link
            href={''}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <YoutubeLogo size={20} />
          </Link>
        )}
        {(
          <Link
            href={''}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <FacebookLogo size={20} />
          </Link>
        )}
      </div>

      {project.banners.length > 0 && (
        Array.isArray(project.banners) && project.banners.map((banner: string) => {
          return (
            <div
              className="relative aspect-video rounded-lg overflow-hidden shadow-md"
              key={banner}
            >
              <Image
                src={banner}
                alt={`About ${org_name}`}
                fill
                className="object-cover"
              />
            </div>
          )
        })
      )}
    </section>
  )
}
