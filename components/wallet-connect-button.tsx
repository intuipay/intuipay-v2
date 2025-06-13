'use client'

import React from 'react'
import Image from 'next/image'
import { clsx } from 'clsx'
import { appkit } from '@/lib/appkit'

interface WalletConnectButtonProps {
  onConnect?: () => void
  className?: string
  isSelected?: boolean
  onClick?: () => void
}

export function WalletConnectButton({
  onConnect,
  className = '',
  isSelected = false,
  onClick
}: WalletConnectButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (onClick) {
      onClick()
    }

    // Open WalletConnect modal using AppKit instance
    appkit.open()

    onConnect?.()
  }

  return (
    <label
      className={clsx(
        'flex items-center p-3 gap-3 border rounded-lg cursor-pointer',
        { 'bg-blue-50 border-blue-500': isSelected },
        className
      )}
      onClick={handleClick}
    >
      <input
        checked={isSelected}
        className="hidden"
        name="wallet"
        type="radio"
        readOnly
      />
      <Image
        src="/images/logo/wallet-connect.svg"
        width={24}
        height={24}
        className="w-6 h-6"
        alt="WalletConnect"
        loading="lazy"
      />
      <span className="font-medium">WalletConnect</span>
      <span className="text-sm text-gray-500">Detected</span>
    </label>
  )
}
