'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useState, useEffect } from 'react'
import type { Config } from 'wagmi'

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 动态导入 appkit 配置以避免 SSR 问题
    const initializeConfig = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const { config: wagmiConfig } = await import('@/lib/appkit')
        setConfig(wagmiConfig)
      } catch (error) {
        console.error('Failed to initialize wagmi config:', error)
        setError('Failed to initialize wallet connection')
      } finally {
        setIsLoading(false)
      }
    }

    initializeConfig()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing wallet connection...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Wallet configuration not available</p>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
