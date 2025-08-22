import { clsx } from 'clsx';

type Props = {
  hasDivider?: boolean;
}

export function SiteFooter({
  hasDivider,
}: Props) {
  return (
    <footer className={clsx('py-4', hasDivider ? 'border-t' : 'bg-brand-blue-100 md:py-16')}>
      <div className="px-8 xl:max-w-6xl 2xl:max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end text-center md:text-left">
          <p className="text-xs text-neutral-darkgray text-[#737373]">
            &copy; {new Date().getFullYear()} Intuipay Holding PTE. LTD. All rights reserved.
            <span className="text-neutral-darkgray ms-2">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
