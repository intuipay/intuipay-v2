import { DonationInfo, ProjectInfo, Reward } from '@/types';

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

function getRewardById(rewardId: number, rewardsString: string): Reward | null {
  const rawRewards = JSON.parse(rewardsString);

  // 映射 ship_method 数字到描述
  const getShippingMethod = (shipMethod: number): string => {
    switch (shipMethod) {
      case 1: return 'By myself';
      case 2: return 'Local pickup';
      case 3: return 'Digital delivery';
      default: return 'Digital delivery';
    }
  };

  // 格式化预计交付时间
  const getEstimatedDelivery = (month: number | null, year: number | null): string => {
    if (month && year) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[ month - 1 ]} ${year}`;
    }
    return 'TBD';
  };

  // 格式化可用性信息
  // number: 总量, count: 已用的, number - count: 剩余可用的
  const getAvailability = (number: number | null, count: number): string => {
    if (!number) return 'Unlimited';
    const used = Number.isFinite(count) ? count : 0; // 兜底：非数字/空值按0处理
    const left = Math.max(0, number - used);
    return `Limited (${left} left of ${number})`;
  };

  // 查找匹配的奖励
  const targetReward = rawRewards.find((reward: any) => reward.id === rewardId);

  if (!targetReward) {
    return null;
  }

  // 转换为 Reward 格式
  return {
    id: targetReward.id.toString(),
    name: targetReward.title || 'Untitled Reward',
    description: targetReward.description || 'No description available',
    amount: targetReward.amount || 0,
    shipping_method: getShippingMethod(targetReward.ship_method),
    estimated_delivery: getEstimatedDelivery(targetReward.month, targetReward.year),
    availability: getAvailability(targetReward.number, targetReward.count),
    image: targetReward.image || '', // 确保有图片字段
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
  }
}
