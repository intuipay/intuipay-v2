import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { ProjectInfo, ProjectFilter, Donation, Donations, Update, Updates } from '@/types';

type CountResult = {
  count: number;
}

export const getDonationProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {
  const data = await fetchTidb<ProjectInfo>(`/donation_project?slug=${slug}`);
  const project = data[ 0 ];

  project.project_slug = slug; // 确保 slug 正确
  // tidb endpoint返回的是string，所以需要手动转为json
  project.networks = JSON.parse((project.networks as unknown) as string);
  project.tokens = JSON.parse((project.tokens as unknown) as string);
  project.wallets = JSON.parse((project.wallets as unknown) as string);

  return project;
});

export const getProjects = cache(async function getProjects(
  page: number,
  pageSize: number,
  search: string,
  orderBy: string = 'id',
  orderDir: string = 'desc',
  filter?: ProjectFilter,
) {
  const searchParams = new URLSearchParams();
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  searchParams.set('order_by', orderBy);
  searchParams.set('order_dir', orderDir);
  if (search) {
    searchParams.set('search', `%${search}%`);
  }
  if (filter?.category) {
    searchParams.set('category', filter.category.toString());
  }
  if (filter?.progressMin !== undefined) {
    searchParams.set('progress_min', filter.progressMin.toString());
  }
  if (filter?.progressMax !== undefined) {
    searchParams.set('progress_max', filter.progressMax.toString());
  }
  if (filter?.location) {
    searchParams.set('location', filter.location);
  }
  if (filter?.donationMethods) {
    searchParams.set('accepts', filter.donationMethods.toString());
  }
  if (filter?.projectType) {
    searchParams.set('type', filter.projectType.toString());
  }
  if (filter?.excludes) {
    searchParams.set('excludes', filter.excludes.toString());
  }
  const data = await fetchTidb<ProjectInfo>(`/projects?${searchParams.toString()}`);
  return data;
});

export const getProjectCount = cache(async function getProjectCount() {
  const data = await fetchTidb<CountResult>('/projects_count');
  return data[ 0 ].count;
});

export const getProjectDetail = cache(async function getProjectDetail(slug: string) {
  const data = await fetchTidb<ProjectInfo>(`/project_detailed?slug=${slug}`);
  const {
    amount,
    goal_amount,
    ...rest
  } = data[ 0 ];
  return {
    ...rest,
    amount: Number(amount),
    goal_amount: Number(goal_amount),
  };
});

export const getDonations = cache(async function getDonations(projectId: number, page: number, pageSize = 20, order: string = 'id'): Promise<Donations> {
  const searchParams = new URLSearchParams();
  searchParams.set('project_id', projectId.toString());
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  searchParams.set('order', order);
  console.log('searchParams.toString()', searchParams.toString())
  const data = await fetchTidb<Donation>(`/project_donations?${searchParams.toString()}`);
  return data;
});


export const getUpdates = cache(async function getUpdates(projectId: number, page: number, pageSize = 20, order: string = 'id'): Promise<Updates> {
  const searchParams = new URLSearchParams();
  searchParams.set('project_id', projectId.toString());
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  const data = await fetchTidb<Update>(`/project_updates?${searchParams.toString()}`);
  return data;
});

export const getUpdatesCount = cache(async function getUpdatesCount(projectId: number) {
  const searchParams = new URLSearchParams();
  searchParams.set('project_id', projectId.toString());
  const data = await fetchTidb<CountResult>(`/project_updates_count?${searchParams.toString()}`);
  return data[ 0 ].count;
});
