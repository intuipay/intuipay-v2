'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from '@/lib/appkit'
import { type ReactNode, useState } from 'react'

export function Web3Provider({ children }: { children: ReactNode }) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
