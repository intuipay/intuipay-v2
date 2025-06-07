'use client'

import { useMemo, useState } from 'react'
import { CircleDotIcon, HeadsetIcon } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'
import { DonationInfo, DonationProject } from '@/types';
import { clsx } from 'clsx';
import DonationStep1 from '@/app/_components/donate/step1';
import DonationStep2 from '@/app/_components/donate/step2';
import DonationStep3 from '@/app/_components/donate/step3';
import DonationStep4 from '@/app/_components/donate/step4';
import DonationStep5 from '@/app/_components/donate/step5';
import { createDonationInfo } from '@/utils';

type Step = 'initialization' | 'contracts' | 'payment' | 'confirm' | 'complete'
type Props = {
  project: DonationProject;
  slug: string;
}

// Steps configuration
const steps = [
  { id: 'initialization', label: 'Initialization' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirm', label: 'Confirm' },
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
}: Props) {
  // State
  const [currentStep, setCurrentStep] = useState<Step>('initialization')
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')
  // Form state
  const [info, setInfo] = useState<DonationInfo>(createDonationInfo(project.id));

  // Step navigation
  const goToNextStep = () => {
    setSlideDirection('right')
    if (currentStep === 'initialization') setCurrentStep('contracts')
    else if (currentStep === 'contracts') setCurrentStep('payment')
    else if (currentStep === 'payment') setCurrentStep('confirm')
    else  if (currentStep === 'confirm') setCurrentStep('complete')
  }
  const goToPreviousStep = () => {
    setSlideDirection('left')
    if (currentStep === 'contracts') setCurrentStep('initialization')
    else if (currentStep === 'payment') setCurrentStep('contracts')
    else if (currentStep === 'confirm') setCurrentStep('payment')
  }

  function resetForm() {
    setSlideDirection('left')
    setCurrentStep('initialization')
    setInfo(createDonationInfo(project.id));
  }
  function updateInfo(newInfo: Partial<DonationInfo>) {
    setInfo((prev) => ({
      ...prev,
      ...newInfo,
    }));
  }

  // Get current step index
  const currentStepIndex = useMemo(() => {
    return steps.findIndex((step) => step.id === currentStep);
  }, [currentStep]);

  return (
    <main className="lg:flex lg:items-center lg:justify-center lg:py-20">
      <div className="w-full max-w-xl mx-auto bg-white lg:rounded-2xl lg:shadow-lg px-8 pt-6  lg:px-10">
        {/* Hero Image */}
        <div className="relative w-full aspect-[3/1] rounded-lg mb-4">
          <Image
            src={project.banner}
            alt="Lion King inspired scene with lions silhouetted against full moon"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Progress Steps */}
        <div className="mb-4 py-4">
          <div className={clsx('grid grid-cols-4 items-center justify-between mb-2')}>
            {steps.map((step, index) => (
              index === 3 ? null : <div key={step.id} className="flex items-center">
                <div className={clsx(
                  'h-0.5 flex-1',
                  index === 0 ? 'bg-gradient-to-r from-white to-blue-600'
                    : (index > currentStepIndex ? 'bg-black/40' : 'bg-blue-600')
                )} />
                <div className="relative w-6 flex-none">
                  {index < currentStepIndex && (
                    <Image
                      alt="Check Icon"
                      className="size-6"
                      width={24}
                      height={24}
                      src="/images/icon/check-circle-active.svg"
                    />
                  )}
                  {index === currentStepIndex && (
                    <CircleDotIcon className="size-6 text-blue-600" />
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
              index === 3 ? null : <span
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
            {currentStep === 'initialization' && <DonationStep1
              amount={info.amount}
              goToNextStep={goToNextStep}
              paymentMethod={info.currency}
              setAmount={value => updateInfo({ amount: value })}
              setPaymentMethod={value => updateInfo({ currency: value })}
            />}

            {/* Contracts Step */}
            {currentStep === 'contracts' && <DonationStep2
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              info={info}
              setInfo={updateInfo}
            />}

            {/* Payment Step */}
            {currentStep === 'payment' && <DonationStep3
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
            />}

            {currentStep === 'confirm' && <DonationStep4
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              info={info}
            />}

            {/* Complete Step */}
            {currentStep === 'complete' && <DonationStep5
              index={info.id}
              reset={resetForm}
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
