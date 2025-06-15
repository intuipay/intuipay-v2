'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IntuipayLogo } from '@/components/intuipay-logo'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe, ChevronDown, Menu, X } from 'lucide-react'

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
      <div className="container flex h-16 items-center justify-between lg:px-30 px-12">
        <IntuipayLogo />

        <nav className="hidden md:flex items-center gap-4">
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

        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                EN
                <ChevronDown className="ml-1 h-4 w-4" />
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
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg py-4 z-40">
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
                  <Globe className="mr-2 h-4 w-4" />
                  EN
                  <ChevronDown className="ml-1 h-4 w-4" />
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
