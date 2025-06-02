import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import MyCombobox from '@/components/my-combobox';
import { Networks } from '@/data';

type Props = {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

export default function DonationStep3({
  goToPreviousStep,
  goToNextStep,
}: Props) {
  const [network, setNetwork] = useState<string>('ethereum');
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [selectedWallet, setSelectedWallet] = useState<string>('metamask');

  const connectWallet = () => {
    setWalletConnected(true)
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
          iconPath="logo"
          onChange={setNetwork}
          options={Networks}
          value={network}
        />
      </div>

      {/* Wallet Options */}
      <div className="space-y-3 mt-4">
        {/* MetaMask */}
        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">M</span>
            </div>
            <span className="font-medium">MetaMask</span>
          </div>
          <span className="text-sm text-gray-500">Detected</span>
        </div>

        {/* WalletConnect */}
        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">W</span>
            </div>
            <span className="font-medium">WalletConnect</span>
          </div>
          <span className="text-sm text-gray-500">Detected</span>
        </div>

        {/* Phantom */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">P</span>
            </div>
            <span className="font-medium">Phantom</span>
          </div>
        </div>

        {/* Coinbase */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">C</span>
            </div>
            <span className="font-medium">Coinbase</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8 lg:justify-center">
        <Button
          variant="outline"
          className="flex-1 lg:flex-none lg:px-8 rounded-full"
          onClick={goToPreviousStep}
        >
          Back
        </Button>
        <Button
          className="flex-1 lg:flex-none lg:px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          onClick={connectWallet}
        >
          Connect
        </Button>
      </div>
    </div>
  )
}
