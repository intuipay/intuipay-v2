import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { Project } from '@/types';

type CountResult = {
  count: number;
}

export const getProjects = cache(async function getProjects(page: number, pageSize: number) {
  const searchParams = new URLSearchParams();
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  searchParams.set('order_by', 'id');
  searchParams.set('order_dir', 'desc');
  const data = await fetchTidb<Project>(`/projects?${searchParams.toString()}`);
  return data;
});

export const getProjectCount = cache(async function getProjectCount() {
  const data = await fetchTidb<CountResult>('/projects_count');
  return data[ 0 ].count;
});

export const getProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {
  const data = await fetchTidb<Project>(`/donation_project_detailed?slug=${slug}`);
  return data[ 0 ];
});
