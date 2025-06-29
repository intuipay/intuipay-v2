import { ArrowLeft, TerminalIcon } from 'lucide-react';
import { APIResponse, DonationInfo } from '@/types';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import omit from 'lodash-es/omit';
import { DonationMethodType, DonationStatus } from '@/constants/donation';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import { TransactionMessage, VersionedTransaction, SystemProgram, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  BLOCKCHAIN_CONFIG,
  getProjectWalletAddress,
  getCurrencyNetworkConfig,
  getExplorerUrl,
  formatAddress,
  convertToSmallestUnit,
  getFundsDividerContract
} from '@/config/blockchain';
import { DonationProject } from '@/types';
import IntuipayFundsDividerABI from '@/lib/IntuipayFundsDivider.abi.json';
import ERC20_ABI from '@/lib/erc20.abi.json';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  info: DonationInfo;
  project: DonationProject;
}

export default function DonationStep4({
  goToPreviousStep,
  goToNextStep,
  info,
  project,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [solanaTransactionHash, setSolanaTransactionHash] = useState<string>('');
  const [isSolanaTransaction, setIsSolanaTransaction] = useState<boolean>(false);
  // 动态获取配置
  const networkConfig = BLOCKCHAIN_CONFIG.networks[info.network as keyof typeof BLOCKCHAIN_CONFIG.networks];
  const currencyConfig = BLOCKCHAIN_CONFIG.currencies[info.currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
  const currencyNetworkConfig = getCurrencyNetworkConfig(info.currency, info.network);
  // 从项目配置中读出收款钱包，配置不对的话会报错
  const recipientAddress = getProjectWalletAddress(project, info.network);
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

  function convertAmountBasedOnCurrency(amount: number, currency: string): number {
    return Number(convertToSmallestUnit(amount, currency));
  }

  // 执行 ERC-20 转账（在授权完成后调用）
  async function proceedWithERC20Transfer() {
    try {
      const amount = parseUnits(info.amount.toString(), currencyConfig.decimals);
      const fundsDividerContract = getFundsDividerContract(info.network);

      if (!currencyNetworkConfig?.contractAddress) {
        setMessage('Invalid token configuration: no contract address');
        setIsSubmitting(false);
        return;
      }

      if (fundsDividerContract) {
        console.log('Proceeding with ERC-20 transfer through contract');
        writeContract({
          address: fundsDividerContract as `0x${string}`,
          abi: IntuipayFundsDividerABI,
          functionName: 'divideERC20Transfer',
          args: [
            currencyNetworkConfig.contractAddress as `0x${string}`,
            recipientAddress as `0x${string}`,
            amount
          ],
        });
      } else {
        // 直接转账
        console.log('Proceeding with direct ERC-20 transfer');
        writeContract({
          address: currencyNetworkConfig.contractAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [recipientAddress as `0x${string}`, amount],
        });
      }
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
          ...omit(info, ['id', 'amount', 'created_at', 'updated_at']),
          amount: convertAmountBasedOnCurrency(info.amount as number, info.currency),
          has_tax_invoice: Number(info.has_tax_invoice),
          is_anonymous: Number(info.is_anonymous),
          account: '',
          method: DonationMethodType.Crypto,
          status: DonationStatus.Successful,
          tx_hash: transactionHash,
          wallet_address: walletAddress || address || '',
          project_slug: project.project_slug,
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
    // Solana transaction
    if (networkConfig.type === 'solana') {
      const phantom = window?.phantom?.solana;
      if (phantom && phantom.isConnected) {
        setIsSolanaTransaction(true);
        try {
          const connection = new Connection(networkConfig.rpcUrl || clusterApiUrl("devnet"));
          let instructions = [];

          // 根据代币类型构造不同的交易指令
          if (currencyNetworkConfig?.isNative) {
            // SOL 原生代币转账
            console.log('Creating SOL native transfer instruction');
            instructions = [
              SystemProgram.transfer({
                fromPubkey: phantom.publicKey,
                toPubkey: new PublicKey(recipientAddress),
                lamports: Math.floor(info.amount * Math.pow(10, currencyConfig.decimals)),
              }),
            ];
          } else if (currencyNetworkConfig?.contractAddress) {
            // SPL Token 转账（如 USDC）
            console.log('Creating SPL Token transfer instruction for:', currencyConfig.symbol);

            const mintAddress = new PublicKey(currencyNetworkConfig.contractAddress);
            const fromWallet = phantom.publicKey;
            const toWallet = new PublicKey(recipientAddress);

            // 获取或创建发送者的关联代币账户
            const fromTokenAccount = await getAssociatedTokenAddress(
              mintAddress,
              fromWallet,
              false,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            );

            // 获取或创建接收者的关联代币账户
            const toTokenAccount = await getAssociatedTokenAddress(
              mintAddress,
              toWallet,
              false,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            );

            // 检查接收者的代币账户是否存在
            const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

            // 如果接收者的代币账户不存在，需要先创建
            if (!toTokenAccountInfo) {
              console.log('Creating associated token account for recipient');
              const { createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');
              instructions.push(
                createAssociatedTokenAccountInstruction(
                  fromWallet, // payer
                  toTokenAccount, // associatedToken
                  toWallet, // owner
                  mintAddress, // mint
                  TOKEN_PROGRAM_ID,
                  ASSOCIATED_TOKEN_PROGRAM_ID
                )
              );
            }

            // 计算转账金额（转换为代币的最小单位）
            const transferAmount = Math.floor(info.amount * Math.pow(10, currencyConfig.decimals));

            console.log('SPL Token transfer details:', {
              fromTokenAccount: fromTokenAccount.toString(),
              toTokenAccount: toTokenAccount.toString(),
              amount: transferAmount,
              decimals: currencyConfig.decimals
            });

            // 创建转账指令
            instructions.push(
              createTransferInstruction(
                fromTokenAccount, // source
                toTokenAccount, // destination
                fromWallet, // owner
                transferAmount, // amount
                [],
                TOKEN_PROGRAM_ID
              )
            );
          } else {
            throw new Error('Invalid token configuration: no contract address or native flag');
          }

          // get latest `blockhash`
          let blockhash = await connection.getLatestBlockhash().then((res) => res.blockhash);

          // create v0 compatible message
          const messageV0 = new TransactionMessage({
            payerKey: phantom.publicKey,
            recentBlockhash: blockhash,
            instructions,
          }).compileToV0Message();

          // make a versioned transaction
          const transactionV0 = new VersionedTransaction(messageV0);

          console.log('Solana transaction created:', transactionV0);
          const result = await phantom.signAndSendTransaction(transactionV0);
          console.log('Solana transaction result:', result);

          if (result?.signature) {
            // Set transaction hash for UI display
            setSolanaTransactionHash(result.signature);
            // Transaction successful, save to database
            await saveDonationToDatabase(result.signature, phantom.publicKey.toString());
          } else {
            setMessage('Transaction failed: No signature returned');
            setIsSubmitting(false);
          }
        } catch (e) {
          setMessage(`Solana transaction failed: ${getReadableErrorMessage(e)}`);
          setIsSubmitting(false);
        }
        return;
      } else {
        setMessage('Phantom wallet is not connected');
        setIsSubmitting(false);
        return;
      }
    }    // Ethereum transaction
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

      // 检查是否使用手续费分配合约
      const fundsDividerContract = getFundsDividerContract(info.network);

      if (fundsDividerContract) {
        // 使用手续费分配合约转账
        console.log('Using funds divider contract for transaction');

        if (currencyNetworkConfig?.isNative) {
          // 原生代币通过合约转账
          writeContract({
            address: fundsDividerContract as `0x${string}`,
            abi: IntuipayFundsDividerABI,
            functionName: 'divideNativeTransfer',
            args: [recipientAddress as `0x${string}`],
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
            args: [fundsDividerContract as `0x${string}`, amount],
          });
        } else {
          setMessage('Invalid token configuration: no contract address or native flag');
          setIsSubmitting(false);
          return;
        }
      } else {
        // 直接转账（原有逻辑）
        if (currencyNetworkConfig?.isNative) {
          // 原生代币交易（ETH, PHRS 等）
          console.log('Sending native token transaction');
          sendTransaction({
            to: recipientAddress as `0x${string}`,
            value: amount,
          });
        } else if (currencyNetworkConfig?.contractAddress) {
          // ERC-20 代币交易
          console.log('Sending ERC-20 token transaction');
          writeContract({
            address: currencyNetworkConfig.contractAddress as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [recipientAddress as `0x${string}`, amount],
          });
        } else {
          setMessage('Invalid token configuration: no contract address or native flag');
          setIsSubmitting(false);
          return;
        }
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
        <h1 className="text-xl font-semibold text-center text-gray-900">Finish your donation</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-5 gap-4">
        <p className="text-base sm:text-xl font-semibold text-gray-900">You are donating</p>
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
            ? (solanaTransactionHash ? "Saving..." : isSubmitting ? "Sending Transaction..." : "Donate")
            : (isApprovingERC20 ? "Approving..." :
              isWritePending || isSendPending ? "Sending Transaction..." :
                isConfirming || isSendConfirming ? "Confirming..." :
                  isConfirmed || isSendConfirmed ? "Saving..." :
                    "Donate")
        }
        goToPreviousStep={goToPreviousStep}
        isLoading={isSubmitting || isWritePending || isSendPending || isConfirming || isSendConfirming || isApprovingERC20}
        isSubmittable={
          (window?.phantom?.solana?.isConnected && !isSubmitting) ||
          (!isSubmitting && !isWritePending && !isSendPending && !isConfirming && !isSendConfirming && !isApprovingERC20 && isConnected)
        }
        onSubmit={doSubmit}
      />
    </>
  )
}
