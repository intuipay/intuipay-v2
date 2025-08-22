import { DonationInfo, ProjectInfo, Reward } from '@/types';
import { getRewardById } from '@/lib/rewards';

type BaseProps = {
  to: string;
}

type DonationProps = BaseProps & {
  amount: number;
  creator: string;
  currency: string;
  deliveryMethod: string;
  deliveryTime: string;
  dollar: number;
  endAt: string;
  from: string;
  id: number;
  index: number;
  projectName: string;
  reward: string;
  status: string;
  txHash: string;
}

/**
 * 发送捐款成功邮件
 * @param params 邮件参数
 */
export async function sendDonationEmail(params: DonationProps) {
  try {
    const res = await fetch('https://resend.intuipay.xyz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'donated',
        ...params,
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send donation email: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('sendDonationEmail error:', err);
    return null;
  }
}

export function getDonationProps(project: ProjectInfo, donation: DonationInfo): DonationProps {
  let reward: Reward | null = null;
  if (donation.reward_id && project.rewards) {
    reward = getRewardById(donation.reward_id, project.rewards);
  }
  return {
    to: donation.email,
    amount: donation.amount as number, // amount is string type, keep as string for large values
    creator: project.org_name,
    currency: donation.currency,
    deliveryMethod: reward && reward.shipping_method ? reward.shipping_method : 'Digital delivery',
    deliveryTime: reward && reward.estimated_delivery ? reward.estimated_delivery : 'To be determined',
    reward: reward && reward.name ? reward.name : 'No reward selected',
    dollar: donation.dollar || 0,
    endAt: project.end_at,
    from: project.org_name,
    id: donation.id,
    index: donation.index || 1,
    projectName: project.project_name,
    status: 'successful',
    txHash: donation.tx_hash || '',
  };
}

type RefundProps = BaseProps & {
  amount: number;
  hashId: string;
  projectName: string;
  to: string;
  wallet: string;
}

export async function sendRefundEmail(params: RefundProps) {
  try {
    const res = await fetch('https://resend.intuipay.xyz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'refund',
        ...params,
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send refund email: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('sendRefundEmail error:', err);
    return null;
  }
}

export function getRefundProps(project: ProjectInfo, refundInfo: {
  amount: number;
  tx_hash: string;
  wallet_address: string;
  to: string;
}): RefundProps {
  return {
    amount: refundInfo.amount,
    hashId: refundInfo.tx_hash,
    projectName: project.project_name,
    to: refundInfo.to,
    wallet: refundInfo.wallet_address,
  };
}
