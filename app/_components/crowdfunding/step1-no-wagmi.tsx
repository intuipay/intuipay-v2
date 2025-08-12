import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { ProjectInfo, Reward } from '@/types';

type Props = {
  amount: number | '';
  goToNextStep: () => void;
  paymentMethod: string;
  setAmount: (value: number | '') => void;
  setPaymentMethod: (value: string) => void;
  selectedWallet: string;
  setSelectedWallet: (value: string) => void;
  network: string;
  setNetwork: (network: string) => void;
  dollar: number | null;
  setDollar: (value: number | null) => void;
  project: ProjectInfo;
  
  // 奖励相关props
  selectedReward?: Reward | null;
  setSelectedReward: (reward: Reward | null) => void;
  hasSelectedReward: boolean;
  setHasSelectedReward: (hasSelected: boolean) => void;
  pledgeWithoutReward: boolean;
  setPledgeWithoutReward: (pledgeWithout: boolean) => void;
}

export default function Step1NoWagmi({
  amount,
  paymentMethod,
  setAmount,
  setPaymentMethod,
  selectedWallet,
  network,
  setNetwork,
  setDollar,
  project,
  selectedReward,
  setSelectedReward,
  hasSelectedReward,
  setHasSelectedReward,
  pledgeWithoutReward,
  setPledgeWithoutReward,
}: Props) {
  // 将 project.rewards 字符串转换为 Reward[] 格式
  const parseProjectRewards = (rewardsString: string): Reward[] => {
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
      const getAvailability = (number: number, count: number | null): string => {
        if (number === 0) return 'Unlimited';
        if (count !== null) return `Limited (${count} left of ${number})`;
        return `Limited (${number} available)`;
      };
      
      return rawRewards.map((reward: any) => ({
        id: reward.id.toString(),
        name: reward.title || 'Untitled Reward',
        description: reward.description || 'No description available',
        amount: reward.amount || 0,
        shipping_method: getShippingMethod(reward.ship_method),
        estimated_delivery: getEstimatedDelivery(reward.month, reward.year),
        availability: getAvailability(reward.number, reward.count),
      }));
    } catch (error) {
      console.error('Error parsing project rewards:', error);
      return [];
    }
  };
  
  // 从项目数据中获取转换后的奖励
  const projectRewards = project.rewards ? parseProjectRewards(project.rewards) : [];

  // 处理奖励选择
  const handleRewardSelect = (reward: Reward) => {
    setSelectedReward(reward);
    setDollar(reward.amount);
    setPledgeWithoutReward(false); // 选择奖励时取消 checkbox
  };

  // 处理无奖励捐赠
  const handlePledgeWithoutReward = () => {
    setSelectedReward(null); // 选择无奖励时取消选中的奖励
    setPledgeWithoutReward(true);
    setDollar(null);
    setAmount('');
  };

  // 处理继续到下一步
  const handleRewardNext = () => {
    setHasSelectedReward(true);
  };

  return (
    <div className="space-y-6 pt-8">
      <h2 className="text-xl font-semibold text-center text-black">
        Select your reward
      </h2>
      
      {/* 奖励列表 */}
      <div className="space-y-4">
        {projectRewards.map((reward) => (
          <div
            key={reward.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedReward?.id === reward.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleRewardSelect(reward)}
          >
            {/* 奖励图片占位符 */}
            <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{reward.name}</h3>
              <span className="font-bold text-lg">${reward.amount}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <div className="font-medium">Shipping method</div>
                <div>{reward.shipping_method}</div>
              </div>
              <div>
                <div className="font-medium">Estimated delivery</div>
                <div>{reward.estimated_delivery}</div>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              <div className="font-medium">Availability</div>
              <div>{reward.availability}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-right">
        <span className="text-blue-600 underline text-sm cursor-pointer">
          Rewards aren't guaranteed
        </span>
      </div>
      
      {/* 继续按钮 */}
      <CtaFooter
        buttonLabel="Next"
        buttonType="button"
        isSubmittable={selectedReward !== null || pledgeWithoutReward}
        isLoading={false}
        onSubmit={handleRewardNext}
      >
        <div className="col-span-2 flex items-center justify-center space-x-2 relative z-[1] mb-3">
          <Checkbox
            id="pledge-without-reward"
            checked={pledgeWithoutReward}
            onCheckedChange={(checked) => {
              if (checked) {
                handlePledgeWithoutReward();
              } else {
                setPledgeWithoutReward(false);
                setSelectedReward(null);
              }
            }}
          />
          <Label htmlFor="pledge-without-reward" className="text-sm font-medium">
            Pledge without reward
          </Label>
        </div>
      </CtaFooter>
    </div>
  );
}
