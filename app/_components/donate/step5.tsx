import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Props = {
  index: number;
  reset: () => void;
}

export default function DonationStep5({
  index,
  reset,
}: Props) {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="py-8">
        <Image src="/success-icon.png" alt="Success" width={120} height={120} />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-gray-900">
          Thank you for your support! Your are the {index} backer now.
        </h1>
      </div>

      <div className="w-full mt-8">
        <Button
          variant="outline"
          className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-full"
          onClick={reset}
        >
          Make new donation
        </Button>
      </div>
    </div>
  )
}
