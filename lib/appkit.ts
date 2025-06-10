import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

// 2. Set up Wagmi adapter with all connectors
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia],
  projectId
})

// 3. Configure the metadata
const metadata = {
  name: 'IntuiPay Donation',
  description: 'IntuiPay - 让捐赠更简单',
  url: 'https://intuipay.com',
  icons: ['https://intuipay.com/images/logo.svg']
}

// 4. Create the AppKit instance (only on client side)
let appkit: any = null

if (typeof window !== 'undefined') {
  appkit = createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet, sepolia],
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
  
  // 将 appkit 实例挂载到全局，方便访问
  ;(window as any).appkit = appkit
}

// Export wagmi config for use in providers
export const config = wagmiAdapter.wagmiConfig
export { appkit }
