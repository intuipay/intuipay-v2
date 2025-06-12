import { ArrowLeft, TerminalIcon, Wallet, Globe } from 'lucide-react';
import { APIResponse, DonationInfo } from '@/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import omit from 'lodash-es/omit';
import { DonationMethodType, DonationStatus } from '@/constants/donation';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { useAccount, useChainId, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { parseUnits } from 'viem';
import Image from 'next/image';

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const usdcContractAddress = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || ''; // Read from environment variable
  const universityAddress = '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86'; // TODO: fetch from api

  // USDC合约ABI (ERC-20标准)
  const usdcAbi = [
    {
      name: 'transfer',
      type: 'function',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable'
    },
    {
      name: 'decimals',
      type: 'function',
      inputs: [],
      outputs: [{ name: '', type: 'uint8' }],
      stateMutability: 'view'
    },
    {
      name: 'balanceOf',
      type: 'function',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view'
    }
  ] as const;

  // wagmi hooks
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  // 写入合约钩子
  const { writeContract, data: writeData, isPending: isWritePending, error: writeError } = useWriteContract();

  // 等待交易确认钩子
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });  // 监听交易确认状态
  useEffect(() => {
    if (isConfirmed && writeData) {
      // 交易确认成功，保存到数据库
      saveDonationToDatabase(writeData);
    }
    if (confirmError) {
      setMessage(`Transaction failed: ${getReadableErrorMessage(confirmError)}`);
      setIsSubmitting(false);
    }
    if (writeError) {
      setMessage(getReadableErrorMessage(writeError));
      setIsSubmitting(false);
    }
  }, [isConfirmed, confirmError, writeError, writeData]);

  // Get network name
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case mainnet.id:
        return 'Ethereum Mainnet';
      case sepolia.id:
        return 'Sepolia Testnet';
      default:
        return `Chain ${chainId}`;
    }
  };

  // Get wallet name
  const getWalletName = (connectorId: string) => {
    switch (connectorId) {
      case 'metaMaskSDK':
        return 'MetaMask';
      case 'coinbaseWalletSDK':
        return 'Coinbase Wallet';
      case 'walletConnect':
        return 'WalletConnect';
      default:
        return connectorId;
    }
  };

  // Get explorer URL for transaction
  const getExplorerUrl = (txHash: string) => {
    const baseUrl = chainId === mainnet.id
      ? 'https://etherscan.io/tx/'
      : 'https://sepolia.etherscan.io/tx/';
    return `${baseUrl}${txHash}`;
  };

  // Format address display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 处理用户友好的错误信息
  const getReadableErrorMessage = (error: Error | any) => {
    const errorMessage = error?.message || String(error);

    // 用户拒绝交易
    if (errorMessage.includes('User rejected') ||
      errorMessage.includes('user rejected') ||
      errorMessage.includes('User denied') ||
      errorMessage.includes('rejected') ||
      errorMessage.includes('denied')) {
      return 'Transaction cancelled by user';
    }

    // 如果是其他未知错误，返回简化的错误信息
    if (errorMessage.length > 100) {
      return 'Transaction failed. Please try again or contact the support team.';
    }

    return errorMessage;
  };

  // 保存捐赠数据到数据库
  async function saveDonationToDatabase(transactionHash: `0x${string}`) {
    try {
      const response = await fetch('/api/donation', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ...omit(info, ['id', 'created_at', 'updated_at']),
          has_tax_invoice: Number(info.has_tax_invoice),
          is_anonymous: Number(info.is_anonymous),
          account: '',
          method: DonationMethodType.Crypto,
          status: DonationStatus.Successful,
          tx_hash: transactionHash,
          wallet_address: address || '',
        }),
      });

      if (!response.ok) {
        setMessage('Error saving donation: ' + response.statusText);
        setIsSubmitting(false);
        return;
      }

      const { data } = (await response.json()) as APIResponse<number>;
      info.id = data;
      setIsSubmitting(false);
      goToNextStep();
    } catch (e) {
      setMessage(`Error saving donation: ${getReadableErrorMessage(e)}`);
      setIsSubmitting(false);
    }
  }
  async function doSubmit() {
    if (!isConnected || !address) {
      setMessage('Please connect your wallet first');
      return;
    }

    // 检查网络是否支持 (这里假设 USDC 合约在 mainnet 或 sepolia 上)
    if (chainId !== mainnet.id && chainId !== sepolia.id) {
      setMessage('Please switch to Ethereum Mainnet or Sepolia Testnet');
      return;
    }

    // 检查捐赠金额是否有效
    if (!info.amount || info.amount <= 0) {
      setMessage('Invalid donation amount');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // 将捐赠金额转换为 USDC 的最小单位 (6位小数)
      const amount = parseUnits(info.amount.toString(), 6);

      // 发起 USDC 转账交易
      writeContract({
        address: usdcContractAddress as `0x${string}`,
        abi: usdcAbi,
        functionName: 'transfer',
        args: [universityAddress as `0x${string}`, amount],
      });

    } catch (e) {
      setMessage(getReadableErrorMessage(e));
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center relative mb-12">
        <button
          onClick={goToPreviousStep}
          className="absolute left-0 hidden sm:block"
          title="Go back to previous step"
          aria-label="Go back to previous step"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Finish your donation</h1>
      </div>

      {/* Wallet connection status */}
      {isConnected && address && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Wallet Connected</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Wallet Type:</span>
              <div className="flex items-center gap-2">
                {connector?.id === 'metaMaskSDK' && (
                  <Image src="/images/logo/metamask.svg" width={16} height={16} alt="MetaMask" />
                )}
                {connector?.id === 'coinbaseWalletSDK' && (
                  <Image src="/images/logo/coinbase.svg" width={16} height={16} alt="Coinbase" />
                )}
                {connector?.id === 'walletConnect' && (
                  <Image src="/images/logo/wallet-connect.svg" width={16} height={16} alt="WalletConnect" />
                )}
                <span className="font-medium text-gray-900">
                  {getWalletName(connector?.id || '')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Wallet Address:</span>
              <span className="font-mono text-gray-900">{formatAddress(address)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Network:</span>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {getNetworkName(chainId)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-green-200">
            <button
              onClick={() => disconnect()}
              className="text-sm text-green-700 hover:text-green-800 underline"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Wallet not connected warning */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">No wallet connection detected</p>
              <p className="text-sm text-yellow-700 mt-1">
                Please go back to the previous step to connect your wallet
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-5 gap-4">
        <p className="text-base sm:text-xl font-semibold text-gray-900">You are donating</p>
        <p className="text-2xl sm:text-3xl font-semibold text-blue-600">{info.amount} {info.currency}</p>
        <p className="text-base sm:text-xl font-semibold text-gray-900">~ {info.amount.toLocaleString()} USD</p>
        {/* 交易状态显示 */}
        {writeData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-3 w-3 rounded-full ${isConfirmed ? 'bg-green-600' : isConfirming ? 'bg-yellow-500' : 'bg-blue-600'
                }`}></div>
              <span className="font-medium text-blue-800">Transaction Status</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Transaction Hash:</span>
                <a
                  href={getExplorerUrl(writeData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 text-xs hover:text-blue-800 underline"
                >
                  {formatAddress(writeData)}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${isConfirming ? 'text-yellow-600' :
                  isConfirmed ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                  {isConfirming ? 'Confirming...' : isConfirmed ? 'Confirmed ✓' : 'Pending'}
                </span>
              </div>
              {isConfirming && (
                <div className="text-xs text-gray-500 mt-2">
                  Please wait while the transaction is being confirmed on the blockchain...
                </div>
              )}
              {isConfirmed && (
                <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <span>✓</span>
                  <span>Transaction successfully confirmed!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6">
        {message && (
          <Alert
            className="mb-4"
            variant="destructive"
          >
            <TerminalIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>

      <CtaFooter
        buttonLabel={
          isWritePending ? "Sending Transaction..." :
            isConfirming ? "Confirming..." :
              isConfirmed ? "Saving..." :
                "Donate"
        }
        goToPreviousStep={goToPreviousStep}
        isLoading={isSubmitting || isWritePending || isConfirming}
        isSubmittable={!isSubmitting && !isWritePending && !isConfirming && isConnected}
        onSubmit={doSubmit}
      />
    </>
  )
}
