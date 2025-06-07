import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { Label } from '@/components/ui/label';
import MyCombobox from '@/components/my-combobox';
import { Networks, Wallets } from '@/data';
import { Web3 } from 'web3';
import useWalletStore from '@/store/wallet';
import { sleep } from '@/utils';
import CtaFooter from '@/app/_components/donate/cta-footer';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

export default function DonationStep3({
  goToPreviousStep,
  goToNextStep,
}: Props) {
  const setWallet = useWalletStore(state => state.setWallet);
  const [isConnecting, setIsConnecting] = useState<string>('');
  const [network, setNetwork] = useState<string>('ethereum');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const detected: Record<string, boolean> = {
    metamask: window.ethereum && window.ethereum.isMetaMask,
    coinbase: window.ethereum && window.ethereum.isCoinbaseWallet,
  };

  async function connectWallet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedWallet) return;

    setIsConnecting(selectedWallet);
    await sleep(1000); // mock loading
    goToNextStep();
    setIsConnecting('');
    return;

    switch (selectedWallet) {
      case 'metamask':
      case 'coinbase':
        if (!window.ethereum) {
          alert(`${selectedWallet} not detected.`);
          setIsConnecting('');
          return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
          setIsConnecting('');
          throw new Error('No accounts found');
        }
        setWallet(selectedWallet, accounts[ 0 ]);
        console.log('Connected wallet:', accounts[ 0 ]);
        goToNextStep();
        break;

      case 'phantom':
      {
        if (window.phantom && window.phantom.ethereum) {
          const provider = window.phantom.ethereum;
          const web3 = new Web3(provider);
          try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            setWallet(selectedWallet, accounts[ 0 ]);
          } catch (error) {
            // ...
          }
        } else if (window.solana && window.solana.isPhantom) {
          // 这是连接 Solana 的方式
          try {
            const resp = await window.solana.connect();
            console.log(resp.publicKey.toString());
            // 对于 Solana，你需要使用 @solana/web3.js
          } catch (err) {
            // 处理错误
          }
        } else {
          // 提示用户安装 Phantom
        }
      }
    }
    setIsConnecting('');
  }

  return (
    <form
      className="space-y-6 pt-8"
      onSubmit={connectWallet}
    >
      <div className="flex items-center justify-center relative mb-4">
        <button
          onClick={goToPreviousStep}
          className="absolute left-0 hidden sm:block "
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Connect with your wallet</h1>
      </div>

      <div className="space-y-2">
        <Label htmlFor="network" className="text-sm text-gray-600">
          Switch Network
        </Label>
        <MyCombobox
          disabled={!!isConnecting}
          iconPath="logo"
          onChange={setNetwork}
          options={Networks}
          value={network}
        />
      </div>

      {/* Wallet Options */}
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-y-6">
        {Wallets.map(wallet => (
          <label
            className={clsx(
              'flex items-center p-3 gap-3 border rounded-lg cursor-pointer',
              { 'bg-blue-50 border-blue-500': selectedWallet === wallet.value },
              { 'opacity-50': !!isConnecting },
            )}
            key={wallet.value}
          >
            <input
              checked={selectedWallet === wallet.value}
              className="hidden"
              disabled={!!isConnecting}
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
            {detected[ wallet.value as string ] && <span className="text-sm text-gray-500">Detected</span>}
          </label>
        ))}
      </div>

      <CtaFooter
        buttonLabel="Connect"
        buttonType="submit"
        goToPreviousStep={goToPreviousStep}
        isLoading={!!isConnecting}
        isSubmittable={!!selectedWallet}
      />
    </form>
  )
}
