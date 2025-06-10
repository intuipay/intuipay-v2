import { ArrowLeft, TerminalIcon, Wallet, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APIResponse, DonationInfo } from '@/types';
import { useState } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import omit from 'lodash-es/omit';
import { DonationMethodType, DonationStatus } from '@/constants/donation';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import useWalletStore from '@/store/wallet';
import Image from 'next/image';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  info: DonationInfo;
}

export default function DonationStep4({
  goToPreviousStep,
  goToNextStep,
  info,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const usd = 100;

  // wagmi hooks
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const wallets = useWalletStore(state => state.wallets);
  // Get network name
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case mainnet.id:
        return 'Ethereum Mainnet';
      case sepolia.id:
        return 'Sepolia Testnet';
      default:
        return `Chain ${chainId}`;
    }
  };

  // Get wallet name
  const getWalletName = (connectorId: string) => {
    switch (connectorId) {
      case 'metaMaskSDK':
        return 'MetaMask';
      case 'coinbaseWalletSDK':
        return 'Coinbase Wallet';
      case 'walletConnect':
        return 'WalletConnect';
      default:
        return connectorId;
    }
  };

  // Format address display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  async function doSubmit() {
    setIsSubmitting(true);
    setMessage('');

    // make donation
    const txHash = 'test-tx-hash-1234567890';

    // save data to DB
    try {
      const response = await fetch('/api/donation', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ...omit(info, ['id', 'created_at', 'updated_at']),
          has_tax_invoice: Number(info.has_tax_invoice),
          is_anonymous: Number(info.is_anonymous),
          account: '',
          method: DonationMethodType.Crypto,
          status: DonationStatus.Successful,
          tx_hash: txHash, wallet: getWalletName(connector?.id || ''),
          wallet_address: address || '',
        }),
      });

      if (!response.ok) {
        setMessage('Error saving donation: ' + response.statusText);
        return;
      }

      const { data } = (await response.json()) as APIResponse<number>;
      info.id = data;
      goToNextStep();
    } catch (e) {
      const errorMessage = (e as Error).message || String(e);
      setMessage(`Error saving donation: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>      <div className="flex items-center justify-center relative mb-12">        <button
      onClick={goToPreviousStep}
      className="absolute left-0 hidden sm:block"
      title="Go back to previous step"
      aria-label="Go back to previous step"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
      <h1 className="text-xl font-semibold text-center text-gray-900">Finish your donation</h1>
    </div>      {/* Wallet connection status */}
      {isConnected && address && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Wallet Connected</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Wallet Type:</span>
              <div className="flex items-center gap-2">
                {connector?.id === 'metaMaskSDK' && (
                  <Image src="/images/logo/metamask.svg" width={16} height={16} alt="MetaMask" />
                )}
                {connector?.id === 'coinbaseWalletSDK' && (
                  <Image src="/images/logo/coinbase.svg" width={16} height={16} alt="Coinbase" />
                )}
                {connector?.id === 'walletConnect' && (
                  <Image src="/images/logo/wallet-connect.svg" width={16} height={16} alt="WalletConnect" />
                )}
                <span className="font-medium text-gray-900">
                  {getWalletName(connector?.id || '')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Wallet Address:</span>
              <span className="font-mono text-gray-900">{formatAddress(address)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Network:</span>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {getNetworkName(chainId)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-green-200">
            <button
              onClick={() => disconnect()}
              className="text-sm text-green-700 hover:text-green-800 underline"
            >
              Switch Wallet
            </button>
          </div>
        </div>
      )}

      {/* Wallet not connected warning */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">No wallet connection detected</p>
              <p className="text-sm text-yellow-700 mt-1">
                Please go back to the previous step to connect your wallet
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-5 gap-4">
        <p className="text-base sm:text-xl font-semibold text-gray-900">Your are donating</p>
        <p className="text-2xl sm:text-3xl font-semibold text-blue-600">{info.amount} {info.currency}</p>
        <p className="text-base sm:text-xl font-semibold text-gray-900">~ {usd.toLocaleString()} USD</p>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6">
        {message && (
          <Alert
            className="mb-4"
            variant="destructive"
          >
            <TerminalIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>      <CtaFooter
        buttonLabel="Donate"
        goToPreviousStep={goToPreviousStep}
        isLoading={isSubmitting}
        isSubmittable={!isSubmitting && isConnected}
        onSubmit={doSubmit}
      />
    </>
  )
}
