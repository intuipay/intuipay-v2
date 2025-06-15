import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { DonationProject } from '@/types';

type CountResult = {
  count: number;
}

export const getDonationProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {

  const data = await fetchTidb<DonationProject>(`/donation_project?slug=${slug}`);
  const project = data[0];

  project.project_slug = slug; // 确保 slug 正确

  // tidb endpoint返回的是string，所以需要手动转为json
  project.networks = JSON.parse((project.networks as unknown) as string);
  project.tokens = JSON.parse((project.tokens as unknown) as string);
  project.wallets = JSON.parse((project.wallets as unknown) as string);

  return project;
});

export const getProjects = cache(async function getProjects(page: number, pageSize: number) {
  const searchParams = new URLSearchParams();
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  searchParams.set('order_by', 'id');
  searchParams.set('order_dir', 'desc');
  const data = await fetchTidb<DonationProject>(`/projects?${searchParams.toString()}`);
  return data;
});

export const getProjectCount = cache(async function getProjectCount() {
  const data = await fetchTidb<CountResult>('/projects_count');
  return data[ 0 ].count;
});

export const getProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {
  const data = await fetchTidb<DonationProject>(`/donation_project_detailed?slug=${slug}`);
  return data[ 0 ];
});
