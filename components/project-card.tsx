import Image from 'next/image'
import Link from 'next/link' // Import Link
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectInfo } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProjectCardProps = {
  project: ProjectInfo;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = project.goal_amount > 0
    ? Math.round(project.amount / project.goal_amount * 1000) / 10 : 0;
  const daysLeft = Math.ceil((new Date(project.end_at).getTime() - Date.now()) / 1000 / 60 / 60 / 24);

  return (
    <Link
      href={`/project/${project.project_slug}`}
      className="block hover:shadow-lg transition-shadow duration-800 rounded-lg h-101 drop-shadow-custom1"
    >
      <Card className="group overflow-hidden flex flex-col h-full border-transparent hover:border-action-blue/50 transition-colors">
        <div className="relative w-full h-53 group-hover:h-40 transition-all duration-800">
          <Image
            src={project.banner || '/images/placeholder.svg'}
            alt={project.project_name}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
        <CardHeader className="min-h-20">
          <CardTitle className="text-lg text-neutral-text">{project.project_name}</CardTitle>
          <p className="text-base text-black/70 text-neutral-darkgray mt-1 line-clamp-1 group-hover:line-clamp-2">{project.project_subtitle || project.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-xs gap-2">
            <Avatar className="size-8">
              <AvatarImage src={project.org_logo} alt={project.org_name} />
              <AvatarFallback>{project?.org_name?.charAt(0) || ''}</AvatarFallback>
            </Avatar>
            <span>{project.org_name}</span>
          </div>
        </CardContent>
        <div className='w-auto h-px mx-5 bg-line-gray'></div>
        <CardFooter className="whitespace-nowrap overflow-hidden flex-grow group-hover:pb-0">
          <div className="flex justify-between items-center bg-white">
            <span className="text-xs text-neutral-darkgray">Total Raised</span>
            <span className="text-base font-bold text-neutral-text text-ellipsis">
              $ {(project.goal_amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="group-hover:block absolute bottom-4 text-sm text-black mt-4 hidden opacity-0 group-hover:opacity-60 transition-opacity">{daysLeft} days left • {progress}% founded</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
