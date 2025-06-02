import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MyCombobox from '@/components/my-combobox';
import { DropdownItemProps } from '@/types';

type Props = {
  amount: number | string;
  goToNextStep: () => void;
  paymentMethod: string;
  setAmount: (value: number) => void;
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
  return <>
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center text-black">Make your donation today</h2>

      {/* Currency Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-black/50">Donate with</Label>
        <MyCombobox
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
        <div className="flex items-center border border-black/10 rounded-lg">
          <Input
            type="number"
            value={amount}
            onChange={(e) => e.target.value && setAmount(Number(e.target.value))}
            className="h-12 w-1/2 px-4"
            step="0.1"
            min="0"
          />
          <div className="text-sm">
            USDC ≈ $ <span className=" text-black/50">{amount}</span>
          </div>
        </div>
      </div>
    </div>
    <Button
      className="mt-12 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-base font-medium"
      disabled={!amount}
      onClick={goToNextStep}
    >
      Donate
    </Button>
  </>
}
