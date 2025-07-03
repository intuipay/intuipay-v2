'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useState, useEffect } from 'react'
import type { Config } from 'wagmi'
import useStore from '@/store'

const queryClient = new QueryClient()

export const useWagmiReady = () => useStore(state => state.isWagmiReady)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null)
  const setWagmiReady = useStore(state => state.setWagmiReady)

  useEffect(() => {
    // 动态导入 appkit 配置以避免 SSR 问题
    const initializeConfig = async () => {
      try {
        console.log('🔄 Starting wagmi config initialization...')
        const { config: wagmiConfig } = await import('@/lib/appkit')
        console.log('✅ Wagmi config loaded, setting config...')
        setConfig(wagmiConfig)

        // 等待下一个渲染周期再设置 ready，确保 WagmiProvider 已经挂载
        setTimeout(() => {
          console.log('🚀 Setting wagmi ready to true')
          setWagmiReady(true)
        }, 300)
      } catch (error) {
        console.error('❌ Failed to initialize wagmi config:', error)
        setWagmiReady(true) // 即使失败也设置为 ready，让应用继续运行
      }
    }

    initializeConfig()
  }, [setWagmiReady])

  // 如果 config 还没准备好，此时不能使用 wagmi 提供的 hooks
  if (!config) {
    return (
      <div>
        {children}
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
