import { ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { DonationInfo, ShipInfo } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import CtaFooter from '@/app/_components/donate/cta-footer';

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

  // 内部子步骤管理
  type SubStep = 'contact-info' | 'shipping-address';
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>('contact-info');

  // 处理前进到下一个子步骤
  const handleContactNext = () => {
    setCurrentSubStep('shipping-address');
  };

  // 处理返回到上一个子步骤
  const handleGoBackToContact = () => {
    setCurrentSubStep('contact-info');
  };

  // 处理"Same as contact address"功能
  const handleSameAsContact = (checked: boolean) => {
    setInfo({ same_as_contact: checked });

    if (checked) {
      // 复制联系信息到收货地址
      const shippingName = isCompany ? info.company_name : `${info.first_name || ''} ${info.last_name || ''}`.trim();

      const shipInfo: ShipInfo = {
        name: shippingName || '',
        address1: info.address1 || '',
        address2: info.address2 || '',
        country: info.country || '',
        state: info.state || '',
        city: info.city || '',
        zip: info.zip || '',
        email: info.email || '',
        phone: '',
      };

      setInfo({
        ship_info: shipInfo,
      });
    }
  };

  function doSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    if (target.matches(':invalid')) return;

    if (currentSubStep === 'contact-info') {
      handleContactNext();
    } else {
      goToNextStep();
    }
  }
  function onChange() {
    if (form.current) {
      setIsSubmittable(form.current.matches(':valid'));
    }
  }

  useEffect(() => {
    onChange();
  }, []);

  // 联系方式界面
  if (currentSubStep === 'contact-info') {
    return (
      <form
        className="space-y-6 pt-8"
        onChange={onChange}
        onSubmit={doSubmit}
        ref={form}
      >
        <div className="flex items-center justify-center relative">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="absolute left-0 hidden sm:block"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-center text-gray-900">Leave your contact information</h1>
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
            required={!isAnonymous}
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
            required={!isAnonymous}
            value={info.first_name}
          />
          <Input
            className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
            disabled={isAnonymous}
            id="last-name"
            name="last-name"
            onChange={event => setInfo({ last_name: event.target.value })}
            placeholder="Last name *"
            required={!isAnonymous}
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
            required={!isAnonymous}
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
            required={!isAnonymous}
            value={info.country}
          />
          <Input
            className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
            disabled={isAnonymous}
            id="state"
            name="state"
            onChange={event => setInfo({ state: event.target.value })}
            placeholder="State *"
            required={!isAnonymous}
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
            required={!isAnonymous}
            value={info.city}
          />
          <Input
            className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
            disabled={isAnonymous}
            id="zip-code"
            name="zip-code"
            onChange={event => setInfo({ zip: event.target.value })}
            placeholder="Zip code *"
            required={!isAnonymous}
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
            id="email"
            name="email"
            onChange={event => setInfo({ email: event.target.value })}
            placeholder={`Email address${isAnonymous ? '' : ' *'}`}
            required={!isAnonymous}
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
            id="note"
            name="note"
            onChange={event => setInfo({ note: event.target.value })}
            placeholder="Note"
            value={info.note}
            rows={5}
          />
        </div>

        {/* Navigation Buttons */}
        <CtaFooter
          buttonLabel="Next"
          buttonType="submit"
          isSubmittable={isSubmittable}
        >
          <div className="col-span-2 flex items-center justify-center space-x-2 relative z-[1] mb-3">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm font-medium">
              Make my pledge anonymous
            </Label>
          </div>
        </CtaFooter>
      </form>
    );
  }

  // 收货地址界面
  return (
    <form
      className="space-y-6 pt-8"
      onChange={onChange}
      onSubmit={doSubmit}
      ref={form}
    >
      <div className="flex items-center justify-center relative">
        <button
          type="button"
          onClick={handleGoBackToContact}
          className="absolute left-0 hidden sm:block"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-center text-gray-900">Your shipping address</h1>
      </div>

      {/* Same as contact address checkbox */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="same-address"
          checked={info.same_as_contact}
          onCheckedChange={handleSameAsContact}
        />
        <Label htmlFor="same-address" className="text-sm font-semibold">
          Same as the contact address
        </Label>
      </div>

      {/* Shipping Name */}
      <div className="space-y-2">
        <Label htmlFor="shipping-name" className="text-sm font-semibold text-black/50">
          Name
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={info.same_as_contact}
          id="shipping-name"
          name="shipping-name"
          onChange={event => setInfo({
            ship_info: {
              ...info.ship_info,
              name: event.target.value
            } as ShipInfo
          })}
          placeholder="Your name *"
          required={!info.same_as_contact}
          value={info.ship_info?.name || ''}
        />
      </div>

      {/* Shipping Address Fields */}
      <div className="space-y-2">
        <Label htmlFor="shipping-address1" className="text-sm font-semibold text-black/50">
          Address
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={info.same_as_contact}
          id="shipping-address1"
          name="shipping-address1"
          onChange={event => setInfo({
            ship_info: {
              ...info.ship_info,
              address1: event.target.value
            } as ShipInfo
          })}
          placeholder="Line 1*"
          required={!info.same_as_contact}
          value={info.ship_info?.address1 || ''}
        />
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={info.same_as_contact}
          id="shipping-address2"
          name="shipping-address2"
          onChange={event => setInfo({
            ship_info: {
              ...info.ship_info,
              address2: event.target.value
            } as ShipInfo
          })}
          placeholder="Line 2"
          value={info.ship_info?.address2 || ''}
        />
      </div>

      {/* Shipping Country and State */}
      <div className="grid grid-cols-2 gap-2">
        <Label htmlFor="shipping-country" className="text-sm font-semibold text-black/50">
          Country
        </Label>
        <Label htmlFor="shipping-state" className="text-sm font-semibold text-black/50">
          State
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={info.same_as_contact}
          id="shipping-country"
          name="shipping-country"
          onChange={event => setInfo({
            ship_info: {
              ...info.ship_info,
              country: event.target.value
            } as ShipInfo
          })}
          placeholder="Country *"
          required={!info.same_as_contact}
          value={info.ship_info?.country || ''}
        />
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={info.same_as_contact}
          id="shipping-state"
          name="shipping-state"
          onChange={event => setInfo({
            ship_info: {
              ...info.ship_info,
              state: event.target.value
            } as ShipInfo
          })}
          placeholder="State *"
          required={!info.same_as_contact}
          value={info.ship_info?.state || ''}
        />
      </div>

      {/* Shipping City and Zip */}
      <div className="grid grid-cols-2 gap-2">
        <Label htmlFor="shipping-city" className="text-sm font-semibold text-black/50">
          City
        </Label>
        <Label htmlFor="shipping-zip" className="text-sm font-semibold text-black/50">
          Zip Code
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={info.same_as_contact}
          id="shipping-city"
          name="shipping-city"
          onChange={event => setInfo({
            ship_info: {
              ...info.ship_info,
              city: event.target.value
            } as ShipInfo
          })}
          placeholder="City *"
          required={!info.same_as_contact}
          value={info.ship_info?.city || ''}
        />
        <Input
          className="border placeholder:text-sm placeholder:font-semibold disabled:border-black/20"
          disabled={info.same_as_contact}
          id="shipping-zip"
          name="shipping-zip"
          onChange={event => setInfo({
            ship_info: {
              ...info.ship_info,
              zip: event.target.value
            } as ShipInfo
          })}
          placeholder="Zip code *"
          required={!info.same_as_contact}
          value={info.ship_info?.zip || ''}
        />
      </div>

      {/* Contact Email Address */}
      <div className="space-y-2">
        <Label htmlFor="contact-email" className="text-sm font-semibold text-black/50">
          Contact Email Address
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold"
          id="contact-email"
          name="contact-email"
          onChange={event => {
            setInfo({
              ship_info: {
                ...info.ship_info,
                email: event.target.value
              } as ShipInfo
            });
          }}
          placeholder="Email address *"
          required
          type="email"
          value={info?.ship_info?.email ?? ''}
        />
      </div>

      {/* Contact Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="contact-phone" className="text-sm font-semibold text-black/50">
          Contact Phone Number
        </Label>
        <Input
          className="border placeholder:text-sm placeholder:font-semibold"
          id="contact-phone"
          name="contact-phone"
          onChange={event => {
            setInfo({
              ship_info: {
                ...info.ship_info,
                phone: event.target.value
              } as ShipInfo
            });
          }}
          placeholder="Phone Number *"
          required
          type="tel"
          value={info?.ship_info?.phone ?? ''}
        />
      </div>

      {/* Navigation Buttons */}
      <CtaFooter
        buttonType="submit"
        goToPreviousStep={handleGoBackToContact}
        isSubmittable={isSubmittable}
      />
    </form>
  )
}
