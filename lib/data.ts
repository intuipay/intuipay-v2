import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { DonationProject } from '@/types';

export const getDonationProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {

  const data = await fetchTidb<DonationProject>(`/donation_project?slug=${slug}`);
  const project = data[0];

  console.log('project', project);
  project.project_slug = slug; // 确保 slug 正确

  // tidb endpoint返回的是string，所以需要手动转为json
  project.networks = JSON.parse((project.networks as unknown) as string);
  project.tokens = JSON.parse((project.tokens as unknown) as string);
  project.wallets = JSON.parse((project.wallets as unknown) as string);

  return project;
});

export const getDonationProjectById = cache(async function getDonationProjectById(id: number) {

  // TODO: 目前 tidb 不支持 id 查询，还是得改为 slug 查询
  console.log('getDonationProjectById', id);
  const data = await fetchTidb<DonationProject>(`/donation_project?id=${id}`);
  console.log('getDonationProjectById data', data)
  const project = data[0];

  // tidb endpoint返回的是string，所以需要手动转为json
  project.networks = JSON.parse((project.networks as unknown) as string);
  project.tokens = JSON.parse((project.tokens as unknown) as string);
  project.wallets = JSON.parse((project.wallets as unknown) as string);

  return project;
});
