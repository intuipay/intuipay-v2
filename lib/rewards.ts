import { Reward } from '@/types';

/**
 * 解析项目奖励数据
 * 将从数据库获取的原始奖励字符串转换为 Reward[] 格式
 */
export function parseProjectRewards(rewardsString: string): Reward[] {
  try {
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
    
    return rawRewards.map((reward: any) => ({
      id: reward.id.toString(),
      name: reward.title || 'Untitled Reward',
      description: reward.description || 'No description available',
      amount: reward.amount || 0,
      shipping_method: getShippingMethod(reward.ship_method),
      estimated_delivery: getEstimatedDelivery(reward.month, reward.year),
      availability: getAvailability(reward.number, reward.count),
      image: reward.image || '', // 确保有图片字段
    }));
  } catch (error) {
    console.error('Error parsing project rewards:', error);
    return [];
  }
}

/**
 * 从项目数据中获取转换后的奖励列表
 * 如果项目没有奖励数据，返回空数组
 */
export function getProjectRewards(project: { rewards?: string }): Reward[] {
  return project.rewards ? parseProjectRewards(project.rewards) : [];
}

/**
 * 根据奖励ID从奖励字符串中获取指定的奖励
 * @param rewardId 奖励ID
 * @param rewardsString 奖励字符串数据
 * @returns 找到的奖励对象或null
 */
export function getRewardById(rewardId: number, rewardsString: string): Reward | null {
  try {
    const rewards = parseProjectRewards(rewardsString);
    return rewards.find(reward => parseInt(reward.id) === rewardId) || null;
  } catch (error) {
    console.error('Error getting reward by ID:', error);
    return null;
  }
}
