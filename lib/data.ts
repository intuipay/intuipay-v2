import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { Donation, Donations, ProjectFilter, ProjectInfo, Update, Updates } from '@/types';
import { ProjectCategories, ProjectDonationMethods, ProjectTypes } from '@/data';

type CountResult = {
  count: number;
}

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
  if (filter?.progress && filter.progress !== 0) {
    searchParams.set('progress', filter.progress.toString());
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
  const data = await fetchTidb<ProjectInfo>(`/projects?${searchParams.toString()}`);
  return data;
});

export const getProjectCount = cache(async function getProjectCount() {
  const data = await fetchTidb<CountResult>('/projects_count');
  return data[ 0 ].count;
});

export const getProjectDetail = cache(async function getProjectDetail(id: string) {
  const data = await fetchTidb<ProjectInfo>(`/project_detailed?slug=${id}`);
  return data[ 0 ];
});

export const getDonations = cache(async function getDonations(projectId: string, page: number, pageSize = 20, order: string = 'id'): Promise<Donations> {
  const searchParams = new URLSearchParams();
  searchParams.set('project_id', projectId);
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  searchParams.set('order', order);
  console.log('searchParams.toString()', searchParams.toString())
  const data = await fetchTidb<Donation>(`/project_donations?${searchParams.toString()}`);
  return data;
});


export const getUpdates = cache(async function getUpdates(projectId: string, page: number, pageSize = 20, order: string = 'id'): Promise<Updates> {
  const searchParams = new URLSearchParams();
  searchParams.set('project_id', projectId);
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  const data = await fetchTidb<Update>(`/project_updates?${searchParams.toString()}`);
  return data;
});

export const getUpdatesCount = cache(async function getUpdatesCount(projectId: string) {
  const searchParams = new URLSearchParams();
  searchParams.set('project_id', projectId);
  const data = await fetchTidb<CountResult>(`/project_updates_count?${searchParams.toString()}`);
  return data[ 0 ].count;
});
