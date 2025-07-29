import { Button } from '@/components/ui/button';
import { ProjectInfo } from '@/types';
import { CopySimpleIcon } from '@phosphor-icons/react/dist/ssr';

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
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-black">
          Thank you for your support!
        </h1>
        <p className="text-sm text-black font-medium">{project.thanks_note || `You are the ${index} backer now.`} We apperiate your support, stay tuned for our future progress.</p>
      </div>

      <div className="w-full px-6 py-4 bg-neutral-100 rounded-lg border border-black/10 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Transaction ID</span>
          <div className="flex items-center gap-1">
            <span className="text-black text-xs">1234567</span>
            <CopySimpleIcon size={16} />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Status</span>
          <span className="px-2 py-1 bg-lime-100 text-lime-800 text-xs rounded">
            Received
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Pledge Amount</span>
          <span className="text-black text-xs">123,456 USD</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Currency</span>
          <span className="text-black text-xs">123,456 USDC</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">TX Hash</span>
          <div className="flex items-center gap-1">
            <span className="text-black text-xs">123456781234567812345678</span>
            <CopySimpleIcon size={16} />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Reward</span>
          <span className="text-black text-xs">Reward name</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">From</span>
          <span className="text-black text-xs">Zoe Zhang</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">To</span>
          <span className="text-black text-xs">Intuipay Foundation</span>
        </div>
      </div>

      <div className="w-full mt-8">
        <Button
          variant="outline"
          className="w-full h-12 text-base font-semibold bg-blue-50 text-blue-600 border-blue-500 hover:bg-blue-100 hover:text-blue-500 py-3 rounded-full"
          onClick={reset}
        >
          Make new pledge
        </Button>
      </div>
    </div>
  )
}
