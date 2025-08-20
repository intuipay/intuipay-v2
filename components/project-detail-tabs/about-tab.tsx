'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  EnvelopeIcon,
  MapPinIcon,
  LinkIcon,
  ArrowSquareOutIcon,
} from '@phosphor-icons/react';
import type { ProjectInfo } from '@/types'

type AboutTabProps = {
  project: ProjectInfo
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
        dangerouslySetInnerHTML={{ __html: org_description }}
      />

      <div className="space-y-2 mb-10 text-sm">
        {
          email && <Link
            href={`mailto:${email}`}
            className="flex items-center text-neutral-darkgray hover:text-action-blue"
          >
            <EnvelopeIcon className="size-4 mr-2" />{" "}
            <span className="text-primary font-medium">Contact Us</span>
          </Link>
        }
        {
          org_location &&
          <div className="flex items-center text-neutral-darkgray">
            <MapPinIcon className="size-4 mr-2" />
            <span>{org_location}</span>
          </div>
        }
        {
          org_website && <Link
            href={org_website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-neutral-darkgray hover:text-action-blue"
          >
            <LinkIcon className="size-4 mr-2" />
            <span>{org_website}</span>
            <ArrowSquareOutIcon className="size-4 ml-1" />
          </Link>
        }
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
