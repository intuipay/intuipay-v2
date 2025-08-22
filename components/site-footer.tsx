import { FacebookLogoIcon, TwitterLogoIcon, InstagramLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { clsx } from 'clsx';

type Props = {
  hasDivider?: boolean;
}

const socialLinks = [
  { name: 'Facebook', icon: FacebookLogoIcon, href: '#' },
  { name: 'Twitter', icon: TwitterLogoIcon, href: '#' },
  { name: 'Instagram', icon: InstagramLogoIcon, href: '#' },
  { name: 'LinkedIn', icon: LinkedinLogoIcon, href: '#' },
];

export function SiteFooter({
  hasDivider,
}: Props) {
  return (
    <footer className={clsx('py-4', hasDivider ? 'border-t' : 'bg-brand-blue-100 md:py-16')}>
      <div className="w-full max-w-7xl px-12 md:px-10 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end text-center md:text-left">
          <p className="text-xs text-neutral-darkgray text-[#737373]">
            &copy; {new Date().getFullYear()} Intuipay Holding PTE. LTD. All rights reserved.
            <span className="text-neutral-darkgray ms-2">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="text-neutral-darkgray hover:text-intuipay-blue transition-colors"
              >
                <social.icon size={20} weight="fill" className="text-icon-gray" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
