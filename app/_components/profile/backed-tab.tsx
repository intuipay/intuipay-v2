import { ProjectCard } from '@/components/project-card';
import { ProjectStatus } from '@/data/project';
import { BackedProject } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BackedTabProps {
  projects?: BackedProject[]; // 用户支持的项目列表，包含退款状态
}

export default function BackedTab({ projects }: BackedTabProps) {
  // 使用传入的项目数据，如果没有则显示空状态
  const projectsToShow = projects || [];

  if (projectsToShow.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-10 py-12">
        <p className="text-black/60 text-center text-base font-medium leading-6 max-w-[440px]">
          You are not backing any projects.
        </p>
        <Link href="/projects">
          <Button className="bg-[#2461f2] hover:bg-[#2461f2]/90 text-white px-4 py-2 rounded-[40px] text-sm font-medium leading-5">
            Browse Projects
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsToShow.map((project: BackedProject) => {
          return (
            <div key={project.id} className="w-full">
              <ProjectCard 
                project={project} 
                isRefunded={project.refund_at ? true : false} // 根据 refund_at 字段判断是否已退款
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
