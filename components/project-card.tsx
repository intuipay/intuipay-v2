import Image from "next/image"
import Link from "next/link" // Import Link
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

type ProjectCardProps = {
  project: {
    id: string
    slug: string // Added slug field
    title: string
    description: string
    universityName: string
    imageUrl: string
    totalRaised: number
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="block hover:shadow-lg transition-shadow duration-200 rounded-lg h-full"
    >
      <Card className="overflow-hidden flex flex-col h-full border-transparent hover:border-action-blue/50 transition-colors">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-neutral-text">{project.title}</CardTitle>
          <p className="text-xs text-[#000000] text-neutral-darkgray mt-1 line-clamp-2">{project.description}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-xs">
            <ShieldCheck className="h-4 w-4 mr-1.5 text-intuipay-blue" />
            <span>{project.universityName}</span>
          </div>
        </CardContent>
        <CardFooter className="mx-5 flex justify-between items-center pt-4 border-t border-neutral-mediumgray/30">
          <span className="text-xs text-neutral-darkgray">Total Raised</span>
          <span className="text-base font-bold text-neutral-text">
            $ {project.totalRaised.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
