import { ProjectCard } from '@/components/project-card';
import { ProjectStatus } from '@/data/project';
import { BackedProject } from '@/types';

interface BackedTabProps {
  projects?: BackedProject[]; // 用户支持的项目列表，包含退款状态
}

export default function BackedTab({ projects }: BackedTabProps) {
  // 使用传入的项目数据，如果没有则显示空状态
  const projectsToShow = projects || [];

  if (projectsToShow.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-black-600">You are not backing any projects.</p>
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
