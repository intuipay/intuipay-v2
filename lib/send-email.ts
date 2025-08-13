import { DonationInfo, ProjectInfo, Reward } from "@/types";

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
    amount: donation.amount as number, // 这里的 amount 是 string 类型，不能转为number，因为数字很大，所以使用 as 愚弄一下编译器
    creator: project.org_name,
    currency: donation.currency,
    deliveryMethod: reward && reward.shipping_method ? reward.shipping_method : 'Digital delivery',
    deliveryTime: reward && reward.estimated_delivery ? reward.estimated_delivery : 'To be determined',
    reward: reward ? reward.name : 'reward name',
    dollar: donation.dollar || 0,
    endAt: project.end_at,
    from: project.org_name,
    id: donation.id,
    index: donation.id,
    projectName: project.project_name,
    status: "successful",
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
      return `${monthNames[month - 1]} ${year}`;
    }
    return 'TBD';
  };

  // 格式化可用性信息
  // number: 总量, count: 剩余数量
  const getAvailability = (number: number, count: number | null): string => {
    if (number === 0) return 'Unlimited';
    if (count !== null) return `Limited (${count} left of ${number})`;
    return `Limited (${number} available)`;
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

export function getRefundProps(project: ProjectInfo, refundInfo: {
  tx_hash: string;
  wallet_address: string;
  to: string;
}): RefundProps {
  return {
    amount: 1, // TODO: 查询数据库获取退款金额
    hashId: refundInfo.tx_hash,
    projectName: project.project_name,
    to: refundInfo.to,
    wallet: refundInfo.wallet_address, 
  }
}
