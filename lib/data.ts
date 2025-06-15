import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { ProjectFilter, ProjectInfo } from '@/types';
import { ProjectCategories, ProjectDonationMethods, ProjectTypes } from '@/data';

type CountResult = {
  count: number;
}

export const getProjects = cache(async function getProjects(page: number, pageSize: number, search: string, orderBy: string = 'id', orderDir: string = 'desc', filter?: ProjectFilter) {
  const searchParams = new URLSearchParams();
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  searchParams.set('order_by', orderBy);
  searchParams.set('order_dir', orderDir);
  if (search) {
    searchParams.set('search', `%${search}%`);
  }
  if (filter && filter.category !== ProjectCategories.All) {
    searchParams.set('category', filter.category.toString());
  }
  if (filter && filter.progress !== 0) {
    searchParams.set('progress', filter.progress.toString());
  }
  if (filter && filter.location) {
    searchParams.set('location', filter.location);
  }
  if (filter && filter.donationMethods !== ProjectDonationMethods.All) {
    searchParams.set('accepts', filter.donationMethods.toString());
  }
  if (filter && filter.projectType !== ProjectTypes.All) {
    searchParams.set('type', filter.projectType.toString());
  }
  const data = await fetchTidb<ProjectInfo>(`/projects?${searchParams.toString()}`);
  return data;
});

export const getProjectCount = cache(async function getProjectCount() {
  const data = await fetchTidb<CountResult>('/projects_count');
  return data[ 0 ].count;
});

export const getProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {
  const data = await fetchTidb<ProjectInfo>(`/donation_project_detailed?slug=${slug}`);
  return data[ 0 ];
});
