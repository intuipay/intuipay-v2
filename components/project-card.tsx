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
      className="block hover:shadow-lg transition-shadow duration-800 rounded-lg h-full"
    >
      <Card className="group overflow-hidden flex flex-col h-full border-transparent hover:border-action-blue/50 transition-colors">
        <div className="relative w-full aspect-[16/9] h-[405px] group-hover:h-[60%] transition-height duration-800">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-neutral-text">{project.title}</CardTitle>
          <p className="text-xs text-black/70 text-neutral-darkgray mt-1 line-clamp-1 group-hover:line-clamp-2">{project.description}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-xs">
            <ShieldCheck className="h-4 w-4 mr-1.5 text-intuipay-blue" />
            <span>{project.universityName}</span>
          </div>
        </CardContent>
        <CardFooter className="mx-5 pt-4 border-t border-neutral-mediumgray/30 whitespace-nowrap overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-darkgray">Total Raised</span>
            <span className="text-base font-bold text-neutral-text text-ellipsis">
              $ {project.totalRaised.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-sm text-black mt-4 hidden opacity-0 group-hover:block group-hover:opacity-60 transition-opacity duration-800">xxx days left • xx% founded</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
