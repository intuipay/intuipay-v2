import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import MyCombobox from '@/components/my-combobox';
import { Networks, Wallets } from '@/data';
import { Web3 } from 'web3';
import useWalletStore from '@/store/wallet';
import { sleep } from '@/utils';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

export default function DonationStep3({
  goToPreviousStep,
  goToNextStep,
}: Props) {
  const setWallet = useWalletStore(state => state.setWallet);
  const [inConnecting, setInConnecting] = useState<string>('');
  const [network, setNetwork] = useState<string>('ethereum');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const detected: Record<string, boolean> = {
    metamask: window.ethereum && window.ethereum.isMetaMask,
    coinbase: window.ethereum && window.ethereum.isCoinbaseWallet,
  };

  async function connectWallet() {
    if (!selectedWallet) return;

    setInConnecting(selectedWallet);
    await sleep(1000); // mock loading
    goToNextStep();
    setInConnecting('');
    return;

    switch (selectedWallet) {
      case 'metamask':
      case 'coinbase':
        if (!window.ethereum) {
          alert(`${selectedWallet} not detected.`);
          setInConnecting('');
          return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
          setInConnecting('');
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
    setInConnecting('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center relative mb-4">
        <button onClick={goToPreviousStep} className="absolute left-0">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Connect with your wallet</h1>
      </div>

      <div className="space-y-2">
        <Label htmlFor="network" className="text-sm text-gray-600">
          Switch Network
        </Label>
        <MyCombobox
          disabled={!!inConnecting}
          iconPath="logo"
          onChange={setNetwork}
          options={Networks}
          value={network}
        />
      </div>

      {/* Wallet Options */}
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-6">
        {Wallets.map(wallet => (
          <label
            className={clsx(
              'flex items-center p-3 gap-3 border rounded-lg cursor-pointer',
              { 'bg-blue-50 border-blue-500': selectedWallet === wallet.value },
              { 'opacity-50': !!inConnecting },
            )}
            key={wallet.value}
          >
            <input
              checked={selectedWallet === wallet.value}
              className="hidden"
              disabled={!!inConnecting}
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

      {/* Navigation Buttons */}
      <div className="pt-6">
        <Button
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full gap-2"
          disabled={!selectedWallet || !!inConnecting}
          onClick={connectWallet}
          type="button"
        >
          {inConnecting && <span className="loading loading-spinner size-4" />}
          Connect
        </Button>
      </div>
    </div>
  )
}
