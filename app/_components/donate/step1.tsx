import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import MyCombobox from '@/components/my-combobox';
import { DropdownItemProps } from '@/types';
import { ChangeEvent, useState, useEffect, FormEvent } from 'react';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { useMultiWalletBalance } from '@/hooks/use-multi-wallet-balance';
import {
  BLOCKCHAIN_CONFIG,
  getNetworkDropdownOptionsFromProject,
  getSupportedWallets,
  getCurrencyDropdownOptionsFromProject,
} from '@/config/blockchain';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { ProjectInfo } from '@/types';

// 钱包官网链接
const WALLET_INSTALL_LINKS = {
  metamask: 'https://metamask.io/download/',
  phantom: 'https://phantom.app/download'
};

// 检测钱包是否已安装
const isWalletInstalled = (walletId: string): boolean => {
  if (typeof window === 'undefined') return false;

  switch (walletId) {
    case 'metamask':
      return !!(window as any).ethereum?.isMetaMask;
    case 'phantom':
      return !!(window as any).phantom?.solana;
    default:
      return true; // wallet-connect 和 coinbase 总是可用的
  }
};

type Props = {
  amount: number | '';
  goToNextStep: () => void;
  paymentMethod: string;
  setAmount: (value: number | '') => void;
  setPaymentMethod: (value: string) => void;
  selectedWallet: string;
  setSelectedWallet: (value: string) => void;
  network: string;
  setNetwork: (network: string) => void;
  dollar: number | null;
  setDollar: (value: number | null) => void;
  project: ProjectInfo;
}

export default function DonationStep1({
  amount,
  goToNextStep,
  paymentMethod,
  setAmount,
  setPaymentMethod,
  selectedWallet,
  setSelectedWallet,
  network,
  setNetwork,
  dollar,
  setDollar,
  project,
}: Props) {
  const [error, setError] = useState<string>('');
  // 获取配置数据 - 从项目配置中获取
  const networkOptions = getNetworkDropdownOptionsFromProject(project);
  const allWallets = Object.values(BLOCKCHAIN_CONFIG.wallets);

  // wagmi hooks - 用于 EVM 钱包连接
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  // Phantom 钱包连接状态 - 用于 Solana 网络
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);

  // 根据 chainId 获取对应的网络ID
  const getNetworkIdByChainId = (chainId: number): string | null => {
    const networkEntry = Object.entries(BLOCKCHAIN_CONFIG.networks).find(([_, config]) => {
      return config.chainId === chainId;
    });
    return networkEntry ? networkEntry[0] : null;
  };

  // 获取网络对应的 Chain ID
  const getChainIdForNetwork = (networkId: string): number | null => {
    const networkConfig = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
    return networkConfig?.chainId || null;
  };

  // 页面刷新后的网络状态恢复
  useEffect(() => {
    if (!isConnected || !chainId) return;

    const connectedNetworkId = getNetworkIdByChainId(chainId);
    
    // 如果无法解析出网络ID，断开连接
    if (!connectedNetworkId) {
      console.warn('Unknown chainId, disconnecting wallet:', chainId);
      disconnect();
      return;
    }

    const connectedNetworkConfig = BLOCKCHAIN_CONFIG.networks[connectedNetworkId as keyof typeof BLOCKCHAIN_CONFIG.networks];

    // 如果连接的网络不是 EVM 类型，断开连接
    if (connectedNetworkConfig?.type !== 'evm') {
      console.warn('Connected network is not EVM type, disconnecting wallet:', connectedNetworkId);
      disconnect();
      return;
    }

    console.log('Connected network ID:', connectedNetworkId, 'Chain ID:', chainId, network, isConnected, networkOptions);
    // 检查连接的网络是否在当前项目支持的网络列表中
    const isSupportedNetwork = networkOptions.some(option => option.value === connectedNetworkId);
    
    if (isSupportedNetwork) {
      // 如果连接的网络与当前选择的网络不同，同步到连接的网络
      if (connectedNetworkId !== network) {
        console.log('Page refresh detected, syncing to connected network:', connectedNetworkId);
        setNetwork(connectedNetworkId);
        setError(''); // 清除之前的错误
      }
    } else {
      // 连接到了错误的网络，钱包的活跃网络不是用户选择的网络，此时应该提示用户连错了网络，
      // 一般在手机扫码连接容易复现，因为此时钱包app不一定跟用户选择的网络一致
      console.warn('Connected network not supported by current project', connectedNetworkId);
      setError('Connected network not supported, please switch to correct network in your wallet app first'); // 清除错误信息，因为我们主动断开了连接
      disconnect(); // 主动断开连接
    }
  }, [isConnected, chainId]); // 只在连接状态、链ID或项目支持的网络列表变化时执行

  // 获取当前网络配置
  const currentNetwork = BLOCKCHAIN_CONFIG.networks[network as keyof typeof BLOCKCHAIN_CONFIG.networks];
  // Filter payment methods based on selected network
  const getFilteredPaymentMethods = (): DropdownItemProps[] => {
    if (!network) return [];
    const result = getCurrencyDropdownOptionsFromProject(project, network);
    return result;
  };
  
  // Filter wallets based on selected network
  const getFilteredWallets = (): typeof allWallets => {
    if (!network) return allWallets;
    return getSupportedWallets(network);
  };
  // Get wallet balances for all supported tokens
  const { balances } = useMultiWalletBalance(network);

  // 汇率管理
  const {
    rates,
    loading: ratesLoading,
    error: ratesError,
    toUSD,
    fromUSD,
    hasRates
  } = useExchangeRates(network);

  const handleDisconnect = async () => {
    try {
      if (window?.phantom?.solana?.isConnected) {
        console.log('Disconnecting Phantom wallet');
        await window.phantom.solana.disconnect();
        setIsPhantomConnected(false);
        setSelectedWallet('');
      }

      if (isConnected) {
        console.log('Disconnecting wagmi wallet');
        disconnect();
      }

      setError('');
    } catch (error: any) {
      console.error('Disconnect error:', error);
      // 即使断开连接失败，也要清除状态
      setIsPhantomConnected(false);
      setSelectedWallet('');
      setError('');
    }
  };

  // 设置 Phantom 钱包事件监听器
  useEffect(() => {
    // 确保在客户端执行且 Phantom 钱包可用
    if (typeof window !== 'undefined' && window.phantom?.solana) {
      const phantom = window.phantom.solana;

      // 设置连接事件处理器
      const handleConnect = () => {
        console.log('Phantom wallet connected');
        setIsPhantomConnected(true);
        setSelectedWallet('phantom');
        setError('');
      };

      const handleDisconnect = () => {
        console.log('Phantom wallet disconnected');
        setIsPhantomConnected(false);
        setSelectedWallet('');
      };

      // 添加事件监听器
      phantom.on('connect', handleConnect);
      phantom.on('disconnect', handleDisconnect);

      // 清理函数，移除事件监听器
      return () => {
        phantom.off('connect', handleConnect);
        phantom.off('disconnect', handleDisconnect);
      };
    }
  }, []);
  // 当网络改变时，自动设置默认的支付方式
  useEffect(() => {
    if (network && !paymentMethod) {
      const filteredMethods = getFilteredPaymentMethods();
      if (filteredMethods.length === 1 && filteredMethods[0].value) {
        setPaymentMethod(filteredMethods[0].value);
      }
    }
  }, [network, paymentMethod]); // 移除 getFilteredPaymentMethods 依赖

  // 当支付方式改变时，重新计算汇率转换
  useEffect(() => {
    if (paymentMethod && hasRates(paymentMethod) && typeof amount === 'number' && amount > 0) {
      const usdValue = toUSD(amount, paymentMethod);
      setDollar(Math.round(usdValue * 100) / 100);
    }
  }, [paymentMethod, amount, hasRates, toUSD]); // 优化依赖项

  // 创建钱包连接器映射
  const connectorMap = {
    metamask: connectors.find(c => c.id === 'metaMaskSDK' || c.id === 'io.metamask'),
    coinbase: connectors.find(c => c.id === 'coinbaseWalletSDK'),
    'wallet-connect': connectors.find(c => c.id === 'walletConnect'),
  };

  // 刷新页面后，自动根据 wagmi 连接状态恢复钱包选择
  useEffect(() => {
    if (isConnected && address && connector) {
      // 根据连接器ID确定钱包类型
      let walletName = 'wallet-connect'; // 默认为 wallet-connect
      if (connector.id === 'metaMaskSDK' || connector.id === 'io.metamask') {
        walletName = 'metamask';
      } else if (connector.id === 'coinbaseWalletSDK') {
        walletName = 'coinbase';
      } else if (connector.id === 'walletConnect') {
        walletName = 'wallet-connect';
      }

      setSelectedWallet(walletName);
    }
  }, [isConnected, address, connector, chainId]);

  // 监控 wagmi 连接错误
  useEffect(() => {
    if (connectError) {
      console.error('Wallet connection error:', connectError);

      // 处理特定错误
      if (connectError.message.includes('User rejected')) {
        setError('User rejected the connection request');
      } else if (connectError.message.includes('Already processing')) {
        setError('Request is already being processed, please check your wallet');
      } else if (connectError.message.includes('Connector already connected')) {
        // 这种情况通常意味着钱包已经连接，清除错误状态
        console.log('Connector already connected, clearing error state');
        setError('');
        return;
      } else {
        setError(`Connection failed: ${connectError.message}`);
      }
    }
  }, [connectError]);

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWallet || isPending) return;

    setError('');

    // 处理 Phantom 钱包（Solana）
    if (selectedWallet === 'phantom') {
      // 检查 Phantom 钱包是否已安装
      if (!isWalletInstalled('phantom')) {
        window.open(WALLET_INSTALL_LINKS.phantom, '_blank');
        setError('Please install Phantom wallet first');
        return;
      }

      // 如果已连接，直接返回
      if (window?.phantom?.solana?.isConnected) {
        console.log('Phantom wallet is already connected');
        setIsPhantomConnected(true);
        setSelectedWallet('phantom');
        return;
      }

      // 连接 Phantom 钱包
      try {
        console.log('connect to phantom wallet');
        await window?.phantom?.solana?.connect();
        return;
      } catch (phantomError: any) {
        setError(`Phantom connection failed: ${phantomError.message}`);
        return;
      }
    }

    try {
      const currentNetworkConfig = BLOCKCHAIN_CONFIG.networks[network as keyof typeof BLOCKCHAIN_CONFIG.networks];

      // 处理 EVM 钱包（MetaMask, WalletConnect, Coinbase）
      if (currentNetworkConfig?.type === 'evm') {
        // 检查 MetaMask 是否已安装（如果选择的是 MetaMask）
        if (selectedWallet === 'metamask' && !isWalletInstalled('metamask')) {
          window.open(WALLET_INSTALL_LINKS.metamask, '_blank');
          setError('Please install MetaMask wallet first');
          return;
        }

        // 获取目标连接器
        const targetConnector = connectorMap[selectedWallet as keyof typeof connectorMap];
        if (!targetConnector) {
          setError('Unsupported wallet type');
          return;
        }
        const targetChainId = getChainIdForNetwork(network);
        if (!targetChainId) {
          setError(`Unsupported network: ${network}`);
          return;
        }

        // 连接钱包
        console.log(`Connecting to ${selectedWallet} wallet with chain ID ${targetChainId}...`);
        connect({ connector: targetConnector, chainId: targetChainId });
      } else {
        setError('Unsupported network type');
      }
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(`Connection failed: ${error.message || 'Unknown error'}`);
    }
  };
  const handleSubmit = () => {
    if ((isConnected || isPhantomConnected) && amount) {
      goToNextStep();
    }
  };
  // update Dollar value based on amount and payment method
  function onAmountChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value ? Number(input.value) : 0;
    setAmount(value);

    // 使用真实汇率转换为美元金额
    if (value && paymentMethod && hasRates(paymentMethod)) {
      const usdValue = toUSD(value, paymentMethod);
      setDollar(Math.round(usdValue * 100) / 100); // 保留两位小数
    } else {
      setDollar(value);
    }
  }

  // update crypto amount based on dollar and payment method
  function onDollarChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value ? Number(input.value) : 0;
    setDollar(value);

    // 使用真实汇率转换为加密货币金额
    if (value && paymentMethod && hasRates(paymentMethod)) {
      const cryptoValue = fromUSD(value, paymentMethod);
      setAmount(Math.round(cryptoValue * 1000000) / 1000000); // 保留6位小数
    } else {
      setAmount(value);
    }
  }
  return (
    <form onSubmit={handleConnect}>
      <div className="space-y-6 pt-8">
        <h2 className="text-xl font-semibold text-center text-black">Make your donation today</h2>
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {/* Exchange rate error */}
        {ratesError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-600 text-sm">
              fetch rate failed: {ratesError}，use fallback rate instead.
            </p>
          </div>
        )}
        {/* Network Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Network</Label>
          {(isConnected || isPhantomConnected) ? (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <Image
                  src={`/images/logo/${currentNetwork?.icon || 'ethereum'}.svg`}
                  width={24}
                  height={24}
                  className="size-6"
                  alt={currentNetwork?.name || 'Network'}
                  loading="lazy"
                />
                <span className="font-medium">{currentNetwork?.name || network}</span>
              </div>
              <span className="text-sm text-gray-500">Connected</span>
            </div>
          ) : (
            <MyCombobox
              className="rounded-lg h-12"
              iconClass="top-3"
              iconPath="logo"
              options={networkOptions}
              onChange={setNetwork}
              value={network}
            />
          )}
        </div>
        {/* Wallet Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Select Wallet</Label>
          {(!isConnected && !isPhantomConnected) ? (
            <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-y-6">
              {getFilteredWallets().map(wallet => {
                return (
                  <label
                    className={clsx(
                      'flex items-center p-3 gap-3 border rounded-lg cursor-pointer transition-colors',
                      {
                        'bg-blue-50 border-blue-500': selectedWallet === wallet.id
                      }
                    )}
                    key={wallet.id}
                  >
                    <input
                      checked={selectedWallet === wallet.id}
                      className="hidden"
                      name="wallet"
                      type="radio"
                      onChange={event => setSelectedWallet(event.target.value)}
                      value={wallet.id}
                    />
                    <Image
                      src={`/images/logo/${wallet.icon}.svg`}
                      width={24}
                      height={24}
                      className="size-6"
                      alt={wallet.name}
                      loading="lazy"
                    />
                    <span className="font-medium">{wallet.name}</span>
                  </label>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <Image
                  src={`/images/logo/${allWallets.find(w => w.id === selectedWallet)?.icon}.svg`}
                  width={24}
                  height={24}
                  className="size-6"
                  alt={allWallets.find(w => w.id === selectedWallet)?.name || ''}
                  loading="lazy"
                />
                <span className="font-medium">
                  {allWallets.find(w => w.id === selectedWallet)?.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
        {/* Currency Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Donate with</Label>
          <MyCombobox
            className="rounded-lg h-12"
            iconClass="top-3"
            iconPath="information"
            iconExtension="png"
            options={getFilteredPaymentMethods()}
            onChange={setPaymentMethod}
            value={paymentMethod}
            showBalance={isConnected || isPhantomConnected}
            balances={balances}
          />
        </div>
        {/* Amount Input */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Amount</Label>
          <div className={`flex items-center border border-black/10 rounded-lg focus-within:outline focus-within:outline-1 focus-within:outline-blue-400 ${!(isConnected || isPhantomConnected) ? 'bg-gray-50' : ''}`}>
            <Input
              className="text-sm h-12 flex-1 px-4 focus:outline-none"
              hasRing={false}
              min="0"
              onChange={onAmountChange}
              placeholder={!(isConnected || isPhantomConnected) ? 'Connect wallet first' : '1.0'}
              type="number"
              value={amount}
              disabled={!(isConnected || isPhantomConnected)}
            />
            <div className="text-sm w-fit flex-none px-4 flex items-center gap-1">
              {paymentMethod} ≈ $
              {ratesLoading && (
                <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
              )}
            </div>
            <Input
              className="text-sm h-12 flex-1 px-4 focus:outline-none"
              hasRing={false}
              min="0"
              onChange={onDollarChange}
              placeholder={!(isConnected || isPhantomConnected) ? 'Connect wallet first' : '1.00'}
              type="number"
              value={dollar || 0}
              disabled={!(isConnected || isPhantomConnected)}
            />
          </div>
        </div>
        <CtaFooter
          buttonLabel={(isConnected || isPhantomConnected) ? 'Next' : 'Connect Wallet'}
          buttonType={(isConnected || isPhantomConnected) ? 'button' : 'submit'}
          isSubmittable={(isConnected || isPhantomConnected) ? !!amount : true}
          isLoading={isPending}
          onSubmit={(isConnected || isPhantomConnected) ? handleSubmit : undefined}
        />
      </div>
    </form>
  )
}
