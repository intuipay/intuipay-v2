'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from '@/lib/appkit'
import { type ReactNode, useState } from 'react'

export function Web3Provider({ children, initialState }: { children: ReactNode, initialState: State | undefined }) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
