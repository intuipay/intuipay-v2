import { Button } from '@/components/ui/button';
import { ProjectInfo, DonationInfo } from '@/types';
import { CopySimpleIcon } from '@phosphor-icons/react/dist/ssr';
import { getExplorerUrl, formatAddress } from '@/config/blockchain';
import { useState } from 'react';

type Props = {
  index: number;
  project: ProjectInfo;
  info: DonationInfo;
  reset: () => void;
  transactionHash?: string;
  walletAddress?: string;
  recipientAddress?: string;
}

export default function DonationStep5({
  index,
  info,
  project,
  reset,
  transactionHash,
  walletAddress,
  recipientAddress,
}: Props) {
  const [copiedItem, setCopiedItem] = useState<string>('');

  // 复制到剪贴板的函数
  const copyToClipboard = async (text: string, itemType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemType);
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // 获取区块链浏览器链接
  const getTransactionExplorerUrl = () => {
    if (!transactionHash || !info.network) return '#';
    return getExplorerUrl(info.network, transactionHash);
  };

  // 格式化地址显示
  const formatTransactionAddress = (address: string) => {
    return formatAddress(address);
  };
  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-black">
          Thank you for your support! You are the {info.index || 1} backer now.
        </h1>
        <p className="text-sm text-black font-medium">{project.thanks_note || `You are the ${index} backer now.`} We apperiate your support, stay tuned for our future progress.</p>
      </div>

      <div className="w-full px-6 py-4 bg-neutral-100 rounded-lg border border-black/10 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Transaction ID</span>
          <div className="flex items-center gap-1">
            <span className="text-black text-xs">{info.id || 'N/A'}</span>
            <button 
              onClick={() => copyToClipboard(info.id?.toString() || '', 'transactionId')}
              className="hover:bg-black/10 p-1 rounded"
            >
              <CopySimpleIcon size={16} className={copiedItem === 'transactionId' ? 'text-green-600' : ''} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Status</span>
          <span className="px-2 py-1 bg-lime-100 text-lime-800 text-xs rounded">
            Confirmed
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Pledge Amount</span>
          <span className="text-black text-xs">{info.amount} {info.currency}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">TX Hash</span>
          <div className="flex items-center gap-1">
            {transactionHash ? (
              <>
                <a
                  href={getTransactionExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs hover:text-blue-800 underline font-mono"
                >
                  {formatTransactionAddress(transactionHash)}
                </a>
                <button 
                  onClick={() => copyToClipboard(transactionHash, 'txHash')}
                  className="hover:bg-black/10 p-1 rounded"
                >
                  <CopySimpleIcon size={16} className={copiedItem === 'txHash' ? 'text-green-600' : ''} />
                </button>
              </>
            ) : (
              <span className="text-black text-xs">N/A</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">Reward</span>
          <span className="text-black text-xs">
            {info.selected_reward?.name || 'No reward selected'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">From</span>
          <div className="flex items-center gap-1">
            {walletAddress ? (
              <>
                <span className="text-black text-xs font-mono">
                  {formatTransactionAddress(walletAddress)}
                </span>
                <button 
                  onClick={() => copyToClipboard(walletAddress, 'fromAddress')}
                  className="hover:bg-black/10 p-1 rounded"
                >
                  <CopySimpleIcon size={16} className={copiedItem === 'fromAddress' ? 'text-green-600' : ''} />
                </button>
              </>
            ) : (
              <span className="text-black text-xs">N/A</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-black/60 text-xs">To</span>
          <div className="flex items-center gap-1">
            {recipientAddress ? (
              <>
                <span className="text-black text-xs font-mono">
                  {formatTransactionAddress(recipientAddress)}
                </span>
                <button 
                  onClick={() => copyToClipboard(recipientAddress, 'toAddress')}
                  className="hover:bg-black/10 p-1 rounded"
                >
                  <CopySimpleIcon size={16} className={copiedItem === 'toAddress' ? 'text-green-600' : ''} />
                </button>
              </>
            ) : (
              <span className="text-black text-xs">Project Wallet</span>
            )}
          </div>
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
