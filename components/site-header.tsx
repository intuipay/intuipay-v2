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
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-center justify-between py-3 px-12 lg:px-[120px] md:px-10">
        {/* Logo Section */}
        <div className="flex-grow basis-0 min-w-0">
          <IntuipayLogo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 flex-none">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-2 py-1 text-base font-medium transition-colors rounded-lg ${
                link.label === 'Donate' 
                  ? 'text-[#2461F2]' 
                  : 'text-black hover:text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="flex-grow basis-0 min-w-0 hidden md:flex items-center justify-end gap-2">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-lg px-3 py-2 text-base font-medium">
                EN
                <CaretDown size={18} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>EN (English)</DropdownMenuItem>
              <DropdownMenuItem>ES (Español)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sign In Button */}
          <Button
            asChild
            className="text-base font-medium px-6 py-2 bg-white text-black rounded-[32px] hover:bg-gray-50 transition-colors"
            variant="ghost"
          >
            <Link
              aria-label="Sign in"
              href="https://dash.intuipay.xyz/login"
              target="_blank"
            >
              Sign in
            </Link>
          </Button>

          {/* Get Started Button */}
          <Button
            asChild
            className="text-base font-medium bg-black rounded-[32px] text-white hover:bg-gray-800 transition-colors px-6 py-2"
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="h-10 w-10"
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-black/10 z-40">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-base font-medium py-2 transition-colors ${
                    link.label === 'Donate' 
                      ? 'text-[#2461F2]' 
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

            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-3 pt-2">
              <Button
                asChild
                className="text-base font-medium px-6 py-3 bg-white text-black rounded-[32px] border border-gray-200 hover:bg-gray-50 transition-colors"
                variant="ghost"
              >
                <Link
                  aria-label="Sign in"
                  href="https://dash.intuipay.xyz/login"
                  target="_blank"
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
                  href="https://dash.intuipay.xyz/signup"
                  target="_blank"
                  aria-label="Get Started"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
    </header>
  )
}
