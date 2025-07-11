'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IntuipayLogo } from '@/components/intuipay-logo'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe, CaretDown, List, X } from '@phosphor-icons/react';

const navLinks = [
  { href: '#', label: 'Donate' },
  { href: '#', label: 'Pay' },
  { href: '#', label: 'About' },
  { href: '#', label: 'Support' },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white">
      <div className="w-full max-w-7xl mx-auto px-[120px] md:px-10 flex h-16 items-center justify-between">
        <div className="flex-1">
          <IntuipayLogo />
        </div>

        <nav className="hidden md:flex items-center gap-4 w-min flex-none">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-2 py-1 text-base font-medium transition-colors rounded-lg ${
                link.label === 'Donate' 
                  ? 'text-[#2461F2]' 
                  : 'text-black hover:text-neutral-text'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 hidden md:flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-lg px-3 py-2">
                <Globe size={16} className="mr-2" />
                EN
                <CaretDown size={18} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>EN (English)</DropdownMenuItem>
              <DropdownMenuItem>ES (Español)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            className="text-base font-medium px-6 py-2 bg-white text-black rounded-[32px] border-0"
            variant="ghost"
          >
            <Link
              aria-label="Sign in"
              href="https://dash.intuipay.xyz/login"
              target="_blank"
            >Sign in</Link>
          </Button>
          <Button
            asChild
            className="text-base font-medium bg-black rounded-[32px] text-white hidden lg:block px-6 py-2"
          >
            <Link
              href="https://dash.intuipay.xyz/signup"
              target="_blank"
              aria-label="Get Started"
            >
              Get Started
            </Link>
          </Button>

        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-5 z-40 border-b border-black/10">
          <div className="container flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors py-2 ${
                  link.label === 'Donate' 
                    ? 'text-[#2461F2]' 
                    : 'text-black hover:text-neutral-text'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start rounded-lg">
                  <Globe size={16} className="mr-2" />
                  EN
                  <CaretDown size={18} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>EN (English)</DropdownMenuItem>
                <DropdownMenuItem>ES (Español)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  )
}
