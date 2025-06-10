'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useState, useEffect } from 'react'
import type { Config } from 'wagmi'

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
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
    // 在配置加载前显示加载状态
    return <div>{children}</div>
  }

  return (
    <WagmiProvider config={config as unknown as any}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
