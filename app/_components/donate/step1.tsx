import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MyCombobox from '@/components/my-combobox';
import { DropdownItemProps } from '@/types';
import { ChangeEvent, useState } from 'react';
import CtaFooter from '@/app/_components/donate/cta-footer';

type Props = {
  amount: number | '';
  goToNextStep: () => void;
  paymentMethod: string;
  setAmount: (value: number | '') => void;
  setPaymentMethod: (value: string) => void;
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
        buttonLabel="Donate"
        isSubmittable={!!amount}
        onSubmit={goToNextStep}
      />
    </div>
  </>
}
