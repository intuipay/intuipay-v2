'use client'

import { useMemo, useState, useEffect } from 'react'
import { CircleDotIcon, HeadsetIcon } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'
import { DonationInfo, ProjectInfo, Reward } from '@/types';
import { clsx } from 'clsx';
import DonationStep1 from '@/app/_components/crowdfunding/step1';
import DonationStep2 from '@/app/_components/crowdfunding/step2';
import DonationStep4 from '@/app/_components/crowdfunding/step4';
import DonationStep5 from '@/app/_components/crowdfunding/step5';
import { createDonationInfo } from '@/utils';
import { getNetworkDropdownOptionsFromProject } from '@/config/blockchain';
import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr';

type Step = 'initialization' | 'contacts' | 'payment' | 'complete'
type Props = {
  project: ProjectInfo;
  slug: string;
  defaultSelectedRewardId?: string;
}

// Steps configuration
const steps = [
  { id: 'initialization', label: 'Initialization' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'payment', label: 'Payment' },
  { id: 'complete', label: 'Complete' },
];
// Slide animation variants
const slideVariants = {
  enterFromRight: {
    x: 300,
    opacity: 0,
  },
  enterFromLeft: {
    x: -300,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exitToLeft: {
    x: -300,
    opacity: 0,
  },
  exitToRight: {
    x: 300,
    opacity: 0,
  },
}

export default function DonationPageComp({
  project,
  slug,
  defaultSelectedRewardId,
}: Props) {
  // State
  const [currentStep, setCurrentStep] = useState<Step>('initialization')
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')
  const [info, setInfo] = useState<DonationInfo>(createDonationInfo(project.id));
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(project);
  // Transaction info state for step 5
  const [transactionInfo, setTransactionInfo] = useState<{
    hash?: string;
    walletAddress?: string;
    recipientAddress?: string;
  }>({});
  // Network state management
  const [network, setNetwork] = useState<string>(() => {
    const networkOptions = getNetworkDropdownOptionsFromProject(project); // 从project里面读出支持的网络列表
    const firstNetwork = networkOptions.length > 0 ? networkOptions[ 0 ].value || '' : '';

    return firstNetwork;
  });
  // Dollar amount state (for real-time USD conversion)
  const [dollar, setDollar] = useState<number | null>(info.amount || 0);
  // Get current step index
  const currentStepIndex = useMemo(() => {
    return steps.findIndex((step) => step.id === currentStep);
  }, [currentStep]);

  // Combined network setter that updates both local state and info
  const handleSetNetwork = (newNetwork: string) => {
    setNetwork(newNetwork);
    updateInfo({ network: newNetwork });
  };

  // Combined reward setters that update info
  const handleSetSelectedReward = (reward: Reward | null) => {
    updateInfo({ selected_reward: reward });
  };

  const handleSetHasSelectedReward = (hasSelected: boolean) => {
    updateInfo({ has_selected_reward: hasSelected });
  };

  const handleSetPledgeWithoutReward = (pledgeWithout: boolean) => {
    updateInfo({ pledge_without_reward: pledgeWithout });
  };

  // 解析项目奖励数据
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
      const getAvailability = (number: number | null, count: number): string => {
        if (!number) return 'Unlimited';
        const used = Number.isFinite(count) ? count : 0;
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
        image: reward.image || '',
      }));
    } catch (error) {
      console.error('Error parsing project rewards:', error);
      return [];
    }
  };

  // 从项目数据中获取转换后的奖励
  const projectRewards = project.rewards ? parseProjectRewards(project.rewards) : [];

  // 处理 URL 中的 defaultSelectedRewardId 参数
  useEffect(() => {
    if (defaultSelectedRewardId && projectRewards.length > 0) {
      const targetReward = projectRewards.find(reward => reward.id === defaultSelectedRewardId);
      if (targetReward) {
        // 自动选中对应的奖励
        handleSetSelectedReward(targetReward);
        setDollar(targetReward.amount);
        handleSetPledgeWithoutReward(false);
        // 直接跳转到钱包连接步骤
        handleSetHasSelectedReward(true);
        console.log(`Auto-selected reward: ${targetReward.name} (ID: ${defaultSelectedRewardId})`);
      }
    }
  }, [defaultSelectedRewardId, projectRewards.length]);

  function onMessage(event: MessageEvent) {
    console.log('onMessage', event);
    const allowedOrigins = [
      'http://localhost:3000',
      'https://intuipay.com',
      'https://dash.intuipay.com',
    ];
    if (!allowedOrigins.includes(event.origin)) return;

    const { type, data } = event.data;
    switch (type) {
      case 'update':
        const {
          banner,
          brandColor,
          projectCta,
          thanksNote,
        } = data;
        setProjectInfo({
          ...projectInfo,
          banner,
          brand_color: brandColor,
          project_cta: projectCta,
          thanks_note: thanksNote,
        });
        break;

      case 'step':
        setCurrentStep(data.step);
        break;
    }
  }

  // Step navigation
  const goToNextStep = () => {
    setSlideDirection('right')
    if (currentStep === 'initialization') setCurrentStep('contacts')
    else if (currentStep === 'contacts') setCurrentStep('payment')
    else  if (currentStep === 'payment') setCurrentStep('complete')
  }
  const goToPreviousStep = () => {
    setSlideDirection('left')
    if (currentStep === 'contacts') setCurrentStep('initialization')
    else if (currentStep === 'payment') setCurrentStep('contacts')
  }
  function resetForm() {
    setSlideDirection('left')
    setCurrentStep('initialization')
    setInfo(createDonationInfo(project.id));

    // 重置表单后，本来应该记住上一次选择的网络，但是因为createDonationInfo清空了所有信息，
    // 所以从 network 里面找到上一次选中的网络，更新 info
    setNetwork(network);
    updateInfo({ network })
  }
  function updateInfo(newInfo: Partial<DonationInfo>) {
    setInfo((prev) => ({
      ...prev,
      ...newInfo,
    }));
  }

  useEffect(() => {
    window.addEventListener('message', onMessage, false);
    const hash = window.location.hash;
    if (!hash) return;
    const step = hash.replace('#', '');
    if (steps.some((s) => s.id === step)) {
      setCurrentStep(step as Step);
    }
    return () => {
      window.removeEventListener('message', onMessage, false);
    }
  }, []);
  useEffect(() => {
    updateInfo({ network });
  }, [network]);

  return (
    <main className="lg:flex lg:items-center lg:justify-center lg:py-20">
      <div
        className="w-full max-w-xl mx-auto bg-white lg:rounded-2xl lg:shadow-lg px-8 pt-6  lg:px-10"
        style={{
          '--brand-color': project.brand_color,
        } as React.CSSProperties}
      >
        {/* Hero Image */}
        <div className="relative w-full aspect-[3/1] rounded-lg mb-4 overflow-hidden">
          {projectInfo.banner
            ? <Image
                src={projectInfo.banner}
                alt={projectInfo.project_name}
                fill
                className="object-cover object-center"
                priority
                />
            : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-black/50">
              {projectInfo.project_name}
            </div>}
        </div>

        {/* Progress Steps */}
        <div className="mb-4 py-4">
          <div className={clsx('grid grid-cols-4 items-center justify-between mb-2')}>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={clsx(
                  'h-0.5 flex-1',
                  index === 0 ? 'bg-gradient-to-r from-white to-blue-600'
                    : (index > currentStepIndex ? 'bg-black/40' : 'bg-blue-600')
                )} />
                <div className="relative w-6 flex-none">
                  {index < currentStepIndex && (
                    <CheckCircleIcon
                      className="size-6 text-[var(--brand-color)]"
                      weight="fill"
                    />
                  )}
                  {index === currentStepIndex && (
                    <CircleDotIcon className="size-6 text-[var(--brand-color)]" />
                  )}
                  {index > currentStepIndex && (
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-black/40" />
                  )}
                </div>
                <div className={clsx(
                  'h-0.5 flex-1',
                  index === steps.length - 1
                    ? 'bg-gradient-to-l from-white ' + (index < currentStepIndex ? 'to-blue-600' : 'to-black/40')
                    : (index < currentStepIndex ? 'bg-blue-600' : 'bg-black/40')
                )} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 text-center text-sm font-medium">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={`${index <= currentStepIndex ? 'text-blue-600' : 'text-black/40'}`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={slideDirection === 'right' ? 'enterFromRight' : 'enterFromLeft'}
            animate="center"
            exit={slideDirection === 'right' ? 'exitToLeft' : 'exitToRight'}
            variants={slideVariants}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Initialization Step */}
            {currentStep === 'initialization' && (
              <DonationStep1
                amount={info.amount}
                goToNextStep={goToNextStep}
                paymentMethod={info.currency}
                setAmount={value => updateInfo({ amount: value })}
                setPaymentMethod={value => updateInfo({ currency: value })}
                selectedWallet={info.wallet}
                setSelectedWallet={value => updateInfo({ wallet: value })}
                network={network}
                setNetwork={handleSetNetwork}
                dollar={dollar}
                setDollar={value => {
                  setDollar(value);
                  updateInfo({ dollar: typeof value === 'number' ? value : null });
                }}
                project={projectInfo}
                selectedReward={info.selected_reward}
                setSelectedReward={handleSetSelectedReward}
                hasSelectedReward={info.has_selected_reward || false}
                setHasSelectedReward={handleSetHasSelectedReward}
                pledgeWithoutReward={info.pledge_without_reward || false}
                setPledgeWithoutReward={handleSetPledgeWithoutReward}
              />
            )}

            {/* Contracts Step */}
            {currentStep === 'contacts' && <DonationStep2
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              info={info}
              setInfo={updateInfo}
            />}

            {currentStep === 'payment' && <DonationStep4
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              info={info}
              project={projectInfo}
              onTransactionInfo={setTransactionInfo}
            />}

            {/* Complete Step */}
            {currentStep === 'complete' && <DonationStep5
              index={info.index || 1}
              reset={resetForm}
              project={projectInfo}
              info={info}
              transactionHash={transactionInfo.hash}
              walletAddress={transactionInfo.walletAddress}
              recipientAddress={transactionInfo.recipientAddress}
            />}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="flex items-center justify-between mt-2 sm:mt-6 py-6 text-sm font-semibold text-black px-3 sticky bottom-0 left-0 right-0 sm:static bg-white">
          <Link
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            href="/"
          >
            <span>Powered by</span>
            <Image
              alt="Intuipay Logo"
              className="h-3.5"
              src="/images/intuipay-logo.svg"
              width={71}
              height={14}
              loading="lazy"
            />
          </Link>
          <Link
            href="/donate/support"
            className="hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            <HeadsetIcon className="size-4" />
            Support
          </Link>
        </footer>
      </div>
    </main>
  )
}
