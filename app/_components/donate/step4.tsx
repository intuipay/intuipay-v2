import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonationInfo } from '@/types';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  info: DonationInfo;
}

export default function DonationStep4({
  goToPreviousStep,
  goToNextStep,
  info,
}: Props) {
  const usd = 100;

  return (
    <>
      <div className="flex items-center justify-center relative mb-4">
        <button onClick={goToPreviousStep} className="absolute left-0">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Finish your donation</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <p className="text-gray-600">Your are donating</p>
        <p className="text-2xl font-semibold text-blue-600">{info.amount} {info.currency}</p>
        <p className="text-gray-600">~ {usd.toLocaleString()} USD</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8 lg:justify-center">
        <Button
          className="flex-1 lg:w-full lg:max-w-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          onClick={goToNextStep}
        >
          Donate
        </Button>
      </div>
    </>
  )
}
