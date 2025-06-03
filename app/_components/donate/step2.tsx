import { ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { DonationInfo } from '@/types';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  info: DonationInfo;
  setInfo: (info: Partial<DonationInfo>) => void;
}
export default function DonationStep2({
  goToNextStep,
  goToPreviousStep,
  info,
  setInfo,
}: Props) {
  const form = useRef<HTMLFormElement>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isCompany, setIsCompany] = useState<boolean>(false);
  const [isSubmittable, setIsSubmittable] = useState<boolean>(false);

  function doSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    if (target.matches(':invalid')) return;

    goToNextStep();
  }
  function onChange() {
    if (form.current) {
      setIsSubmittable(form.current.matches(':valid'));
    }
  }

  useEffect(() => {
    onChange();
  }, []);

  return (
    <form
      className="space-y-6"
      onChange={onChange}
      onSubmit={doSubmit}
      ref={form}
    >
      <div className="flex items-center justify-center relative">
        <button
          onClick={goToPreviousStep}
          className="absolute left-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Leave your contract information</h1>
      </div>

      {/* Company/Institution Checkbox */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="company"
          checked={isCompany}
          disabled={isAnonymous}
          onCheckedChange={(checked) => setIsCompany(checked as boolean)}
        />
        <Label htmlFor="company" className="text-sm font-semibold">
          Company / Institution
        </Label>
      </div>

      {isCompany ? <div className="space-y-2">
        <Label htmlFor="company-name" className="text-sm font-semibold text-black/50">
          Company / Institution name
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="company-name"
          name="company"
          onChange={event => setInfo({ company_name: event.target.value })}
          placeholder="Company / Institution Name *"
          required
          value={info.company_name}
        />
      </div> : <div className="grid grid-cols-2 gap-2">
        <Label htmlFor="first-name" className="text-sm font-semibold text-black/50">
          First Name
        </Label>
        <Label htmlFor="last-name" className="text-sm font-semibold text-black/50">
          Last Name
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="first-name"
          name="first-name"
          onChange={event => setInfo({ first_name: event.target.value })}
          placeholder="First name *"
          required
          value={info.first_name}
        />
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="last-name"
          name="last-name"
          onChange={event => setInfo({ last_name: event.target.value })}
          placeholder="Last name *"
          required
          value={info.last_name}
        />
      </div>}

      {/* Address Fields */}
      <div className="space-y-2">
        <Label htmlFor="address1" className="text-sm font-semibold text-black/50">
          Address
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="address1"
          name="address1"
          onChange={event => setInfo({ address1: event.target.value })}
          placeholder="Line 1*"
          required
          value={info.address1}
        />
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="address2"
          name="address2"
          onChange={event => setInfo({ address2: event.target.value })}
          placeholder="Line 2"
          value={info.address2}
        />
      </div>

      {/* Country and State */}
      <div className="grid grid-cols-2 gap-2">
        <Label htmlFor="country" className="text-sm font-semibold text-black/50">
          Country
        </Label>
        <Label htmlFor="state" className="text-sm font-semibold text-black/50">
          State
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="country"
          name="country"
          onChange={event => setInfo({ country: event.target.value })}
          placeholder="Country *"
          required
          value={info.country}
        />
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="state"
          name="state"
          onChange={event => setInfo({ state: event.target.value })}
          placeholder="State *"
          required
          value={info.state}
        />
      </div>

      {/* City and Zip */}
      <div className="grid grid-cols-2 gap-2">
        <Label htmlFor="city" className="text-sm font-semibold text-black/50">
          City
        </Label>
        <Label htmlFor="zip-code" className="text-sm font-semibold text-black/50">
          Zip Code
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="city"
          name="city"
          onChange={event => setInfo({ city: event.target.value })}
          placeholder="City *"
          required
          value={info.city}
        />
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="zip-code"
          name="zip-code"
          onChange={event => setInfo({ zip: event.target.value })}
          placeholder="Zip code *"
          required
          value={info.zip}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-black/50">
          Email Address
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="email"
          name="email"
          onChange={event => setInfo({ email: event.target.value })}
          placeholder="Email address *"
          required
          type="email"
          value={info.email}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            id="tax-invoice"
            checked={info.has_tax_invoice}
            disabled={isAnonymous}
            onCheckedChange={(checked) => setInfo({ has_tax_invoice: checked as boolean })}
          />
          <Label htmlFor="tax-invoice" className="text-sm font-medium text-black/50">
            Send me the tax invoice
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm font-semibold text-black/50">
          Leave a note
        </Label>
        <Textarea
          className="h-30 border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={isAnonymous}
          id="note"
          name="note"
          onChange={event => setInfo({ note: event.target.value })}
          placeholder="Note"
          value={info.note}
          rows={5}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-3 pt-6 sticky left-0 bottom-17 right-0 sm:static bg-white">
        <div className="flex items-center justify-center space-x-2">
          <Checkbox
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
          />
          <Label htmlFor="anonymous" className="text-sm font-medium">
            Make my donation anonymous
          </Label>
        </div>
        <Button
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          disabled={!isSubmittable}
        >
          Next
        </Button>
      </div>
    </form>
  )
}
