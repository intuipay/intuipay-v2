import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import MyCombobox from '@/components/my-combobox';
import { Networks, Wallets } from '@/data';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

export default function DonationStep3({
  goToPreviousStep,
  goToNextStep,
}: Props) {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [network, setNetwork] = useState<string>('ethereum');
  const [error, setError] = useState<string>('');

  // wagmi hooks
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();  // 钱包连接器映射
  const connectorMap = {
    metamask: connectors.find(c => c.id === 'metaMaskSDK'),
    coinbase: connectors.find(c => c.id === 'coinbaseWalletSDK'),
    'wallet-connect': connectors.find(c => c.id === 'walletConnect'),
  };
  // Debug: Print connector information
  useEffect(() => {
    console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
    console.log('Connector map:', connectorMap);
  }, [connectors]);

  // Detect installed wallets
  const detected: Record<string, boolean> = {
    metamask: typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask,
    coinbase: typeof window !== 'undefined' && window.ethereum && window.ethereum.isCoinbaseWallet,
    'wallet-connect': true, // WalletConnect 总是可用的
  };  // Monitor connection state changes
  useEffect(() => {
    if (isConnected && address && connector) {
      const walletName = connector.id === 'metaMaskSDK' ? 'metamask' :
        connector.id === 'coinbaseWalletSDK' ? 'coinbase' :
          connector.id === 'walletConnect' ? 'wallet-connect' :
            connector.id;

      console.log(`Wallet connected: ${walletName}`, address, 'Chain ID:', chainId);
      goToNextStep(); // automatically go to next step on successful connection
    }
  }, [isConnected, address, connector, chainId, goToNextStep]);

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
    const targetConnector = connectorMap[selectedWallet as keyof typeof connectorMap];
    if (!targetConnector) {
      setError('Unsupported wallet type');
      return;
    }

    try {
      // Disconnect if already connected to another wallet
      if (isConnected) {
        disconnect();
      }

      connect({ connector: targetConnector });
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(`Connection failed: ${error.message || 'Unknown error'}`);
    }
  };
  return (
    <form
      className="space-y-6 pt-8"
      onSubmit={handleConnect}
    >
      <div className="flex items-center justify-center relative mb-4">
        <button
          onClick={goToPreviousStep}
          className="absolute left-0 hidden sm:block"
          title="Go back to previous step"
          aria-label="Go back to previous step"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Connect with your wallet</h1>
      </div>
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="network" className="text-sm text-gray-600">
          Switch Network
        </Label>
        <MyCombobox
          disabled={isPending}
          iconPath="logo"
          onChange={setNetwork}
          options={Networks}
          value={network}
        />
      </div>

      {/* Wallet Options */}
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-y-6">
        {Wallets.map(wallet => (
          <label className={clsx(
            'flex items-center p-3 gap-3 border rounded-lg cursor-pointer',
            { 'bg-blue-50 border-blue-500': selectedWallet === wallet.value },
            { 'opacity-50': isPending },
          )}
            key={wallet.value}
          >
            <input
              checked={selectedWallet === wallet.value}
              className="hidden"
              disabled={isPending}
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
            {detected[wallet.value as string] && <span className="text-sm text-gray-500">Detected</span>}
          </label>
        ))}
      </div>
      <CtaFooter
        buttonLabel="Connect"
        buttonType="submit"
        goToPreviousStep={goToPreviousStep}
        isLoading={isPending}
        isSubmittable={!!selectedWallet}
      />
    </form>
  )
}
