import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

// 定义 Pharos Testnet 链
const pharosTestnet = defineChain({
  id: 688688,
  name: 'Pharos Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Pharos',
    symbol: 'PHRS',
  },
  rpcUrls: {
    default: {
      http: ['https://api.zan.top/node/v1/pharos/testnet/e3d694bd610c4a11a98b15b2296236c3'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Pharos Testnet Explorer',
      url: 'https://testnet.pharosscan.xyz',
    },
  },
  testnet: true,
});


// https://devdocs.educhain.xyz/
const eduTestnet = defineChain({
  id: 656476,
  name: 'EDU Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.open-campus-codex.gelato.digital'],
    },
  },
  blockExplorers: {
    default: {
      name: 'EDU Chain Testnet Explorer',
      url: 'https://edu-chain-testnet.blockscout.com',
    },
  },
  testnet: true,
})

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

// 2. Set up Wagmi adapter with all connectors
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia, pharosTestnet, eduTestnet],
  projectId
})

// 3. Configure the metadata
const metadata = {
  name: 'IntuiPay Donation',
  description: 'IntuiPay - A simple and secure way to donate to your favorite projects.',
  url: 'https://intuipay.xyz',
  icons: ['https://intuipay.xyz/images/logo.svg']
}

// 4. Create the AppKit instance
export const appkit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia, pharosTestnet, eduTestnet],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
  // 启用常用的钱包连接器
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})


// Export wagmi config for use in providers
export const config = wagmiAdapter.wagmiConfig
