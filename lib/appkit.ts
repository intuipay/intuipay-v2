import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

// 定义 Pharos Testnet 链
export const pharosTestnet = defineChain({
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
})

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

// 2. Set up Wagmi adapter with all connectors
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia, pharosTestnet],
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
  networks: [mainnet, sepolia, pharosTestnet],
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

// 辅助函数：向 MetaMask 添加网络
export async function addNetworkToMetaMask(networkId: string) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed')
  }

  // 类型声明
  const ethereum = window.ethereum as any
  // 根据网络ID获取链配置
  let chainConfig
  switch (networkId) {
    case 'pharos-testnet':
      chainConfig = {
        chainId: `0x${pharosTestnet.id.toString(16)}`, // 转换为十六进制 (0xa8090)
        chainName: pharosTestnet.name,
        nativeCurrency: {
          name: pharosTestnet.nativeCurrency.name,
          symbol: pharosTestnet.nativeCurrency.symbol,
          decimals: pharosTestnet.nativeCurrency.decimals,
        },
        rpcUrls: pharosTestnet.rpcUrls.default.http, // 确保是字符串数组
        blockExplorerUrls: [pharosTestnet.blockExplorers.default.url],
      }
      break
    default:
      throw new Error(`Unsupported network: ${networkId}`)
  }
  try {
    // 尝试切换到目标网络
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainConfig.chainId }],
    })
  } catch (switchError: any) {    // 如果网络不存在（错误代码 4902），则添加网络
    if (switchError.code === 4902) {
      try {
        console.log('Adding network with config:', chainConfig)
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainConfig],
        })
        // 添加网络成功后，MetaMask 会自动切换到新网络，无需额外操作
        console.log(`Successfully added and switched to network: ${networkId}`)
      } catch (addError: any) {
        console.log('Failed to add network:', addError)
        console.log('Network config used:', chainConfig)
      }
    } else {
      throw new Error(`Failed to switch network: ${switchError.message || switchError}`)
    }
  }
}
