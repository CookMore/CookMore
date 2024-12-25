'use client'

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { usePrivy } from '@privy-io/react-auth'

interface DefaultAvatarProps {
  size?: number
  address?: string
  className?: string
}

export function DefaultAvatar({ size = 40, address, className = '' }: DefaultAvatarProps) {
  const { address: wagmiAddress } = useAccount()
  const { user } = usePrivy()

  // Get the active address from either source
  const activeAddress = address || wagmiAddress || user?.wallet?.address

  const colors = useMemo(() => {
    if (!activeAddress) return { background: '#e9ecef', text: '#868e96' }

    // Generate consistent colors from address
    const hash = activeAddress.slice(2, 10)
    const hue = parseInt(hash, 16) % 360
    const saturation = 70
    const lightness = 60

    return {
      background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      text: `hsl(${hue}, ${saturation}%, 20%)`,
    }
  }, [activeAddress])

  const initials = useMemo(() => {
    if (!activeAddress) return '??'
    return `0x${activeAddress.slice(2, 4).toUpperCase()}`
  }, [activeAddress])

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: colors.background,
        color: colors.text,
        fontSize: size * 0.3,
      }}
    >
      {initials}
    </div>
  )
}
