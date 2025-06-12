'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useState, useEffect } from 'react'
import type { Config } from 'wagmi'

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    // 动态导入 appkit 配置以避免 SSR 问题
    const initializeConfig = async () => {
      try {
        const { config: wagmiConfig } = await import('@/lib/appkit')
        setConfig(wagmiConfig)
      } catch (error) {
        console.error('Failed to initialize wagmi config:', error)
      }
    }

    initializeConfig()
  }, [])

  if (!config) {
    return <div>{children}</div>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
