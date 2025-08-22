'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IntuipayLogo } from '@/components/intuipay-logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth-client';
import { GlobeIcon, CaretDownIcon, ListIcon, XLogoIcon, SignOutIcon } from '@phosphor-icons/react';
import { User } from 'better-auth';
import { Href } from '@react-types/shared';
import { useRouter } from 'next/navigation';
import { ActiveLink } from '@/components/view/active-link';

const navLinks = [
  { href: '/docs', label: 'Documentation' },
  { href: '/knowledge', label: 'Knowledge Space' },
  { href: '/updates', label: 'Updates' },
  { href: '/help', label: 'Help' },
];

const userMenuItems = [
  { href: '/profile', label: 'Profile' },
  { href: process.env.NEXT_PUBLIC_DASHBOARD_URL, label: 'Dashboard' },
];

interface SiteHeaderProps {
  user?: User | null;
}

export function SupportHeader({ user }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await authClient.signOut();
    router.replace('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-center py-3 px-8 md:px-12 lg:px-28">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <IntuipayLogo link="/support" label="Intuipay Support home" />
          <span className="text-xl font-semibold">Support</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 flex-none ms-11">
          {navLinks.map((link) => (
            <ActiveLink
              key={link.label}
              href={link.href}
              activeClassName="text-blue-600 hover:text-blue-500"
              inactiveClassName="text-black hover:text-gray-600"
              className="px-2 py-1 text-base font-medium transition-colors rounded-lg"
            >
              {link.label}
            </ActiveLink>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="flex-grow basis-0 min-w-0 hidden lg:flex items-center justify-end gap-2">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-lg px-3 py-2 text-base font-medium">
                EN
                <CaretDownIcon size={18} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>EN (English)</DropdownMenuItem>
              <DropdownMenuItem>ES (Español)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            /* User Avatar Menu */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.image || ''}
                      alt={user.name || user.email || 'User'}
                    />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && (
                      <p className="font-medium">{user.name}</p>
                    )}
                    {user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href as Href}>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={handleSignOut}>
                  <SignOutIcon className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Sign In / Get Started Buttons for non-authenticated users */
            <>
              <Button
                asChild
                className="text-base font-medium px-6 py-2 bg-white text-black rounded-[32px] hover:bg-gray-50 transition-colors"
                variant="ghost"
              >
                <Link
                  aria-label="Sign in"
                  href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/login`}
                >
                  Sign in
                </Link>
              </Button>

              <Button
                asChild
                className="text-base font-medium bg-black rounded-[32px] text-white hover:bg-gray-800 transition-colors px-6 py-2"
              >
                <Link
                  href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/signup`}
                  aria-label="Get Started"
                >
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="h-10 w-10"
          >
            {mobileMenuOpen ? <XLogoIcon size={24} /> : <ListIcon size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-black/10 z-40">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-base font-medium py-2 transition-colors ${
                    link.label === 'Donate' 
                      ? 'text-blue-600' 
                      : 'text-black hover:text-gray-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start rounded-lg w-full">
                  <GlobeIcon size={16} className="mr-2" />
                  EN
                  <CaretDownIcon size={18} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>EN (English)</DropdownMenuItem>
                <DropdownMenuItem>ES (Español)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-3 pt-2">
              {user ? (
                /* User Info and Actions for authenticated users */
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ''}
                        alt={user.name || user.email || 'User'}
                      />
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      {user.name && (
                        <p className="font-medium text-sm">{user.name}</p>
                      )}
                      {user.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {userMenuItems.map((item) => (
                    <Button
                      key={item.label}
                      asChild
                      className="text-base font-medium px-6 py-3 bg-white text-black rounded-[32px] border border-gray-200 hover:bg-gray-50 transition-colors"
                      variant="ghost"
                    >
                      <Link
                        href={item.href as Href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </Button>
                  ))}

                  <Button
                    onClick={handleSignOut}
                    className="text-base font-medium bg-red-600 rounded-[32px] text-white hover:bg-red-700 transition-colors px-6 py-3"
                  >
                    <SignOutIcon className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                /* Sign In / Get Started Buttons for non-authenticated users */
                <>
                  <Button
                    asChild
                    className="text-base font-medium px-6 py-3 bg-white text-black rounded-[32px] border border-gray-200 hover:bg-gray-50 transition-colors"
                    variant="ghost"
                  >
                    <Link
                      aria-label="Sign in"
                      href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/login`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="text-base font-medium bg-black rounded-[32px] text-white hover:bg-gray-800 transition-colors px-6 py-3"
                  >
                    <Link
                      href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/signup`}
                      aria-label="Get Started"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
    </header>
  );
}
