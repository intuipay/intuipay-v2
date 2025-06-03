import { ArrowLeft, TerminalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APIResponse, DonationInfo } from '@/types';
import { useState } from 'react';
import { fetchTidb } from '@/services/fetch-tidb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import omit from 'lodash-es/omit';
import { DonationMethodType, DonationStatus } from '@/constants/donation';

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
          tx_hash: txHash,
          wallet: 'MetaMask',
          wallet_address: '0x1234567890abcdef1234567890abcdef',
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
    <>
      <div className="flex items-center justify-center relative mb-12">
        <button onClick={goToPreviousStep} className="absolute left-0">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Finish your donation</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-5 gap-4">
        <p className="text-xl font-semibold text-gray-900">Your are donating</p>
        <p className="text-3xl font-semibold text-blue-600">{info.amount} {info.currency}</p>
        <p className="text-xl font-semibold text-gray-900">~ {usd.toLocaleString()} USD</p>
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
        <Button
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full gap-2"
          disabled={isSubmitting}
          onClick={doSubmit}
          type="button"
        >
          {isSubmitting && <span className="loading loading-spinner size-4" />}
          Donate
        </Button>
      </div>
    </>
  )
}
