import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProjectInfo } from '@/types';

type Props = {
  index: number;
  project: ProjectInfo;
  reset: () => void;
}

export default function DonationStep5({
  index,
  project,
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
        <h1 className="text-xl font-semibold text-black">
          Thank you for your donation!
        </h1>
        <p className="text-sm text-black font-medium">{project.thanks_note || `You are the ${index} backer now.`}</p>
      </div>

      <div className="w-full mt-8">
        <Button
          variant="outline"
          className="w-full h-12 text-base font-semibold bg-[var(--brand-color)]/10 text-[var(--brand-color)] border-[var(--brand-color)] hover:bg-[var(--brand-color)]/15 py-3 rounded-full"
          onClick={reset}
        >
          Make new donation
        </Button>
      </div>
    </div>
  )
}
