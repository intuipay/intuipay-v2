'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps, PropsWithChildren } from 'react';
import { Href } from '@react-types/shared';
import { clsx } from 'clsx';

type Props = PropsWithChildren & ComponentProps & {
  activeClassName?: string;
  className?: string;
  href: Href;
}
export function ActiveLink({
  activeClassName,
  children,
  className,
  href,
  ...props
}: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={clsx(className, isActive ? activeClassName : '')}
      {...props}
    >
      {children}
    </Link>
  );
}
