import Link from 'next/link';
import Image from 'next/image';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  label?: string;
  link?: string;
}

export function IntuipayLogo({
  children,
  label = 'Intuipay Home',
  link = '/',
}: Props) {
  return (
    <Link
      href={link}
      className="flex items-center gap-x-2"
      aria-label={label}
    >
      <Image
        src="/images/intuipay-logo.png"
        className="h-6 w-auto"
        alt="Intuipay Logo"
        width={121}
        height={24}
      />
      <h1 className="sr-only">Intuipay</h1>
      {children}
    </Link>
  );
}
