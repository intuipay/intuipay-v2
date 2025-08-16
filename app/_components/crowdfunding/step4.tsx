import { ArrowLeft, TerminalIcon } from 'lucide-react';
import { APIResponse, DonationInfo } from '@/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import omit from 'lodash-es/omit';
import { DonationStatus } from '@/data/project';
import { ProjectDonationMethods } from '@/data';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import {
  BLOCKCHAIN_CONFIG,
  getProjectWalletAddress,
  getCurrencyNetworkConfig,
  getExplorerUrl,
  formatAddress,
  convertToSmallestUnit,
} from '@/config/blockchain';
import { ProjectInfo } from '@/types';
import crowdFundingABI from '@/lib/crowdFunding.abi.json';
import ERC20_ABI from '@/lib/erc20.abi.json';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  info: DonationInfo;
  project: ProjectInfo;
  onTransactionInfo?: (info: {
    hash?: string;
    walletAddress?: string;
    recipientAddress?: string;
  }) => void;
}

export default function DonationStep4({
  goToPreviousStep,
  goToNextStep,
  info,
  project,
  onTransactionInfo,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [solanaTransactionHash, setSolanaTransactionHash] = useState<string>('');
  const [isSolanaTransaction, setIsSolanaTransaction] = useState<boolean>(false);
  const [riskAcknowledged, setRiskAcknowledged] = useState<boolean>(false);
  // 动态获取配置
  const networkConfig = BLOCKCHAIN_CONFIG.networks[ info.network as keyof typeof BLOCKCHAIN_CONFIG.networks ];
  const currencyConfig = BLOCKCHAIN_CONFIG.currencies[ info.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies ];
  const currencyNetworkConfig = getCurrencyNetworkConfig(info.currency, info.network);
  const recipientAddress = getProjectWalletAddress(project, info.network); // 读出众筹合约地址

  console.log('debug recipientAddress:', recipientAddress);

  console.log('debug reward id: ', info.selected_reward, project.project_slug);

  // wagmi hooks
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // 写入合约钩子（用于 ERC-20 代币）
  const { writeContract, data: writeData, isPending: isWritePending, error: writeError } = useWriteContract();

  // 发送交易钩子（用于原生代币）
  const { sendTransaction, data: sendData, isPending: isSendPending, error: sendError } = useSendTransaction();

  // 状态管理：是否正在进行两步 ERC-20 授权流程
  const [isApprovingERC20, setIsApprovingERC20] = useState<boolean>(false);
  const [approvalTxHash, setApprovalTxHash] = useState<string>('');

  // 等待交易确认钩子（合约交易）
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // 等待交易确认钩子（原生代币交易）
  const {
    isLoading: isSendConfirming,
    isSuccess: isSendConfirmed,
    error: sendConfirmError
  } = useWaitForTransactionReceipt({
    hash: sendData,
  });  // 监听交易确认状态
  useEffect(() => {
    // 处理合约交易确认
    if (isConfirmed && writeData) {
      if (isApprovingERC20) {
        // 这是授权交易的确认
        console.log('ERC-20 approval confirmed, proceeding with transfer');
        setApprovalTxHash(writeData);
        setIsApprovingERC20(false);
        // 授权完成后，执行实际的转账
        proceedWithERC20Transfer();
      } else {
        // 这是实际转账交易的确认，保存到数据库
        saveDonationToDatabase(writeData);
      }
    }
    if (confirmError) {
      if (isApprovingERC20) {
        setMessage(`Approval failed: ${getReadableErrorMessage(confirmError)}`);
        setIsApprovingERC20(false);
      } else {
        setMessage(`Transaction failed: ${getReadableErrorMessage(confirmError)}`);
      }
      setIsSubmitting(false);
    }
    if (writeError) {
      if (isApprovingERC20) {
        setMessage(`Approval failed: ${getReadableErrorMessage(writeError)}`);
        setIsApprovingERC20(false);
      } else {
        setMessage(getReadableErrorMessage(writeError));
      }
      setIsSubmitting(false);
    }

    // 处理原生代币交易
    if (isSendConfirmed && sendData) {
      // 交易确认成功，保存到数据库
      saveDonationToDatabase(sendData);
    }
    if (sendConfirmError) {
      setMessage(`Transaction failed: ${getReadableErrorMessage(sendConfirmError)}`);
      setIsSubmitting(false);
    }
    if (sendError) {
      setMessage(getReadableErrorMessage(sendError));
      setIsSubmitting(false);
    }
  }, [
    isConfirmed, confirmError, writeError, writeData,
    isSendConfirmed, sendConfirmError, sendError, sendData,
    isApprovingERC20
  ]);

  // Get explorer URL for transaction
  const getTransactionExplorerUrl = (txHash: string) => {
    return getExplorerUrl(info.network, txHash);
  };

  // Format address display
  const formatTransactionAddress = (address: string) => {
    return formatAddress(address);
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

  function convertAmountBasedOnCurrency(amount: number, currency: string): string {
    // json 最大支持的数字只有16位，在区块链中很容易超过18位，所以要转为 string
    return convertToSmallestUnit(amount, currency).toString();
  }

  // 执行 ERC-20 转账（在授权完成后调用）
  async function proceedWithERC20Transfer() {
    try {
      const amount = parseUnits(info.amount.toString(), currencyConfig.decimals);

      if (!currencyNetworkConfig?.contractAddress) {
        setMessage('Invalid token configuration: no contract address');
        setIsSubmitting(false);
        return;
      }

      // 直接转账
      console.log('Proceeding with direct ERC-20 transfer');
      writeContract({
        address: recipientAddress as `0x${string}`,
        abi: crowdFundingABI,
        functionName: 'contributeERC20',
        args: [project.campaign_id ?? 1, amount],
      });
    } catch (e) {
      setMessage(getReadableErrorMessage(e));
      setIsSubmitting(false);
    }
  }
  // 保存捐赠数据到数据库
  async function saveDonationToDatabase(transactionHash: string, walletAddress?: string) {
    try {
      const response = await fetch('/api/donation', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ...omit(info, ['id', 'amount', 'created_at', 'updated_at', 'selected_reward', 'has_selected_reward', 'pledge_without_reward']),
          amount: convertAmountBasedOnCurrency(info.amount as number, info.currency),
          has_tax_invoice: Number(info.has_tax_invoice),
          is_anonymous: Number(info.is_anonymous),
          account: '',
          method: ProjectDonationMethods.Crypto,
          status: DonationStatus.Successful,
          tx_hash: transactionHash,
          wallet_address: walletAddress || address || '',
          project_slug: project.project_slug,
          reward_id: info.selected_reward?.id || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const errorMessage = errorData.message || response.statusText;

        // 检查是否是交易验证错误
        if (errorMessage.includes('Transaction validation failed')) {
          setMessage(`Transaction verification failed: ${errorMessage.replace('Transaction validation failed:', '').trim()}`);
        } else {
          setMessage('Error saving donation: ' + errorMessage);
        }
        setIsSubmitting(false);
        return;
      }

      const { data, validation } = (await response.json()) as APIResponse<number> & {
        validation?: { verified: boolean }
      };

      // 显示验证成功的信息
      if (validation?.verified) {
        console.log('Transaction verified successfully:');
      }

      info.id = data;
      
      // Set transaction info for step 5
      onTransactionInfo?.({
        hash: transactionHash,
        walletAddress: walletAddress || address || '',
        recipientAddress: recipientAddress || '',
      });
      
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

    // Check configuration validity
    if (!networkConfig) {
      setMessage('Invalid network configuration');
      return;
    }

    if (!currencyConfig) {
      setMessage('Invalid currency configuration');
      return;
    }
    if (!recipientAddress) {
      setMessage('Project wallet address not found for this network');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    // Ethereum transaction
    setIsSolanaTransaction(false);
    if (!isConnected || !address) {
      setMessage('Please connect your wallet first');
      setIsSubmitting(false);
      return;
    }

    // 检查网络链ID是否匹配
    if (networkConfig.chainId && chainId !== networkConfig.chainId) {
      setMessage(`Please switch to ${networkConfig.name}`);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // 将捐赠金额转换为代币的最小单位
      const amount = parseUnits(info.amount.toString(), currencyConfig.decimals);

      console.log('start evm crowd funding contribute');

      if (currencyNetworkConfig?.isNative) {
        // 原生代币通过合约转账
        writeContract({
          address: recipientAddress as `0x${string}`,
          abi: crowdFundingABI,
          functionName: 'contribute',
          args: [project.campaign_id ?? 1], // campaignId, 1 is the default campaign ID
          value: amount,
        });
      } else if (currencyNetworkConfig?.contractAddress) {
        // ERC-20 代币通过合约转账 - 需要先授权
        console.log('Starting ERC-20 transfer process with approval');
        setIsApprovingERC20(true);

        // 第一步：授权合约使用用户的代币
        writeContract({
          address: currencyNetworkConfig.contractAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [recipientAddress, amount],
        });
      } else {
        setMessage('Invalid token configuration: no contract address or native flag');
        setIsSubmitting(false);
        return;
      }

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
        <h1 className="text-xl font-semibold text-center text-gray-900">Finish your pledge</h1>
      </div>

      {/* Explanation text */}
      <div className="mb-12 text-center">
        <p className="text-sm text-gray-900 leading-5">
          Your payment method will be charged immediately if the project hits its goal and you'll receive a confirmation email at{' '}
          <span className="font-semibold">{info.email || 'your registered email'}</span>. Your pledge cannot be canceled or modified.
        </p>
        <p className="text-sm text-gray-900 leading-5 mt-4">
          Any shipping costs and applicable taxes will be charged separately, when the creator is ready to begin fulfillment.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-5 gap-4">
        <p className="text-base sm:text-xl font-semibold text-gray-900">Amount</p>
        <p className="text-2xl sm:text-3xl font-semibold text-blue-600">{info.amount} {info.currency}</p>
        <p className="text-base sm:text-xl font-semibold text-gray-900">~ {(info.dollar ?? 0).toLocaleString()} USD</p>
        {/* 交易状态显示 */}
        {(writeData || sendData || solanaTransactionHash || isApprovingERC20) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-3 w-3 rounded-full ${isSolanaTransaction
                ? (solanaTransactionHash ? 'bg-green-600' : 'bg-blue-600')
                : isApprovingERC20
                  ? 'bg-yellow-500'
                  : ((isConfirmed || isSendConfirmed) ? 'bg-green-600' : (isConfirming || isSendConfirming) ? 'bg-yellow-500' : 'bg-blue-600')
                }`}></div>
              <span className="font-medium text-blue-800">Transaction Status</span>
            </div>
            <div className="space-y-2 text-sm">
              {isApprovingERC20 && (
                <div className="text-yellow-600 mb-2">
                  Step 1/2: Approving token spending permission...
                </div>
              )}
              {(writeData || sendData || solanaTransactionHash) && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transaction Hash:</span>
                    <a
                      href={getTransactionExplorerUrl(isSolanaTransaction ? solanaTransactionHash : (writeData || sendData)!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 text-xs hover:text-blue-800 underline"
                    >
                      {formatTransactionAddress(isSolanaTransaction ? solanaTransactionHash : (writeData || sendData)!)}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${isSolanaTransaction
                      ? (solanaTransactionHash ? 'text-green-600' : 'text-blue-600')
                      : ((isConfirming || isSendConfirming) ? 'text-yellow-600' : (isConfirmed || isSendConfirmed) ? 'text-green-600' : 'text-blue-600')
                      }`}>
                      {isSolanaTransaction
                        ? (solanaTransactionHash ? 'Confirmed ✓' : 'Pending')
                        : ((isConfirming || isSendConfirming) ? 'Confirming...' : (isConfirmed || isSendConfirmed) ? 'Confirmed ✓' : 'Pending')
                      }
                    </span>
                  </div>
                </>
              )}
              {!isSolanaTransaction && (isConfirming || isSendConfirming) && (
                <div className="text-xs text-gray-500 mt-2">
                  Please wait while the transaction is being confirmed on the blockchain...
                </div>
              )}
              {((isSolanaTransaction && solanaTransactionHash) || (!isSolanaTransaction && (isConfirmed || isSendConfirmed))) && (
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
            ? (solanaTransactionHash ? 'Saving...' : isSubmitting ? 'Sending Transaction...' : 'Pledge')
            : (isApprovingERC20 ? 'Approving...' :
              isWritePending || isSendPending ? 'Sending Transaction...' :
                isConfirming || isSendConfirming ? 'Confirming...' :
                  isConfirmed || isSendConfirmed ? 'Saving...' :
                    'Pledge')
        }
        goToPreviousStep={goToPreviousStep}
        isLoading={isSubmitting || isWritePending || isSendPending || isConfirming || isSendConfirming || isApprovingERC20}
        isSubmittable={
          riskAcknowledged &&
          ((window?.phantom?.solana?.isConnected && !isSubmitting) ||
            (!isSubmitting && !isWritePending && !isSendPending && !isConfirming && !isSendConfirming && !isApprovingERC20 && isConnected))
        }
        onSubmit={doSubmit}
      >
        <div className="col-span-2 flex items-center justify-start space-x-2 relative z-[1] mb-3">
          <Checkbox
            id="risk-acknowledgment"
            checked={riskAcknowledged}
            onCheckedChange={(checked) => setRiskAcknowledged(checked === true)}
          />
          <Label htmlFor="risk-acknowledgment" className="text-xs font-normal">
            I understand that rewards aren't guaranteed by either Intuipay or the creator
          </Label>
        </div>
      </CtaFooter>

      {/* Terms and privacy policy below the button */}
      <div className="text-center mt-3">
        <p className="text-xs font-normal text-black/80 leading-4">
          By submitting your pledge, you agree to Intuipay's{' '}
          <a
            href="#"
            className="underline hover:no-underline"
          >
            Terms of Use
          </a>
          {', and '}
          <a
            href="#"
            className="underline hover:no-underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </>
  )
}
