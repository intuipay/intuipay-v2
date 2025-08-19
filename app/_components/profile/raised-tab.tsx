import { ProjectCard } from '@/components/project-card';
import { ProjectInfo } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RaisedTabProps {
  projects?: ProjectInfo[];
}

export default function RaisedTab({ projects }: RaisedTabProps) {
  // 使用传入的项目数据，如果没有则显示空状态
  const projectsToShow = projects || [];

  if (projectsToShow.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-10 py-12">
        <p className="text-black/60 text-center text-base font-medium leading-6 max-w-[440px]">
          You are not raising any projects.
        </p>
        <Link href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/project/new`} target="_blank" rel="noopener noreferrer">
          <Button className="bg-[#2461f2] hover:bg-[#2461f2]/90 text-white px-4 py-2 rounded-[40px] text-sm font-medium leading-5">
            Raise Now
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsToShow.map((project) => (
          <div key={project.id} className="w-full">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
