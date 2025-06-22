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
  { href: '#', label: 'Team' },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedNav, setSelectedNav] = useState(navLinks[ 0 ].label)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-mediumgray/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-12 md:px-10 flex h-16 items-center justify-between ">
        <div className="flex-1">
          <IntuipayLogo />
        </div>

        <nav className="hidden md:flex items-center gap-4 w-min flex-none">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-2 text-base font-medium text-neutral-darkgray hover:text-neutral-text transition-colors ${selectedNav === link.label ? 'text-primary' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 hidden md:flex items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe size={16} className="mr-2" />
                EN
                <CaretDown size={16} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>EN (English)</DropdownMenuItem>
              <DropdownMenuItem>ES (Español)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="border-neutral-mediumgray text-base ml-2 bg-primary rounded-full text-white w-28 hidden lg:block">
            Sign In
          </Button>
          <Link
            href={''}
            aria-label={'todo'}
            className="text-primary ml-6 hidden lg:block"
          >
            Create account
          </Link>
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
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg py-4 px-5 z-40">
          <div className="container flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-neutral-darkgray hover:text-neutral-text transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start">
                  <Globe size={16} className="mr-2" />
                  EN
                  <CaretDown size={16} className="ml-1" />
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
