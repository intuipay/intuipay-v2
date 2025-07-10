import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import MyCombobox from '@/components/my-combobox';
import { DropdownItemProps } from '@/types';
import { ChangeEvent, useState, useEffect, FormEvent, useCallback, useRef } from 'react';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { clsx } from 'clsx';
import Image from 'next/image';
import { WalletConnectButton } from '@/components/wallet-connect-button';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { appkit } from '@/lib/appkit';
import { useMultiWalletBalance } from '@/hooks/use-multi-wallet-balance';
import {
  BLOCKCHAIN_CONFIG,
  getNetworkDropdownOptionsFromProject,
  getSupportedWallets,
  getCurrencyDropdownOptionsFromProject,
} from '@/config/blockchain';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { ProjectInfo } from '@/types';
import { Widget as WidgetPage } from './LifiWidget';

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
  const lifiModalRef = useRef<HTMLDialogElement>(null);
  // 获取配置数据 - 从项目配置中获取
  const networkOptions = getNetworkDropdownOptionsFromProject(project);
  const allWallets = Object.values(BLOCKCHAIN_CONFIG.wallets);

  // wagmi hooks
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);

  // 根据 chainId 获取对应的网络ID
  const getNetworkIdByChainId = (chainId: number): string | null => {
    const networkEntry = Object.entries(BLOCKCHAIN_CONFIG.networks).find(([_, config]) => {
      return config.chainId === chainId;
    });
    return networkEntry ? networkEntry[ 0 ] : null;
  };

  // 如果是重新刷新页面，对于 evm 钱包来说，连接还在，所以可以恢复出连接的网络来
  // 但是phantom solana钱包，刷新页面后 window.phantom.solana.isConnected 就变为 false 了，等于是已经断开了连接
  // 所以如果之前连上了 phantom 钱包，刷新页面后，连接状态会丢，此时网络展示默认的 ethereum sepolia
  useEffect(() => {
    if (isConnected && chainId) {
      const connectedNetworkId = getNetworkIdByChainId(chainId);
      if (connectedNetworkId && connectedNetworkId !== network) {
        // 检查连接的网络是否在当前项目支持的网络列表中
        const isSupportedNetwork = networkOptions.some(option => option.value === connectedNetworkId);
        if (isSupportedNetwork) {
          console.log('Syncing to connected network:', connectedNetworkId);
          setNetwork(connectedNetworkId);
        } else {
          console.log('Connected network not supported by current project:', connectedNetworkId);
          // 可以选择断开连接或者保持当前默认网络
        }
      }
    }
  }, [isConnected, chainId, network, networkOptions]);

  // 获取当前网络配置
  const currentNetwork = BLOCKCHAIN_CONFIG.networks[ network as keyof typeof BLOCKCHAIN_CONFIG.networks ];
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

  const handleDisconnect = useCallback(async () => {
    try {
      if (window?.phantom?.solana) {
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
  }, [disconnect, setSelectedWallet, isConnected]);

  useEffect(() => {
    if (network && !paymentMethod) {
      // 自动设置第一个 currency，否则用户不选择下拉菜单，就不会触发 setPaymentMethod
      const filteredMethods = getFilteredPaymentMethods();
      if (filteredMethods.length === 1 && filteredMethods[ 0 ].value) {
        setPaymentMethod(filteredMethods[ 0 ].value);
      }
    }
  }, [network, paymentMethod]);

  // 当支付方式改变时，重新计算汇率转换
  useEffect(() => {
    if (paymentMethod && hasRates(paymentMethod) && typeof amount === 'number' && amount > 0) {
      const usdValue = toUSD(amount, paymentMethod);
      setDollar(Math.round(usdValue * 100) / 100);
    }
  }, [paymentMethod, hasRates, amount, toUSD]);

  const connectorMap = {
    metamask: connectors.find(c => c.id === 'metaMaskSDK' || c.id === 'io.metamask'),
    coinbase: connectors.find(c => c.id === 'coinbaseWalletSDK'),
    'wallet-connect': connectors.find(c => c.id === 'walletConnect'),
  };

  // 刷新页面后，自动根据 wagmi 连接，恢复出之前选中的钱包
  useEffect(() => {
    if (isConnected && address && connector) {
      setError('');

      const walletName = connector.id === 'metaMaskSDK' || connector.id === 'io.metamask' ? 'metamask' :
        connector.id === 'coinbaseWalletSDK' ? 'coinbase' :
          connector.id === 'walletConnect' ? 'wallet-connect' :
            'wallet-connect'; // 未识别的钱包，应该算到 WalletConnect里去，展示已连接钱包图标的时候用得到
      setSelectedWallet(walletName);
    }
  }, [isConnected, address, connector, chainId]);

  // Monitor connection errors
  useEffect(() => {
    if (connectError) {
      console.error('Wallet connection error:', connectError);

      // Handle specific errors
      if (connectError.message.includes('User rejected')) {
        setError('User rejected the connection request');
      } else if (connectError.message.includes('Already processing')) {
        setError('Request is already being processed, please check your wallet');
      } else if (connectError.message.includes('Connector already connected')) {
        // 这种情况下通常意味着钱包已经连接，不应该显示错误
        console.log('Connector already connected, clearing error state');
        setError('');
        return;
      } else {
        setError(`Connection failed: ${connectError.message}`);
      }
    }
  }, [connectError]);

  // Monitor switch chain errors
  useEffect(() => {
    if (switchChainError) {
      console.error('Network switch error:', switchChainError);
      
      if (switchChainError.message?.includes('User rejected')) {
        setError('User rejected the network switch request');
      } else if (switchChainError.message?.includes('Unrecognized chain')) {
        setError('Network is not available in your wallet. Please add it manually.');
      } else {
        setError(`Network switch failed: ${switchChainError.message}`);
      }
    }
  }, [switchChainError]);

  // 获取网络对应的 Chain ID
  const getChainIdForNetwork = (networkId: string): number | null => {
    const network = BLOCKCHAIN_CONFIG.networks[networkId as keyof typeof BLOCKCHAIN_CONFIG.networks];
    return network?.chainId || null;
  };
  // 切换到指定网络的函数
  const switchToTargetNetwork = (networkId: string) => {
    const targetChainId = getChainIdForNetwork(networkId);
    if (!targetChainId) {
      throw new Error(`Unsupported network: ${networkId}`);
    }

    // switchChain 返回 void，错误处理在 useEffect 中监听 switchChainError
    switchChain({ chainId: targetChainId });
  };

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWallet || isPending) return;

    setError('');

    try {
      // 检查钱包是否已安装（对于需要浏览器插件的钱包）
      if (selectedWallet === 'metamask' || selectedWallet === 'phantom') {
        if (!isWalletInstalled(selectedWallet)) {
          const installUrl = WALLET_INSTALL_LINKS[ selectedWallet as keyof typeof WALLET_INSTALL_LINKS ];
          window.open(installUrl, '_blank');
          setError(`Please install ${selectedWallet === 'metamask' ? 'MetaMask' : 'Phantom'} wallet first`);
          return;
        }
      }

      // Handle WalletConnect specially (直接打开，不需要网络切换逻辑)
      if (selectedWallet === 'wallet-connect') {
        appkit.open();
        return;
      }

      // Handle Phantom wallet for Solana
      if (selectedWallet === 'phantom') {
        if (window?.phantom?.solana?.isConnected) {
          console.log('Phantom wallet is already connected');
          setIsPhantomConnected(true);
          setSelectedWallet('phantom');
          return;
        }
        window?.phantom?.solana?.connect();
        return;
      }

      // 获取目标连接器（只处理 EVM 钱包）
      const targetConnector = connectorMap[selectedWallet as keyof typeof connectorMap];
      if (!targetConnector) {
        setError('Unsupported wallet type');
        return;
      }

      const currentNetworkConfig = BLOCKCHAIN_CONFIG.networks[network as keyof typeof BLOCKCHAIN_CONFIG.networks];
      const targetChainId = getChainIdForNetwork(network);

      // 只处理 EVM 网络
      if (currentNetworkConfig?.type !== 'evm' || !targetChainId) {
        setError('Invalid network configuration');
        return;
      }

      // 未连接钱包，直接连接
      console.log(`Connecting to ${selectedWallet} wallet with chainId ${targetChainId}...`);
      connect({ connector: targetConnector, chainId: targetChainId });
      
      // 连接成功后，网络切换会在连接成功的 useEffect 中处理
      
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
    <>
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
                // Handle WalletConnect separately
                if (wallet.id === 'wallet-connect') {
                  return (
                    <WalletConnectButton
                      key={wallet.id}
                      isSelected={selectedWallet === wallet.id}
                      onClick={() => setSelectedWallet(wallet.id)}
                    />
                  )
                }

                // Handle other wallets normally
                return (
                  <label
                    className={clsx(
                      'flex items-center p-3 gap-3 border rounded-lg cursor-pointer',
                      { 'bg-blue-50 border-blue-500': selectedWallet === wallet.id },
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
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
        {/* Currency Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-black/50">Donate with</Label>
            {(isConnected || isPhantomConnected) && (
              <button
                type="button"
                onClick={() => lifiModalRef.current?.showModal()}
                className="text-sm text-gray-500 mr-3"
              >
                Swap
              </button>
            )}
          </div>
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
          isLoading={isPending || isSwitchingChain}
          onSubmit={(isConnected || isPhantomConnected) ? handleSubmit : undefined}
        />
      </div>
    </form>

    {/* LiFi Widget Modal */}
    <dialog ref={lifiModalRef} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Swap</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => lifiModalRef.current?.close()}
          >
            ✕
          </button>
        </div>
        <div className="py-4">
          <WidgetPage />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    </>
  )
}
