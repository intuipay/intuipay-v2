import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { ProjectInfo, ProjectFilter, Donation, Donations, Update, Updates, Profile, OrganizationInfo, BackedProject, UserRefund } from '@/types';
import { DEFAULT_PROFILE_VALUES } from '@/data';

type CountResult = {
  count: number;
}

export const getDonationProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {
  const data = await fetchTidb<ProjectInfo>(`/donation_project?slug=${slug}`);
  const project = data[ 0 ];

  project.project_slug = slug; // 确保 slug 正确
  // tidb endpoint返回的是string，所以需要手动转为json
  project.networks = project.networks ? JSON.parse((project.networks as unknown) as string) : [];
  project.tokens = project.tokens ? JSON.parse((project.tokens as unknown) as string) : {};
  project.wallets = project.wallets ? JSON.parse((project.wallets as unknown) as string) : {};

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

export const getProfile = cache(async function (userId: string) {
  const result = await fetchTidb<Profile>(`/dash/my_profile?user_id=${userId}`);
  if (result.length === 0) return DEFAULT_PROFILE_VALUES;

  const [item] = result;
  return item;
});

export const getMyBacked = cache(async function (userId: string) {
  const result = await fetchTidb<BackedProject>(`/my_backed?user_id=${userId}`);

  return result;
});

export const getMyProjects = cache(async function (params: URLSearchParams) {
  return await fetchTidb<ProjectInfo>(`/dash/my_projects?${params.toString()}`);
});

export const getMyOrg = cache(async function (userId: string) {
  const result = await fetchTidb<OrganizationInfo>(`/admin/my_orgs?user_id=${userId}`);
  if (result.length === 0) {
    return null;
  }

  const [item] = result;
  return {
    ...item,
    id: Number(item.id),
    org_type: Number(item.org_type),
  };
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
  console.log('getProjectDetail data:', data);
  if (data.length === 0) {
    return null;
  }
  const {
    amount,
    goal_amount,
    type,
    campaign_id,
    networks,
    tokens,
    wallets,
    ...rest
  } = data[ 0 ];
  return {
    ...rest,
    amount: Number(amount),
    goal_amount: Number(goal_amount),
    type: Number(type),

    // 测试的众筹合约信息，等后台接入钱包后，应该从后台读取
    project_slug: slug,
    campaign_id: campaign_id ? Number(campaign_id) : undefined, // 每个众筹项目都应该有一个区块链上的 campaign_id
    networks: networks ? JSON.parse(networks) : ['ethereum-sepolia'],
    tokens: tokens ? JSON.parse(tokens) : { 'ethereum-sepolia': ['usdc'] },
    wallets: wallets ? JSON.parse(wallets) : { 'ethereum-sepolia': '0xbDE5c24B7c8551f93B95a8f27C6d926B3bCcF5aD' }, // 众筹合约地址
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

export const getUserRefund = cache(async function getUserRefund(userId: string, projectId: number): Promise<UserRefund> {
  const searchParams = new URLSearchParams();
  searchParams.set('user_id', userId);
  searchParams.set('project_id', projectId.toString());
  const data = await fetchTidb<UserRefund>(`/my_amount_in_project?${searchParams.toString()}`);
  const {
    amount, // crypto金额
    count,  // 捐款次数
    dollar  // 对应美元金额
  } = data [ 0 ];
  return {
    amount: Number(amount),
    count: Number(count),
    dollar: Number(dollar)
  }
});
