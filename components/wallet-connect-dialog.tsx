'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { clsx } from 'clsx'
import crowdFundingABI from '@/lib/crowdFunding.abi.json'

interface WalletConnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWalletConnected?: (address: string) => void
  projectId?: number // 项目ID，对应合约中的 campaignId
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

export function WalletConnectDialog({ open, onOpenChange, onWalletConnected, projectId, contractAddress }: WalletConnectDialogProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [isProcessingRefund, setIsProcessingRefund] = useState(false)

  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()

  // 合约写入hook
  const { writeContract, data: hash, isPending: isContractPending, error: contractError } = useWriteContract()
  
  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // 获取当前连接的钱包信息
  const getCurrentWalletInfo = () => {
    if (!isConnected || !connector) return null
    
    // 根据 connector id 匹配钱包信息
    const walletName = connector.id === 'metaMaskSDK' || connector.id === 'io.metamask' ? 'metamask' :
      connector.id === 'coinbaseWalletSDK' ? 'coinbase' :
        connector.id === 'walletConnect' ? 'wallet-connect' : 'wallet-connect'
    
    return WALLET_OPTIONS.find(wallet => wallet.id === walletName) || WALLET_OPTIONS[2] // fallback to WalletConnect
  }

  const currentWallet = getCurrentWalletInfo()

  // 当钱包连接成功时
  useEffect(() => {
    if (isConnected && address && connecting) {
      setConnecting(null)
      setError('')
      onOpenChange(false)
      onWalletConnected?.(address)
    }
  }, [isConnected, address, connecting, onWalletConnected, onOpenChange])

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
      setError(`Refund request failed: ${contractError.message}`)
    }
  }, [contractError])

  // 监听交易确认
  useEffect(() => {
    if (isConfirmed) {
      setIsProcessingRefund(false)
      onOpenChange(false)
      onWalletConnected?.(address!)
    }
  }, [isConfirmed, onOpenChange, onWalletConnected, address])

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
      await connect({ connector })
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
    if (!projectId || !contractAddress) {
      setError('Missing project information for refund request')
      return
    }

    setError('')
    setIsProcessingRefund(true)

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: crowdFundingABI,
        functionName: 'requestRefund',
        args: [BigInt(projectId)],
      })
    } catch (error) {
      console.error('Failed to initiate refund request:', error)
      setIsProcessingRefund(false)
      setError('Failed to initiate refund request')
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
            <div className="flex items-center justify-center p-4 border rounded-lg bg-green-50">
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
