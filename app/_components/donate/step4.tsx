import { ArrowLeft, TerminalIcon, Wallet, Globe } from 'lucide-react';
import { APIResponse, DonationInfo } from '@/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import omit from 'lodash-es/omit';
import { DonationMethodType, DonationStatus } from '@/constants/donation';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { parseUnits } from 'viem';
import { TransactionMessage, VersionedTransaction, LAMPORTS_PER_SOL, SystemProgram, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

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
  const [solanaTransactionHash, setSolanaTransactionHash] = useState<string>('');
  const [isSolanaTransaction, setIsSolanaTransaction] = useState<boolean>(false);
  const usdcContractAddress = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || ''; // Read from environment variable
  const universityAddress = '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86'; // TODO: fetch from api
  const universitySolanaDevnetAddress = 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1'; // Solana Devnet address for the university

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
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

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
  // Get explorer URL for transaction
  const getExplorerUrl = (txHash: string) => {
    if (isSolanaTransaction) {
      return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
    }
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
  async function saveDonationToDatabase(transactionHash: string, walletAddress?: string) {
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
          wallet_address: walletAddress || address || '',
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
    // Check donation amount validity
    if (!info.amount || info.amount <= 0) {
      setMessage('Invalid donation amount');
      return;
    }
    setIsSubmitting(true);
    setMessage('');

    // Solana transaction
    if (window?.phantom?.solana && window.phantom.solana.isConnected) {
      setIsSolanaTransaction(true);
      try {
        const instructions = [
          SystemProgram.transfer({
            fromPubkey: window.phantom.solana.publicKey,
            toPubkey: new PublicKey(universitySolanaDevnetAddress),
            lamports: info.amount * LAMPORTS_PER_SOL,
          }),
        ];

        const connection = new Connection(clusterApiUrl("devnet"));

        // get latest `blockhash`
        let blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash);

        // create v0 compatible message
        const messageV0 = new TransactionMessage({
          payerKey: window.phantom.solana.publicKey,
          recentBlockhash: blockhash,
          instructions,
        }).compileToV0Message();

        // make a versioned transaction
        const transactionV0 = new VersionedTransaction(messageV0);
        
        console.log('transactionMessage', transactionV0);

        const result = await window.phantom.solana.signAndSendTransaction(transactionV0);
        console.log('solana tx result', result);

        if (result?.signature) {
          // Set transaction hash for UI display
          setSolanaTransactionHash(result.signature);
          // Transaction successful, save to database
          await saveDonationToDatabase(result.signature, window.phantom.solana.publicKey.toString());
        } else {
          setMessage('Transaction failed: No signature returned');
          setIsSubmitting(false);
        }
      } catch (e) {
        setMessage(`Solana transaction failed: ${getReadableErrorMessage(e)}`);
        setIsSubmitting(false);
      }
      return;
    }

    // Ethereum transaction
    setIsSolanaTransaction(false);
    if (!isConnected || !address) {
      setMessage('Please connect your wallet first');
      setIsSubmitting(false);
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

      <div className="flex flex-col items-center justify-center py-5 gap-4">
        <p className="text-base sm:text-xl font-semibold text-gray-900">You are donating</p>
        <p className="text-2xl sm:text-3xl font-semibold text-blue-600">{info.amount} {info.currency}</p>
        <p className="text-base sm:text-xl font-semibold text-gray-900">~ {info.amount.toLocaleString()} USD</p>        {/* 交易状态显示 */}
        {(writeData || solanaTransactionHash) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-3 w-3 rounded-full ${
                isSolanaTransaction 
                  ? (solanaTransactionHash ? 'bg-green-600' : 'bg-blue-600')
                  : (isConfirmed ? 'bg-green-600' : isConfirming ? 'bg-yellow-500' : 'bg-blue-600')
                }`}></div>
              <span className="font-medium text-blue-800">Transaction Status</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Transaction Hash:</span>
                <a
                  href={getExplorerUrl(isSolanaTransaction ? solanaTransactionHash : writeData!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 text-xs hover:text-blue-800 underline"
                >
                  {formatAddress(isSolanaTransaction ? solanaTransactionHash : writeData!)}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  isSolanaTransaction 
                    ? (solanaTransactionHash ? 'text-green-600' : 'text-blue-600')
                    : (isConfirming ? 'text-yellow-600' : isConfirmed ? 'text-green-600' : 'text-blue-600')
                  }`}>
                  {isSolanaTransaction 
                    ? (solanaTransactionHash ? 'Confirmed ✓' : 'Pending')
                    : (isConfirming ? 'Confirming...' : isConfirmed ? 'Confirmed ✓' : 'Pending')
                  }
                </span>
              </div>
              {!isSolanaTransaction && isConfirming && (
                <div className="text-xs text-gray-500 mt-2">
                  Please wait while the transaction is being confirmed on the blockchain...
                </div>
              )}
              {((isSolanaTransaction && solanaTransactionHash) || (!isSolanaTransaction && isConfirmed)) && (
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
          isSolanaTransaction
            ? (solanaTransactionHash ? "Saving..." : isSubmitting ? "Sending Transaction..." : "Donate")
            : (isWritePending ? "Sending Transaction..." :
                isConfirming ? "Confirming..." :
                  isConfirmed ? "Saving..." :
                    "Donate")
        }
        goToPreviousStep={goToPreviousStep}
        isLoading={isSubmitting || isWritePending || isConfirming}
        isSubmittable={
          (window?.phantom?.solana?.isConnected && !isSubmitting) ||
          (!isSubmitting && !isWritePending && !isConfirming && isConnected)
        }
        onSubmit={doSubmit}
      />
    </>
  )
}
