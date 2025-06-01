import { cache } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { DonationProject } from '@/types';

export const getDonationProjectBySlug = cache(async function getDonationProjectBySlug(slug: string) {

  const data = await fetchTidb<DonationProject>(`/donation_project?slug=${slug}`);
  return data[ 0 ];
});
