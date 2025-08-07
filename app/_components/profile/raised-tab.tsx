import { ProjectCard } from '@/components/project-card';
import { ProjectInfo } from '@/types';

interface RaisedTabProps {
  projects?: ProjectInfo[];
}

export default function RaisedTab({ projects }: RaisedTabProps) {
  // 使用传入的项目数据，如果没有则显示空状态
  const projectsToShow = projects || [];

  if (projectsToShow.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500 text-lg">No projects created yet</p>
        <p className="text-gray-400 text-sm mt-2">Projects you create will appear here</p>
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
