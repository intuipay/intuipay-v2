import { getProjectCount, getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card'; // Changed to named import
import { ProjectCategories, ProjectDonationMethods, ProjectTypes } from '@/data'; // For enum parsing
import { ProjectFilter, ProjectInfo } from '@/types';

// Define a simple skeleton for loading state
function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="bg-neutral-800/50 h-107 rounded-lg animate-pulse">
          <div className="aspect-video bg-neutral-700/50 rounded mb-4"></div>
          <div className="h-7 bg-neutral-700/50 rounded mb-1 ms-5 w-1/2"></div>
          <div className="h-12 bg-neutral-700/50 rounded mx-5 mb-4"></div>
          <div className="h-8 bg-neutral-700/50 rounded mx-5 mb-4"></div>
          <div className="h-8 bg-neutral-700/50 rounded mx-5"></div>
        </div>
      ))}
    </div>
  );
}

export { ProjectListSkeleton }; // Export skeleton for use in Suspense fallback

type ProjectListProps = {
  page: number;
  pageSize: number;
  search?: string;
  order_by?: string;
  order_dir?: string;
  // Filter props as strings, matching URL param values
  category?: string;       // e.g., "0", "1" (for ProjectCategories.All, ProjectCategories.Animals)
  progress?: string;       // e.g., "50" (for 50%)
  location?: string;
  donationMethods?: string; // e.g., "0", "1" (for ProjectDonationMethods.All, ProjectDonationMethods.Crypto)
  projectType?: string;    // e.g., "0", "1" (for ProjectTypes.All, ProjectTypes["Non-Profit / Academic Research"])
  excludes?: string;       // comma-separated string of IDs to exclude
};

export default async function ProjectList(props: ProjectListProps) {
  const {
    page,
    pageSize,
    search: searchProp,
    order_by: orderByProp,
    order_dir: orderDirProp,
    category: categoryString,
    progress: progressString,
    location,
    donationMethods: donationMethodsString,
    projectType: projectTypeString,
    excludes: excludesString
  } = props;

  // Provide defaults for optional string parameters for getProjects
  const search = searchProp || '';
  const order_by = orderByProp || 'id';
  const order_dir = orderDirProp || 'desc';

  // Construct the filter object for getProjects
  const filter: ProjectFilter = {
    category: categoryString ? parseInt(categoryString) as ProjectCategories : ProjectCategories.All,
    progress: progressString ? parseInt(progressString) : 0,
    location: location || ''  , // Ensure location is always a string
    donationMethods: donationMethodsString ? parseInt(donationMethodsString) as ProjectDonationMethods : ProjectDonationMethods.All,
    projectType: projectTypeString ? parseInt(projectTypeString) as ProjectTypes : ProjectTypes.All,
    excludes: excludesString ? excludesString.split(',').filter(Boolean) : undefined,
  };

  const [projects, total] = await Promise.all([
    getProjects(page, pageSize, search, order_by, order_dir, filter),
    getProjectCount(), // Fetches the unfiltered total count
  ]);

  if (!projects || projects.length === 0) {
    return <p className="text-center py-8 text-neutral-400">No projects found matching your criteria.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: ProjectInfo) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
