'use client'

import { useEffect, useState } from 'react'

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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    onConnect?.()
  }

  if (!isClient) {
    return null
  }

  return (
    <div onClick={handleClick} className={className}>
      <appkit-button 
        balance="hide"
        size="md"
        label="Connect WalletConnect"
      />
    </div>
  )
}
