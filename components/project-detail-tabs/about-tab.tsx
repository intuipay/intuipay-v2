"use client"

import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, MapPin, Link2, ExternalLink, Linkedin, Instagram, Twitter, Youtube, Facebook } from "lucide-react"
import type { ProjectDataType } from "@/app/project/[slug]/project-data"

type AboutTabProps = {
  university: ProjectDataType["university"]
}

export function AboutTab({ university }: AboutTabProps) {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">About this organization</h2>
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={university.logoUrl || "/placeholder.svg"} alt={university.name} />
          <AvatarFallback>{university.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold">{university.name}</h3>
      </div>
      <p className="text-neutral-darkgray leading-relaxed mb-6">{university.description}</p>

      <div className="space-y-2 mb-6 text-sm">
        <Link
          href={`mailto:${university.contactEmail}`}
          className="flex items-center text-neutral-darkgray hover:text-action-blue"
        >
          <Mail className="w-4 h-4 mr-2" /> Contact Us
        </Link>
        <p className="flex items-center text-neutral-darkgray">
          <MapPin className="w-4 h-4 mr-2" /> {university.location}
        </p>
        <Link
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-neutral-darkgray hover:text-action-blue"
        >
          <Link2 className="w-4 h-4 mr-2" /> {university.website} <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="flex space-x-3 mb-6">
        {university.socials.linkedin && (
          <Link
            href={university.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <Linkedin className="w-5 h-5" />
          </Link>
        )}
        {university.socials.instagram && (
          <Link
            href={university.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <Instagram className="w-5 h-5" />
          </Link>
        )}
        {university.socials.twitter && (
          <Link
            href={university.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <Twitter className="w-5 h-5" />
          </Link>
        )}
        {university.socials.youtube && (
          <Link
            href={university.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <Youtube className="w-5 h-5" />
          </Link>
        )}
        {university.socials.facebook && (
          <Link
            href={university.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-neutral-darkgray hover:text-action-blue"
          >
            <Facebook className="w-5 h-5" />
          </Link>
        )}
      </div>

      {university.aboutImage && (
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
          <Image
            src={university.aboutImage || "/placeholder.svg"}
            alt={`About ${university.name}`}
            fill
            className="object-cover"
          />
        </div>
      )}
    </section>
  )
}
