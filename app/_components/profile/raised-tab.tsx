import { ProjectCard } from '@/components/project-card';
import { ProjectInfo } from '@/types';
import { ProjectCategories, ProjectTypes } from '@/data';

// Mock data for backed projects
const mockBackedProjects: ProjectInfo[] = [
  {
    id: 1,
    project_name: 'NeuroBridge',
    project_subtitle: 'Bridging Brain Health and AI for Early Alzheimer\'s Detection',
    project_slug: 'neurobridge-1',
    accepts: 'crypto',
    amount: 12345670,
    banner: 'https://assets.intuipay.xyz/baid.webp',
    banners: ['https://assets.intuipay.xyz/baid.webp'],
    campaign: '# NeuroBridge Campaign\n\nBridging Brain Health and AI for Early Alzheimer\'s Detection',
    category: ProjectCategories.Technology,
    email: 'contact@neurobridge.org',
    end_at: '2024-12-31T23:59:59Z',
    github: '',
    goal_amount: 15000000,
    location: 'Atlanta, GA',
    org_id: 1,
    org_contact: 'contact@emory.edu',
    org_description: 'Leading research university',
    org_location: 'Atlanta, GA',
    org_logo: '/images/emory-logo.png',
    org_name: 'Emory University',
    org_slug: 'emory-university',
    org_type: 'university',
    org_website: 'https://emory.edu',
    social_links: '{}',
    status: 'active' as any,
    tags: 'AI,Healthcare,Research',
    type: ProjectTypes[ 'Non-Profit / Academic Research' ],
    website: 'https://neurobridge.org',
    backers: 245,
    project_cta: 'Support cutting-edge Alzheimer\'s research',
    thanks_note: 'Thank you for supporting brain health research!',
    brand_color: '#2461F2',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    project_name: 'NeuroBridge',
    project_subtitle: 'Bridging Brain Health and AI for Early Alzheimer\'s Detection',
    project_slug: 'neurobridge-2',
    accepts: 'crypto',
    amount: 12345670,
    banner: 'https://assets.intuipay.xyz/baid.webp',
    banners: ['https://assets.intuipay.xyz/baid.webp'],
    campaign: '# NeuroBridge Campaign\n\nBridging Brain Health and AI for Early Alzheimer\'s Detection',
    category: ProjectCategories.Technology,
    email: 'contact@neurobridge.org',
    end_at: '2024-11-30T23:59:59Z',
    github: '',
    goal_amount: 15000000,
    location: 'Atlanta, GA',
    org_id: 1,
    org_contact: 'contact@emory.edu',
    org_description: 'Leading research university',
    org_location: 'Atlanta, GA',
    org_logo: '/images/emory-logo.png',
    org_name: 'Emory University',
    org_slug: 'emory-university',
    org_type: 'university',
    org_website: 'https://emory.edu',
    social_links: '{}',
    status: 'active' as any,
    tags: 'AI,Healthcare,Research',
    type: ProjectTypes[ 'Non-Profit / Academic Research' ],
    website: 'https://neurobridge.org',
    backers: 189,
    project_cta: 'Support cutting-edge Alzheimer\'s research',
    thanks_note: 'Thank you for supporting brain health research!',
    brand_color: '#2461F2',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 3,
    project_name: 'NeuroBridge',
    project_subtitle: 'Bridging Brain Health and AI for Early Alzheimer\'s Detection',
    project_slug: 'neurobridge-3',
    accepts: 'crypto',
    amount: 12345670,
    banner: 'https://assets.intuipay.xyz/baid.webp',
    banners: ['https://assets.intuipay.xyz/baid.webp'],
    campaign: '# NeuroBridge Campaign\n\nBridging Brain Health and AI for Early Alzheimer\'s Detection',
    category: ProjectCategories.Technology,
    email: 'contact@neurobridge.org',
    end_at: '2024-10-15T23:59:59Z',
    github: '',
    goal_amount: 15000000,
    location: 'Atlanta, GA',
    org_id: 1,
    org_contact: 'contact@emory.edu',
    org_description: 'Leading research university',
    org_location: 'Atlanta, GA',
    org_logo: '/images/emory-logo.png',
    org_name: 'Emory University',
    org_slug: 'emory-university',
    org_type: 'university',
    org_website: 'https://emory.edu',
    social_links: '{}',
    status: 'active' as any,
    tags: 'AI,Healthcare,Research',
    type: ProjectTypes[ 'Non-Profit / Academic Research' ],
    website: 'https://neurobridge.org',
    backers: 312,
    project_cta: 'Support cutting-edge Alzheimer\'s research',
    thanks_note: 'Thank you for supporting brain health research!',
    brand_color: '#2461F2',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z'
  }
];

export default function RaisedTab() {
  return (
    <div className="w-full">
      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockBackedProjects.map((project) => (
          <div key={project.id} className="w-full">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
