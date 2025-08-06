'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, type State } from 'wagmi'
import { config } from '@/lib/appkit'
import { type ReactNode } from 'react'

const queryClient = new QueryClient();

export function Web3Provider({ children, initialState }: { children: ReactNode, initialState: State | undefined }) {  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
