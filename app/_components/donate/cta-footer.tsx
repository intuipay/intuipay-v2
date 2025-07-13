import { Button } from '@/components/ui/button';
import { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

type Props = PropsWithChildren & {
  buttonLabel?: string;
  buttonType?: 'submit' | 'button';
  goToPreviousStep?: () => void;
  isLoading?: boolean;
  isSubmittable: boolean;
  onSubmit?: () => void;
}
export default function CtaFooter({
  buttonLabel = 'Next',
  buttonType = 'button',
  children,
  goToPreviousStep,
  isLoading,
  isSubmittable,
  onSubmit,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 pt-6 sticky left-0 bottom-17 right-0 sm:static sm:block">
      <div className="absolute -left-8 -right-8 top-0 bottom-0 sm:hidden bg-white z-0 shadow-footer pointer-events-none" />
      {children}
      {goToPreviousStep && <Button
        className="h-12 text-base font-semibold rounded-full relative z-[1] sm:hidden"
        onClick={goToPreviousStep}
        type="button"
        variant="outline"
      >
        Back
      </Button>}
      <Button
        className={clsx(
          'w-full text-base font-semibold gap-2 h-12 bg-[var(--brand-color)] hover:bg-[var(--brand-color)]/80 text-white rounded-full relative z-[1]',
          { 'col-span-2': !goToPreviousStep }
        )}
        disabled={!isSubmittable || isLoading}
        onClick={onSubmit}
        type={buttonType}
      >
        {isLoading && <span className="loading loading-spinner size-4" />}
        {buttonLabel}
      </Button>
    </div>
  )
}
