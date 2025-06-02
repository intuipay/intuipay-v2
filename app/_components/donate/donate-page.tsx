'use client'

import { useState } from 'react'
import { ArrowLeft, CircleDotIcon, HeadsetIcon } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { DonationInfo, DonationProject } from '@/types';
import { clsx } from 'clsx';
import DonationStep1 from '@/app/_components/donate/step1';
import DonationStep2 from '@/app/_components/donate/step2';
import { createDonationInfo } from '@/utils';

type Step = 'initialization' | 'contracts' | 'payment' | 'complete'
type Props = {
  project: DonationProject;
  slug: string;
}

// Steps configuration
const steps = [
  { id: 'initialization', label: 'Initialization' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'payment', label: 'Payment' },
  { id: 'complete', label: 'Complete' },
];

export default function DonationPageComp({
  project,
  slug,
}: Props) {
  // State
  const [currentStep, setCurrentStep] = useState<Step>('initialization')
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')

  // Form state
  const [paymentMethod, setPaymentMethod] = useState<string>('usdc');
  const [amount, setAmount] = useState<number | string>(1);
  const [info, setInfo] = useState<DonationInfo>(createDonationInfo(project.id));
  const [walletConnected, setWalletConnected] = useState(false);

  // Step navigation
  const goToNextStep = () => {
    setSlideDirection('right')
    if (currentStep === 'initialization') setCurrentStep('contracts')
    else if (currentStep === 'contracts') setCurrentStep('payment')
    else if (currentStep === 'payment') setCurrentStep('complete')
  }

  const goToPreviousStep = () => {
    setSlideDirection('left')
    if (currentStep === 'contracts') setCurrentStep('initialization')
    else if (currentStep === 'payment') setCurrentStep('contracts')
    else if (currentStep === 'complete') setCurrentStep('payment')
  }

  const connectWallet = () => {
    setWalletConnected(true)
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
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

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

  return (
    <main className="lg:flex lg:items-center lg:justify-center lg:py-20">
      <div className="w-full max-w-xl mx-auto bg-white lg:rounded-2xl lg:shadow-lg px-8 py-6 lg:px-10">
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
        <div className="mb-12 py-4">
          <div className={clsx('grid grid-cols-4 items-center justify-between mb-2')}>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={clsx(
                  'h-0.5 flex-1',
                  index === 0 ? 'bg-gradient-to-r from-white to-blue-600'
                    : (index > currentStepIndex ? 'bg-black/40' : 'bg-blue-600')
                )} />
                <div className="relative w-6 flex-none">
                  {index <= currentStepIndex ? (
                    <CircleDotIcon
                      className="size-6 text-blue-600"
                    />
                  ) : (
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
            {currentStep === 'initialization' && <DonationStep1
              amount={amount}
              goToNextStep={goToNextStep}
              paymentMethod={paymentMethod}
              setAmount={setAmount}
              setPaymentMethod={setPaymentMethod}
            />}

            {/* Contracts Step */}
            {currentStep === 'contracts' && <DonationStep2
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              info={info}
              setInfo={updateInfo}
            />}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                {!walletConnected ? (
                  <>
                    <div className="flex items-center justify-center relative mb-4">
                      <button onClick={goToPreviousStep} className="absolute left-0 p-1 lg:hidden">
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <h1 className="text-xl font-semibold text-center text-gray-900">Connect with your wallet</h1>
                    </div>

                    {/* Switch Network */}
                    <div className="space-y-2">
                      <Label htmlFor="network" className="text-sm text-gray-600">
                        Switch Network
                      </Label>
                      <Select defaultValue="ethereum">
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-700 text-xs">Ξ</span>
                            </div>
                            <SelectValue placeholder="Ethereum" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wallet Options */}
                    <div className="space-y-3 mt-4">
                      {/* MetaMask */}
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">M</span>
                          </div>
                          <span className="font-medium">MetaMask</span>
                        </div>
                        <span className="text-sm text-gray-500">Detected</span>
                      </div>

                      {/* WalletConnect */}
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">W</span>
                          </div>
                          <span className="font-medium">WalletConnect</span>
                        </div>
                        <span className="text-sm text-gray-500">Detected</span>
                      </div>

                      {/* Phantom */}
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">P</span>
                          </div>
                          <span className="font-medium">Phantom</span>
                        </div>
                      </div>

                      {/* Coinbase */}
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">C</span>
                          </div>
                          <span className="font-medium">Coinbase</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 lg:justify-center">
                      <Button
                        variant="outline"
                        className="flex-1 lg:flex-none lg:px-8 rounded-full"
                        onClick={goToPreviousStep}
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1 lg:flex-none lg:px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                        onClick={connectWallet}
                      >
                        Connect
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center relative mb-4">
                      <button onClick={() => setWalletConnected(false)} className="absolute left-0 p-1 lg:hidden">
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <h1 className="text-xl font-semibold text-center text-gray-900">Finish your donation</h1>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                      <p className="text-gray-600">Your are donating</p>
                      <p className="text-2xl font-semibold text-blue-600">100,016.00256041 USDC</p>
                      <p className="text-gray-600">~ 100,000 USD</p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8 lg:justify-center">
                      {/* Only show Back button on mobile */}
                      <div className="lg:hidden flex-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-full"
                          onClick={() => setWalletConnected(false)}
                        >
                          Back
                        </Button>
                      </div>
                      <Button
                        className="flex-1 lg:w-full lg:max-w-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                        onClick={goToNextStep}
                      >
                        Donate
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Complete Step */}
            {currentStep === 'complete' && (
              <div className="space-y-6 flex flex-col items-center">
                <div className="py-8">
                  <Image src="/success-icon.png" alt="Success" width={120} height={120} />
                </div>

                <div className="text-center space-y-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Thank you for your support! Your are the 145 backer now.
                  </h1>
                </div>

                <div className="w-full mt-8">
                  <Button
                    variant="outline"
                    className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-full"
                    onClick={resetForm}
                  >
                    Make new donation
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="flex items-center justify-between mt-6 py-6 text-sm font-semibold text-black px-3 sticky bottom-0 left-0 right-0 sm:static bg-white">
          <Link
            className="flex items-center gap-2 hover:text-blue-600 hover:underline transition-colors"
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
            className="hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
          >
            <HeadsetIcon className="size-4" />
            Support
          </Link>
        </footer>
      </div>
    </main>
  )
}
