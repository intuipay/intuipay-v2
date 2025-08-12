'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { clsx } from 'clsx'
import crowdFundingABI from '@/lib/crowdFunding.abi.json'
import { sepolia } from 'wagmi/chains'
import { getExplorerUrl, formatAddress } from '@/config/blockchain'

interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: number // 数据库中的项目ID
  campaignId?: number // 区块链上的活动ID，对应合约中的 campaignId
  contractAddress?: string // 合约地址
}

const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'metamask',
    connectorId: 'metaMaskSDK'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'coinbase',
    connectorId: 'coinbaseWalletSDK'
  },
  {
    id: 'wallet-connect',
    name: 'WalletConnect',
    icon: 'wallet-connect',
    connectorId: 'walletConnect'
  }
]

export function RefundDialog({ open, onOpenChange, projectId, campaignId, contractAddress }: RefundDialogProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [isProcessingRefund, setIsProcessingRefund] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>('')

  const { address, isConnected, connector, chain } = useAccount()
  const { connect, connectors, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  // 合约写入hook
  const { writeContract, data: hash, isPending: isContractPending, error: contractError } = useWriteContract()
  
  // 等待交易确认
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    isError: isTransactionFailed,
    error: transactionError 
  } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}` | undefined,
  })

  // 获取当前连接的钱包信息efund request
  const getCurrentWalletInfo = () => {
    if (!isConnected || !connector) return null
    
    // 根据 connector id 匹配钱包信息
    const walletName = connector.id === 'metaMaskSDK' || connector.id === 'io.metamask' ? 'metamask' :
      connector.id === 'coinbaseWalletSDK' ? 'coinbase' :
        connector.id === 'walletConnect' ? 'wallet-connect' : 'wallet-connect'
    
    return WALLET_OPTIONS.find(wallet => wallet.id === walletName) || WALLET_OPTIONS[ 2 ] // fallback to WalletConnect
  }

  const currentWallet = getCurrentWalletInfo()

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

  // Get explorer URL for transaction
  const getTransactionExplorerUrl = (txHash: string) => {
    return getExplorerUrl('ethereum-sepolia', txHash);
  };

  // Format address display
  const formatTransactionAddress = (address: string) => {
    return formatAddress(address);
  };

  // 监听 writeContract 返回的 hash
  useEffect(() => {
    if (hash) {
      setTransactionHash(hash);
    }
  }, [hash]);

  // 当 dialog 关闭时清除状态
  useEffect(() => {
    if (!open) {
      setError('');
      setIsProcessingRefund(false);
      setConnecting(null);
      // 不立即清除 transactionHash，让用户可以看到最终状态
    }
  }, [open]);

  // 当 dialog 重新打开时，如果有已完成的交易，清除它
  useEffect(() => {
    if (open && transactionHash && (isConfirmed || isTransactionFailed)) {
      // 延迟清除，让用户有时间看到状态
      const timer = setTimeout(() => {
        setTransactionHash('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [open, transactionHash, isConfirmed, isTransactionFailed]);

  // 当钱包连接成功时
  useEffect(() => {
    if (isConnected && address && connecting) {
      setConnecting(null)
      setError('')
      onOpenChange(false)
    }
  }, [isConnected, address, connecting, onOpenChange])

  // 监听连接错误
  useEffect(() => {
    if (connectError) {
      setConnecting(null)
      if (connectError.message.includes('User rejected')) {
        setError('User rejected the connection request')
      } else if (connectError.message.includes('Already processing')) {
        setError('Request is already being processed, please check your wallet')
      } else {
        setError(`Connection failed: ${connectError.message}`)
      }
    }
  }, [connectError])

  // 监听合约错误
  useEffect(() => {
    if (contractError) {
      setIsProcessingRefund(false)
      console.error('Contract error:', contractError)
      setError(`Refund request failed: ${getReadableErrorMessage(contractError)}`)
    }
  }, [contractError])

  // 监听交易确认
  useEffect(() => {
    if (isConfirmed && transactionHash) {
      // 交易确认成功，保存退款信息到数据库
      saveRefundToDatabase(transactionHash)
    }
  }, [isConfirmed, transactionHash])

  // 保存退款数据到数据库
  async function saveRefundToDatabase(txHash: string) {
    try {
      if (!projectId) {
        console.error('Project ID is required to save refund')
        setError('Project ID is missing')
        setIsProcessingRefund(false)
        return
      }

      const response = await fetch('/api/refund', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          campaign_id: campaignId,
          tx_hash: txHash,
          wallet_address: address || '',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        const errorMessage = errorData.message || response.statusText
        console.error('Failed to save refund:', errorMessage)
        setError('Error saving refund: ' + errorMessage)
        setIsProcessingRefund(false)
        return
      }

      const { data, validation } = await response.json()
      
      // 显示验证成功的信息
      if (validation?.verified) {
        console.log('Refund saved successfully with ID:', data)
      }

      setIsProcessingRefund(false)
      // 延迟关闭 dialog 和清除状态，让用户看到成功状态
      setTimeout(() => {
        setTransactionHash('')
        onOpenChange(false)
      }, 2000)
    } catch (e) {
      console.error('Error saving refund:', e)
      setError(`Error saving refund: ${getReadableErrorMessage(e)}`)
      setIsProcessingRefund(false)
    }
  }

  // 监听交易失败
  useEffect(() => {
    if (isTransactionFailed && transactionError) {
      setIsProcessingRefund(false)
      console.error('Transaction failed:', transactionError)
      setError(`Transaction failed: ${getReadableErrorMessage(transactionError)}`)
      // 失败后停止处理，保留 hash 显示失败状态
    }
  }, [isTransactionFailed, transactionError])

  const handleWalletConnect = async (walletOption: typeof WALLET_OPTIONS[0]) => {
    setError('')
    setConnecting(walletOption.id)

    // 查找对应的连接器
    const connector = connectors.find(c => 
      c.id === walletOption.connectorId || 
      (walletOption.id === 'metamask' && c.id === 'io.metamask')
    )

    if (!connector) {
      setError(`${walletOption.name} connector not found`)
      setConnecting(null)
      return
    }

    try {
      connect({ connector })
    } catch (err) {
      console.error('Wallet connection failed:', err)
      setConnecting(null)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setError('')
    setConnecting(null)
  }

  // 处理退款请求
  const handleRefundRequest = async () => {
    if (!campaignId || !contractAddress) {
      setError('Missing campaign information for refund request')
      return
    }

    setError('')
    setIsProcessingRefund(true)
    setTransactionHash('') // 清除之前的交易hash

    try {
      // 检查当前网络是否为 Sepolia
      if (chain?.id !== sepolia.id) {
        try {
          switchChain({ chainId: sepolia.id })
        } catch (switchError) {
          console.error('Failed to switch to Sepolia:', switchError)
          setIsProcessingRefund(false)
          setError('Please switch to Sepolia testnet to continue')
          return
        }
      }

      writeContract({
        address: contractAddress as `0x${string}`,
        abi: crowdFundingABI,
        functionName: 'requestRefund',
        args: [BigInt(campaignId)],
      })
    } catch (error) {
      console.error('Failed to initiate refund request:', error)
      setIsProcessingRefund(false)
      setError(getReadableErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Request Refund</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                {currentWallet && (
                  <Image
                    src={`/images/logo/${currentWallet.icon}.svg`}
                    width={20}
                    height={20}
                    alt={currentWallet.name}
                    className="w-5 h-5"
                  />
                )}
                <span className="text-sm font-medium">
                  {currentWallet?.name || 'Wallet'} Connected
                </span>
                <span className="text-xs text-gray-500">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            </div>
            
            {/* 交易状态显示 */}
            {transactionHash && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-3 w-3 rounded-full ${
                    isConfirmed ? 'bg-green-600' : 
                    isTransactionFailed ? 'bg-red-600' : 
                    isConfirming ? 'bg-yellow-500' : 'bg-blue-600'
                  }`}></div>
                  <span className="font-medium text-blue-800">Transaction Status</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transaction Hash:</span>
                    <a
                      href={getTransactionExplorerUrl(transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 text-xs hover:text-blue-800 underline"
                    >
                      {formatTransactionAddress(transactionHash)}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      isConfirmed ? 'text-green-600' : 
                      isTransactionFailed ? 'text-red-600' :
                      isConfirming ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {isConfirmed ? 'Confirmed ✓' : 
                       isTransactionFailed ? 'Failed ✗' :
                       isConfirming ? 'Confirming...' : 'Pending'}
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
                  {isTransactionFailed && (
                    <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <span>✗</span>
                      <span>Transaction failed. Please try again.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="flex-1"
                disabled={isProcessingRefund || isContractPending || isConfirming}
              >
                Disconnect
              </Button>
              <Button
                onClick={handleRefundRequest}
                disabled={isProcessingRefund || isContractPending || isConfirming}
                className="flex-1 bg-[#2461f2] hover:bg-[#1a4cc7] disabled:opacity-50"
              >
                {isProcessingRefund || isContractPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : isConfirming ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming...</span>
                  </div>
                ) : isTransactionFailed ? (
                  'Retry Withdrawal'
                ) : (
                  'Confirm Withdrawal'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center mb-4">
              Please select a wallet to request your refund
            </p>
            {WALLET_OPTIONS.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletConnect(wallet)}
                disabled={connecting === wallet.id || isPending}
                className={clsx(
                  'w-full flex items-center gap-3 p-4 border rounded-lg transition-colors',
                  'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
                  connecting === wallet.id && 'bg-blue-50 border-blue-200'
                )}
              >
                <Image
                  src={`/images/logo/${wallet.icon}.svg`}
                  width={24}
                  height={24}
                  alt={wallet.name}
                  className="w-6 h-6"
                />
                <span className="font-medium flex-1 text-left">{wallet.name}</span>
                {connecting === wallet.id && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
