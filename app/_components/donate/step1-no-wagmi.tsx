import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import MyCombobox from '@/components/my-combobox';
import { DropdownItemProps } from '@/types';
import { ChangeEvent, useEffect } from 'react';
import CtaFooter from '@/app/_components/donate/cta-footer';
import { clsx } from 'clsx';
import Image from 'next/image';
import { 
  BLOCKCHAIN_CONFIG,
  getNetworkDropdownOptions,
  getSupportedWallets,
  getCurrencyDropdownOptions,
} from '@/config/blockchain';

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
}

export default function Step1NoWagmi({
  amount,
  paymentMethod,
  setAmount,
  setPaymentMethod,
  selectedWallet,
  network,
  setNetwork,
  setDollar,
}: Props) {
  // 获取配置数据
  const networkOptions = getNetworkDropdownOptions();
  const allWallets = Object.values(BLOCKCHAIN_CONFIG.wallets);

  // Filter payment methods based on selected network
  const getFilteredPaymentMethods = (): DropdownItemProps[] => {
    if (!network) return [];
    return getCurrencyDropdownOptions(network);
  };

  // Filter wallets based on selected network
  const getFilteredWallets = (): typeof allWallets => {
    if (!network) return allWallets;
    return getSupportedWallets(network);
  };

  // update Amount value based on amount and payment method
  function onAmountChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value ? Number(input.value) : '';
    setAmount(value);
  }

  // update crypto amount based on dollar and payment method
  function onDollarChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const value = input.value ? Number(input.value) : 0;
    setDollar(value);
  }
  return (
    <form>
      <div className="space-y-6 pt-8">
        <h2 className="text-xl font-semibold text-center text-black">Make your donation today</h2>
        {/* Network Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Network</Label>
          <MyCombobox
            className="rounded-lg h-12"
            iconClass="top-3"
            iconPath="logo"
            options={networkOptions}
            onChange={setNetwork}
            value={network}
          />
        </div>
        {/* Wallet Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black/50">Select Wallet</Label>
          <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-y-6">
            {getFilteredWallets().map(wallet => {
              return (
                <label
                  className={clsx(
                    'flex items-center p-3 gap-3 border rounded-lg cursor-pointer',
                    { 'bg-blue-50 border-blue-500': selectedWallet === wallet.id },
                    // Disable all wallets when wagmi is not ready
                    'opacity-60 cursor-not-allowed'
                  )}
                  key={wallet.id}
                >
                  <input
                    checked={selectedWallet === wallet.id}
                    className="hidden"
                    name="wallet"
                    type="radio"
                    value={wallet.id}
                    disabled={true}
                  />
                  <Image
                    src={`/images/logo/${wallet.icon}.svg`}
                    width={24}
                    height={24}
                    className="size-6"
                    alt={wallet.name || ''}
                    loading="lazy"
                  />
                  <span className="font-medium">{wallet.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">Initializing...</span>
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
            options={getFilteredPaymentMethods()}
            onChange={setPaymentMethod}
            value={paymentMethod}
            showBalance={false} // No balance display in this component
            balances={{}}
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
              disabled={true}
            />
            <div className="text-sm w-fit flex-none px-4 flex items-center gap-1">
              {paymentMethod} ≈ $
            </div>
            <Input
              className="text-sm h-12 flex-1 px-4 focus:outline-none"
              hasRing={false}
              min="0"
              onChange={onDollarChange}
              placeholder="1.00"
              type="number"
              disabled={true}
            />
          </div>
        </div>

        <CtaFooter
          buttonLabel={"Connect Wallet"}
          buttonType={"submit"}
          isSubmittable={false}
          isLoading={false}
        />
      </div>
    </form>
  )
}
