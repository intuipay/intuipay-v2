import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { DonationProject } from '@/types';

export const getDonationProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {

  const data = await fetchTidb<DonationProject>(`/donation_project?slug=${slug}`);
  const project = data[ 0 ];

  // 在tidb准备好之前，本地写死一些数据测试，数据库好了再删掉
  // project.networks = ['ethereum-sepolia', 'solana-devnet'];
  // project.tokens = {
  //   'ethereum-sepolia': ['eth', 'usdc'],
  //   'solana-devnet': ['sol'],
  // }
  // project.wallets = {
  //   'ethereum-sepolia': '0x1234567890abcdef1234567890abcdef12345678',
  //   'solana-devnet': 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
  // }

  // console.log('getDonationProjectBySlug', slug, project);
  return project;
});
