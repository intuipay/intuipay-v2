'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useState, useEffect, createContext, useContext } from 'react'
import type { Config } from 'wagmi'

const queryClient = new QueryClient()

// 创建一个上下文来跟踪 wagmi 是否已准备好
const WagmiReadyContext = createContext<boolean>(false)

export const useWagmiReady = () => useContext(WagmiReadyContext)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null)
  const [isReady, setIsReady] = useState(false)

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
          setIsReady(true)
        }, 100)
      } catch (error) {
        console.error('❌ Failed to initialize wagmi config:', error)
        setIsReady(true) // 即使失败也设置为 ready，让应用继续运行
      }
    }

    initializeConfig()
  }, [])
  // 如果 config 还没准备好，渲染一个默认的 Provider 结构
  if (!config) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiReadyContext.Provider value={false}>
          {children}
        </WagmiReadyContext.Provider>
      </QueryClientProvider>
    )
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiReadyContext.Provider value={isReady}>
          {children}
        </WagmiReadyContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
