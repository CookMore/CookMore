'use client'

import { useEffect, useState } from 'react'
import { ProfileStepProvider } from '../contexts/ProfileStepContext'
import { ProfileTier, type TierStatus } from '../profile'

interface TierProviderProps {
  children: React.ReactNode
  walletAddress: string
}

export function TierProvider({ children, walletAddress }: TierProviderProps) {
  const [tierStatus, setTierStatus] = useState<TierStatus>({
    currentTier: ProfileTier.FREE,
    hasGroup: false,
    hasPro: false,
    hasOG: false,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/profile/address/${walletAddress}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tierStatus) {
          setTierStatus(data.tierStatus)
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('Failed to fetch tier status:', error)
        }
      })

    return () => controller.abort()
  }, [walletAddress])

  return <ProfileStepProvider initialTierStatus={tierStatus}>{children}</ProfileStepProvider>
}
