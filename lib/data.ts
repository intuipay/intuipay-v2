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

  // TODO: 给每个项目都加了 edu 测试环境配置，记得删掉
  project.networks?.push('edu-testnet');
  project.tokens[ 'edu-testnet' ] = ['edu', 'usdc'];
  project.wallets[ 'edu-testnet' ] = '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86';

  // TODO: solana-devnet 也都加上，方便看效果
  if (project.networks && !project.networks.includes('solana-devnet')) {
    project.networks.push('solana-devnet');
    project.tokens[ 'solana-devnet' ] = ['sol', 'usdc'];
    project.wallets[ 'solana-devnet' ] = 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1';
  }
  return project;
});

export const getCrowdFundingProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {
  const data = await fetchTidb<ProjectInfo>(`/donation_project?slug=${slug}`);
  const project = data[ 0 ];

  project.project_slug = slug;
  project.networks = ['ethereum-sepolia'];
  project.tokens = { 'ethereum-sepolia': ['eth'] };
  project.wallets = { 'ethereum-sepolia': '0x1b5078503369855e23bd0ec38e335ae1c36e5776' };

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

export const getProjectDetail = cache(async function getProjectDetail(
  slug: string,
  id?: string,
) {
  const searchParams = new URLSearchParams();
  if (id) {
    searchParams.set('id', id);
  } else {
    searchParams.set('slug', slug);
  }
  const data = await fetchTidb<ProjectInfo>(`/project_detailed?${searchParams.toString()}`);
  const {
    amount,
    goal_amount,
    ...rest
  } = data[ 0 ];
  return {
    ...rest,
    amount: Number(amount),
    goal_amount: Number(goal_amount),

    // 测试的众筹合约信息，等后台接入钱包后，应该从后台读取
    campaign_id: 1, // 区块链上的活动id，每个项目不同
    networks: ['ethereum-sepolia'],
    tokens: { 'ethereum-sepolia': ['usdc'] },
    wallets: { 'ethereum-sepolia': '0xbDE5c24B7c8551f93B95a8f27C6d926B3bCcF5aD' }, // 众筹合约地址
  };
});

export const getDonations = cache(async function getDonations(projectId: number, page: number, pageSize = 20, order: string = 'id'): Promise<Donations> {
  const searchParams = new URLSearchParams();
  searchParams.set('project_id', projectId.toString());
  searchParams.set('start', ((page - 1) * pageSize).toString());
  searchParams.set('pagesize', pageSize.toString());
  searchParams.set('order', order);
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
