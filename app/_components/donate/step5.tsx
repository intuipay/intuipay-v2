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
      <Image
        src="/images/success.svg"
        alt="Success donated"
        className="w-full aspect-[12/5] block"
        width={480} height={200}
      />

      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-gray-900">
          Thank you for your support! You are the {index} backer now.
        </h1>
      </div>

      <div className="w-full mt-8">
        <Button
          variant="outline"
          className="w-full h-12 text-base font-semibold bg-blue-50 text-blue-600 border-blue-500 hover:bg-blue-100 hover:text-blue-500 py-3 rounded-full"
          onClick={reset}
        >
          Make new donation
        </Button>
      </div>
    </div>
  )
}
