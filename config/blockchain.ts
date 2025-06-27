import { DropdownItemProps } from "@/types";

// 区块链网络配置
export interface NetworkConfig {
    id: string;
    name: string;
    icon: string;
    chainId?: number; // Ethereum chain ID
    rpcUrl?: string; // Solana RPC URL
    explorerUrl: string;
    explorerName: string;
    type: 'evm' | 'solana'; // 网络类型
    fundsDividerContract?: string; // 手续费分配合约地址
}

// 钱包配置
export interface WalletConfig {
    id: string;
    name: string;
    icon: string;
    supportedNetworks: string[]; // 支持的网络ID列表
    connectorId?: string; // wagmi connector ID
    isExternal?: boolean; // 是否为外部钱包（如Phantom）
}

// 加密货币配置
export interface CryptoCurrencyConfig {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    networks: Array<{
        networkId: string;
        contractAddress?: string; // ERC-20代币合约地址
        isNative?: boolean; // 是否为该网络的原生代币
    }>;
}

// 大学钱包地址配置
export interface UniversityWalletConfig {
    networkId: string;
    address: string;
}

// 统一的区块链配置
export const BLOCKCHAIN_CONFIG = {
    // 网络配置
    networks: {
        'ethereum-sepolia': {
            id: 'ethereum-sepolia',
            name: 'Ethereum Sepolia',
            icon: 'ethereum',
            chainId: 11155111,
            rpcUrl: 'https://sepolia.infura.io/v3/3f0a3b8ee4134ebcb0947ecb057dcba5', // Joey's personal project
            explorerUrl: 'https://sepolia.etherscan.io',
            explorerName: 'Etherscan',
            type: 'evm',
            fundsDividerContract: '0xfEeC3028Af62B78E0D54F650063E1800Ac7Dfd98',
        } as NetworkConfig,
        'ethereum-mainnet': {
            id: 'ethereum-mainnet',
            name: 'Ethereum Mainnet',
            icon: 'ethereum',
            chainId: 1,
            rpcUrl: 'https://eth.llamarpc.com',
            explorerUrl: 'https://etherscan.io',
            explorerName: 'Etherscan',
            type: 'evm',
            // fundsDividerContract: '', // TODO: Deploy contract on mainnet
        } as NetworkConfig,
        'solana-devnet': {
            id: 'solana-devnet',
            name: 'Solana Devnet',
            icon: 'solana',
            rpcUrl: 'https://api.devnet.solana.com',
            explorerUrl: 'https://explorer.solana.com',
            explorerName: 'Solana Explorer',
            type: 'solana',
        } as NetworkConfig,
        'solana-mainnet': {
            id: 'solana-mainnet',
            name: 'Solana Mainnet',
            icon: 'solana',
            rpcUrl: 'https://api.mainnet-beta.solana.com',
            explorerUrl: 'https://explorer.solana.com',
            explorerName: 'Solana Explorer',
            type: 'solana',
        } as NetworkConfig,
        'pharos-testnet': {
            id: 'pharos-testnet',
            name: 'Pharos Testnet',
            icon: 'pharos',
            chainId: 688688,
            rpcUrl: 'https://api.zan.top/node/v1/pharos/testnet/e3d694bd610c4a11a98b15b2296236c3',
            explorerUrl: 'https://testnet.pharosscan.xyz',
            explorerName: 'Pharos Testnet Explorer',
            type: 'evm',
            // fundsDividerContract: '', // TODO: Deploy contract on pharos testnet
        } as NetworkConfig,
    },

    // 钱包配置
    wallets: {
        metamask: {
            id: 'metamask',
            name: 'MetaMask',
            icon: 'metamask',
            supportedNetworks: ['ethereum-sepolia', 'ethereum-mainnet', 'pharos-testnet'],
            connectorId: 'metaMaskSDK',
        } as WalletConfig,
        'wallet-connect': {
            id: 'wallet-connect',
            name: 'WalletConnect',
            icon: 'wallet-connect',
            supportedNetworks: ['ethereum-sepolia', 'ethereum-mainnet', 'pharos-testnet'],
            connectorId: 'walletConnect',
        } as WalletConfig,
        coinbase: {
            id: 'coinbase',
            name: 'Coinbase Wallet',
            icon: 'coinbase',
            supportedNetworks: ['ethereum-sepolia', 'ethereum-mainnet', 'pharos-testnet'],
            connectorId: 'coinbaseWalletSDK',
        } as WalletConfig,
        phantom: {
            id: 'phantom',
            name: 'Phantom',
            icon: 'phantom',
            supportedNetworks: ['solana-devnet', 'solana-mainnet'],
            isExternal: true,
        } as WalletConfig,
    },

    // 加密货币配置
    currencies: {
        usdc: {
            id: 'usdc',
            name: 'USD Coin',
            symbol: 'USDC',
            icon: 'usdc',
            decimals: 6,
            networks: [
                {
                    networkId: 'ethereum-sepolia',
                    contractAddress: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', // USDC on Sepolia testnet
                },
                {
                    networkId: 'ethereum-mainnet',
                    contractAddress: '0xA0b86a33E6441e16174B7d45cfE8b84D5bF4E5F1', // USDC on Ethereum mainnet
                },
                {
                    networkId: 'pharos-testnet',
                    contractAddress: '0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED',
                },
                {
                    networkId: 'solana-devnet',
                    contractAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr', // USDC-Dev on Solana Devnet, not circle's USDC
                },
                {
                    networkId: 'solana-mainnet',
                    contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana Mainnet
                }
            ],
        } as CryptoCurrencyConfig,
        sol: {
            id: 'sol',
            name: 'Solana',
            symbol: 'SOL',
            icon: 'solana',
            decimals: 9,
            networks: [
                {
                    networkId: 'solana-devnet',
                    isNative: true,
                },
                {
                    networkId: 'solana-mainnet',
                    isNative: true,
                },
            ],
        } as CryptoCurrencyConfig,
        phrs: {
            id: 'phrs',
            name: 'Pharos',
            symbol: 'PHRS',
            icon: 'pharos-logo',
            decimals: 18,
            networks: [
                {
                    networkId: 'pharos-testnet',
                    isNative: true,
                },
            ],
        } as CryptoCurrencyConfig,
        eth: {
            id: 'eth',
            name: 'Ethereum',
            symbol: 'ETH',
            icon: 'ethereum',
            decimals: 18,
            networks: [
                {
                    networkId: 'ethereum-sepolia',
                    isNative: true,
                },
                {
                    networkId: 'ethereum-mainnet',
                    isNative: true,
                },
            ],
        } as CryptoCurrencyConfig,
    },

    // 大学钱包地址配置
    universityWallets: [
        {
            networkId: 'ethereum-sepolia',
            address: '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86',
        },
        {
            networkId: 'ethereum-mainnet',
            address: '0xE62868F9Ae622aa11aff94DB30091B9De20AEf86',
        },
        {
            networkId: 'solana-devnet',
            address: 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
        },
        {
            networkId: 'solana-mainnet',
            address: 'Ft7m7qrY3spLNKo6aMAHMArAT3oLSSy4DnJ3y3SF1DP1',
        },
        {
            networkId: 'pharos-testnet',
            address: '0xfFe4b50BC2885e4708544477B6EeD4B32e4d82BF', // 请替换为实际的 Pharos 钱包地址
        },
    ] as UniversityWalletConfig[],
} as const;

// 辅助函数

/**
 * 获取指定网络支持的钱包列表
 */
export function getSupportedWallets(networkId: string): WalletConfig[] {
    return Object.values(BLOCKCHAIN_CONFIG.wallets).filter(wallet =>
        wallet.supportedNetworks.includes(networkId)
    );
}

/**
 * 获取指定网络支持的货币列表
 */
export function getSupportedCurrencies(networkId: string): CryptoCurrencyConfig[] {
    return Object.values(BLOCKCHAIN_CONFIG.currencies).filter(currency =>
        currency.networks.some(network => network.networkId === networkId)
    );
}

/**
 * 获取指定货币在指定网络上的配置
 */
export function getCurrencyNetworkConfig(currencyId: string, networkId: string) {
    const currency = BLOCKCHAIN_CONFIG.currencies[currencyId as keyof typeof BLOCKCHAIN_CONFIG.currencies];
    if (!currency) return null;

    return currency.networks.find(network => network.networkId === networkId) || null;
}

/**
 * 获取大学在指定网络上的钱包地址
 */
export function getUniversityWalletAddress(networkId: string): string | null {
    const wallet = BLOCKCHAIN_CONFIG.universityWallets.find(w => w.networkId === networkId);
    return wallet?.address || null;
}

/**
 * 将网络配置转换为下拉框选项
 */
export function getNetworkDropdownOptions(): DropdownItemProps[] {
    return Object.values(BLOCKCHAIN_CONFIG.networks).map(network => ({
        icon: network.icon,
        label: network.name,
        value: network.id,
    }));
}

/**
 * 将钱包配置转换为下拉框选项
 */
export function getWalletDropdownOptions(networkId?: string): DropdownItemProps[] {
    const wallets = networkId
        ? getSupportedWallets(networkId)
        : Object.values(BLOCKCHAIN_CONFIG.wallets);

    return wallets.map(wallet => ({
        icon: wallet.icon,
        label: wallet.name,
        value: wallet.id,
    }));
}

/**
 * 将货币配置转换为下拉框选项
 */
export function getCurrencyDropdownOptions(networkId?: string): DropdownItemProps[] {
    const currencies = networkId
        ? getSupportedCurrencies(networkId)
        : Object.values(BLOCKCHAIN_CONFIG.currencies);

    return currencies.map(currency => ({
        icon: currency.icon,
        label: `${currency.name} (${currency.symbol})`,
        value: currency.id,
    }));
}

/**
 * 根据项目配置获取网络下拉框选项
 */
export function getNetworkDropdownOptionsFromProject(project: any): DropdownItemProps[] {
    if (!project?.networks || !Array.isArray(project.networks)) {
        // 如果项目没有配置网络，则返回默认的所有网络
        console.warn('Project does not have networks configured, returning all networks.', project);
        return getNetworkDropdownOptions();
    }

    return project.networks
        .map((networkId: string) => {
            const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
            if (!network) return null;
            return {
                icon: network.icon,
                label: network.name,
                value: network.id,
            };
        })
        .filter(Boolean) as DropdownItemProps[];
}

/**
 * 根据项目配置获取货币下拉框选项
 */
export function getCurrencyDropdownOptionsFromProject(project: any, networkId: string): DropdownItemProps[] {
    if (!project?.tokens || !project.tokens[networkId]) {
        // 如果项目没有配置代币，则返回该网络的默认代币
        return getCurrencyDropdownOptions(networkId);
    }

    return project.tokens[networkId]
        .map((currencyId: string) => {
            const currency = BLOCKCHAIN_CONFIG.currencies[currencyId as keyof typeof BLOCKCHAIN_CONFIG.currencies];
            if (!currency) return null;
            return {
                icon: currency.icon,
                label: `${currency.name} (${currency.symbol})`,
                value: currency.id,
            };
        })
        .filter(Boolean) as DropdownItemProps[];
}

/**
 * 获取交易浏览器URL
 */
export function getExplorerUrl(networkId: string, txHash: string): string {
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
    if (!network) return '';

    if (network.type === 'solana') {
        const cluster = networkId.includes('devnet') ? '?cluster=devnet' : '';
        return `${network.explorerUrl}/tx/${txHash}${cluster}`;
    } else {
        return `${network.explorerUrl}/tx/${txHash}`;
    }
}

/**
 * 检查钱包是否与网络兼容
 */
export function isWalletCompatibleWithNetwork(walletId: string, networkId: string): boolean {
    const wallet = BLOCKCHAIN_CONFIG.wallets[walletId as keyof typeof BLOCKCHAIN_CONFIG.wallets];
    return wallet ? wallet.supportedNetworks.includes(networkId) : false;
}

/**
 * 检查货币是否与网络兼容
 */
export function isCurrencyCompatibleWithNetwork(currencyId: string, networkId: string): boolean {
    const currency = BLOCKCHAIN_CONFIG.currencies[currencyId as keyof typeof BLOCKCHAIN_CONFIG.currencies];
    return currency ? currency.networks.some(network => network.networkId === networkId) : false;
}

/**
 * 格式化地址显示
 */
export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * 根据货币和金额计算最小单位
 */
export function convertToSmallestUnit(amount: number, currencyId: string): bigint | number {
    const currency = BLOCKCHAIN_CONFIG.currencies[currencyId as keyof typeof BLOCKCHAIN_CONFIG.currencies];
    if (!currency) return amount;

    if (currencyId === 'sol') {
        // Solana使用lamports
        return amount * 1_000_000_000; // LAMPORTS_PER_SOL
    } else {
        // 其他代币使用10^decimals
        return BigInt(Math.floor(amount * Math.pow(10, currency.decimals)));
    }
}

/**
 * 从项目配置获取指定网络的钱包地址
 */
export function getWalletAddressFromProject(project: any, networkId: string): string | null {
    if (!project?.wallets || !project.wallets[networkId]) {
        return null;
    }

    // 简单格式：每个网络一个钱包地址
    return project.wallets[networkId];
}

/**
 * 获取项目在指定网络上的钱包地址（如果没有项目配置，则使用默认的大学钱包地址）
 */
export function getProjectWalletAddress(project: any, networkId: string): string | null {
    // 优先使用项目配置的钱包地址
    const projectWallet = getWalletAddressFromProject(project, networkId);
    if (projectWallet) {
        return projectWallet;
    }

    throw new Error(`No wallet address configured for network ${networkId} in project.`);
}

/**
 * 获取指定网络的手续费分配合约地址
 */
export function getFundsDividerContract(networkId: string): string | null {
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
    return network?.fundsDividerContract || null;
}
