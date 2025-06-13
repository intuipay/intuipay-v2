import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MyCombobox from '@/components/my-combobox';
import { DropdownItemProps } from '@/types';
import { ChangeEvent, useState } from 'react';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { clsx } from 'clsx';
import Image from 'next/image';
import { Networks, Wallets } from '@/data';
import { WalletConnectButton } from '@/components/wallet-connect-button';

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

  return <>
    <div className="space-y-6 pt-8">
      <h2 className="text-xl font-semibold text-center text-black">Make your donation today</h2>

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
        <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-y-6">
          {Wallets.map(wallet => {
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
      </div>

      {/* Currency Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-black/50">Donate with</Label>
        <MyCombobox
          className="rounded-lg h-12"
          iconClass="top-3"
          iconPath="information"
          iconExtension="png"
          options={PaymentMethods}
          onChange={setPaymentMethod}
          value={paymentMethod}
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
            USDC ≈ $
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
        buttonLabel="Next"
        isSubmittable={!!amount && !!selectedWallet}
        onSubmit={goToNextStep}
      />
    </div>
  </>
}
