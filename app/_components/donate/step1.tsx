import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MyCombobox from '@/components/my-combobox';
import { DropdownItemProps } from '@/types';
import { ChangeEvent, useState, useEffect, FormEvent, useCallback } from 'react';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { clsx } from 'clsx';
import Image from 'next/image';
import { Networks, Wallets } from '@/data';
import { WalletConnectButton } from '@/components/wallet-connect-button';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { appkit } from '@/lib/appkit';
import { useMultiWalletBalance } from '@/hooks/use-multi-wallet-balance';

type Props = {
  amount: number | '';
  goToNextStep: () => void;
  paymentMethod: string;
  setAmount: (value: number | '') => void;
  setPaymentMethod: (value: string) => void;
  network: string;
  setNetwork: (value: string) => void;
  selectedWallet: string;
  setSelectedWallet: (value: string) => void;
}

const PaymentMethods: DropdownItemProps[] = [
  {
    icon: 'usdc',
    label: 'USD Coin (USDC) ERC-20',
    value: 'usdc',
  },
  {
    icon: 'solana',
    label: 'Solana (SOL)',
    value: 'sol',
  },
];
export default function DonationStep1({
  amount,
  goToNextStep,
  paymentMethod,
  setAmount,
  setPaymentMethod,
  network,
  setNetwork,
  selectedWallet,
  setSelectedWallet,
}: Props) {
  const [dollar, setDollar] = useState<number | ''>(amount);
  const [error, setError] = useState<string>('');

  // Filter payment methods based on selected network
  const getFilteredPaymentMethods = (): DropdownItemProps[] => {
    if (network === 'ethereum') {
      return PaymentMethods.filter(method => method.value === 'usdc');
    } else if (network === 'solana') {
      return PaymentMethods.filter(method => method.value === 'sol');
    }
    // If no network selected, show all payment methods
    return PaymentMethods;
  };

  // wagmi hooks
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect(); const chainId = useChainId();
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);

  // Get wallet balances for all supported tokens
  const { balances, refreshBalances } = useMultiWalletBalance(network);

  const handleDisconnect = useCallback(() => {
    if ((window as any)?.phantom?.solana) {
      console.log('Disconnecting Phantom wallet');
      (window as any).phantom.solana.disconnect();
      setIsPhantomConnected(false);
      setSelectedWallet('');
    }
    disconnect();
    setError('');
  }, [disconnect, setSelectedWallet]);

  useEffect(() => {
    // 确保在客户端执行
    if (typeof window !== 'undefined' && (window as any).phantom?.solana) {
      const phantom = (window as any).phantom.solana;
      if (phantom.isConnected) {
        console.log('Phantom wallet is already connected');
        setIsPhantomConnected(true);
        setSelectedWallet('phantom');
      }
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
      console.log('Setting up Phantom wallet connection listener');
      phantom.on('connect', handleConnect);
      phantom.on('disconnect', handleDisconnect);
      // Cleanup function to remove event listeners
      return () => {
        console.log('Cleaning up Phantom wallet event listeners');
        phantom.off('connect', handleConnect);
        phantom.off('disconnect', handleDisconnect);
      };
    }
  }, []);
  // Clear selected wallet when network changes if the wallet is not compatible
  useEffect(() => {
    if (selectedWallet) {
      const isWalletCompatible = (() => {
        if (network === 'ethereum') {
          return ['metamask', 'wallet-connect', 'coinbase'].includes(selectedWallet);
        } else if (network === 'solana') {
          return selectedWallet === 'phantom';
        }
        return true;
      })();

      console.log('isWalletCompatible:', isWalletCompatible, 'for network:', network, 'and selectedWallet:', selectedWallet);

      if (!isWalletCompatible) {
        console.log('Clearing selected wallet due to network change');
        setSelectedWallet('');
        // Disconnect if currently connected
        if (isConnected || isPhantomConnected) {
          handleDisconnect();
        }
      }
    }
  }, [network, selectedWallet, isConnected, isPhantomConnected, handleDisconnect, setSelectedWallet]);
  // Clear selected payment method when network changes if the payment method is not compatible
  useEffect(() => {
    if (network && !paymentMethod) {
      const filteredMethods = getFilteredPaymentMethods();
      if (filteredMethods.length === 1 && filteredMethods[0].value) {
        setPaymentMethod(filteredMethods[0].value);
      }
    } else if (paymentMethod) {
      const isPaymentMethodCompatible = (() => {
        if (network === 'ethereum') {
          return paymentMethod === 'usdc';
        } else if (network === 'solana') {
          return paymentMethod === 'sol';
        }
        return true;
      })();

      if (!isPaymentMethodCompatible) {
        setPaymentMethod('');
      }
    }
  }, [network, paymentMethod, setPaymentMethod]);

  const connectorMap = {
    metamask: connectors.find(c => c.id === 'metaMaskSDK' || c.id === 'io.metamask'),
    coinbase: connectors.find(c => c.id === 'coinbaseWalletSDK'),
    'wallet-connect': connectors.find(c => c.id === 'walletConnect'),
  };

  // Monitor connection state changes
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
      } else {
        setError(`Connection failed: ${connectError.message}`);
      }
    }
  }, [connectError]);

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWallet || isPending) return;

    setError('');

    try {
      // Disconnect if already connected to another wallet
      if (isConnected) {
        disconnect();
      }

      // Handle WalletConnect specially
      if (selectedWallet === 'wallet-connect') {
        appkit.open();
        return;
      }

      if (selectedWallet === 'phantom') {
        // handle phantom wallet connection to solana
        (window as any)?.phantom?.solana.connect();
        return;
      }

      // Handle other wallets using wagmi connectors
      const targetConnector = connectorMap[selectedWallet as keyof typeof connectorMap];
      if (!targetConnector) {
        setError('Unsupported wallet type');
        return;
      }

      connect({ connector: targetConnector });
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
    const value = input.value ? Number(input.value) : '';
    setAmount(value);
    setDollar(value);
  }
  // update USDC value based on dollar and payment method
  function onDollarChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value ? Number(input.value) : '';
    setDollar(value);
    setAmount(value);
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

        {/* Network Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Network</Label>
          <MyCombobox
            className="rounded-lg h-12"
            iconClass="top-3"
            iconPath="logo"
            options={Networks}
            onChange={setNetwork}
            value={network}
          />
        </div>
        {/* Wallet Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Select Wallet</Label>
          {(!isConnected && !isPhantomConnected) ? (
            <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-y-6">
              {Wallets.filter(wallet => {
                // Filter wallets based on selected network
                if (network === 'ethereum') {
                  return ['metamask', 'wallet-connect', 'coinbase'].includes(wallet.value || '');
                } else if (network === 'solana') {
                  return wallet.value === 'phantom';
                }
                // If no network selected, show all wallets
                return true;
              }).map(wallet => {
                // Handle WalletConnect separately
                if (wallet.value === 'wallet-connect') {
                  return (
                    <WalletConnectButton
                      key={wallet.value}
                      isSelected={selectedWallet === wallet.value}
                      onClick={() => setSelectedWallet(wallet.value || '')}
                    />
                  )
                }

                // Handle other wallets normally
                return (
                  <label
                    className={clsx(
                      'flex items-center p-3 gap-3 border rounded-lg cursor-pointer',
                      { 'bg-blue-50 border-blue-500': selectedWallet === wallet.value },
                    )}
                    key={wallet.value}
                  >
                    <input
                      checked={selectedWallet === wallet.value}
                      className="hidden"
                      name="wallet"
                      type="radio"
                      onChange={event => setSelectedWallet(event.target.value)}
                      value={wallet.value}
                    />
                    <Image
                      src={`/images/logo/${wallet.icon}.svg`}
                      width={24}
                      height={24}
                      className="size-6"
                      alt={wallet.label || ''}
                      loading="lazy"
                    />
                    <span className="font-medium">{wallet.label}</span>
                  </label>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <Image
                  src={`/images/logo/${Wallets.find(w => w.value === selectedWallet)?.icon}.svg`}
                  width={24}
                  height={24}
                  className="size-6"
                  alt={Wallets.find(w => w.value === selectedWallet)?.label || ''}
                  loading="lazy"
                />
                <span className="font-medium">
                  {Wallets.find(w => w.value === selectedWallet)?.label}
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
          <div className="flex items-center border border-black/10 rounded-lg focus-within:outline focus-within:outline-1 focus-within:outline-blue-400">
            <Input
              className="text-sm h-12 flex-1 px-4 focus:outline-none"
              hasRing={false}
              min="0"
              onChange={onAmountChange}
              placeholder="1.0"
              type="number"
              value={amount}
            />
            <div className="text-sm w-fit flex-none px-4">
              {paymentMethod} ≈ $
            </div>
            <Input
              className="text-sm h-12 flex-1 px-4 focus:outline-none"
              hasRing={false}
              min="0"
              onChange={onDollarChange}
              placeholder="1.00"
              type="number"
              value={dollar}
            />
          </div>
        </div>
        <CtaFooter
          buttonLabel={(isConnected || isPhantomConnected) ? "Next" : "Connect Wallet"}
          buttonType={(isConnected || isPhantomConnected) ? "button" : "submit"}
          isSubmittable={(isConnected || isPhantomConnected) ? !!amount : true}
          isLoading={isPending}
          onSubmit={(isConnected || isPhantomConnected) ? handleSubmit : undefined}
        />
      </div>
    </form>
  )
}
