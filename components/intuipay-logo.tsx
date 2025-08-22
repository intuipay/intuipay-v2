import Link from 'next/link';
import Image from 'next/image';

type Props = {
  label?: string;
  link?: string;
}

export function IntuipayLogo({
  label = 'Intuipay Home',
  link = '/',
}: Props) {
  return (
    <Link
      href={link}
      className="flex items-center space-x-2"
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
    </Link>
  );
}
