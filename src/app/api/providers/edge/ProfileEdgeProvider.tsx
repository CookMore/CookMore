'use client'

import React, { useCallback } from 'react'
import type { Profile, ProfileResponse } from '@/app/[locale]/(authenticated)/profile/profile'

interface ProfileEdgeContextValue {
  profile: ProfileResponse | null
  isLoading: boolean
  error: Error | null
  refreshProfile: () => Promise<void>
}

const ProfileEdgeContext = React.createContext<ProfileEdgeContextValue | null>(null)

export function ProfileEdgeProvider({
  children,
  address,
}: {
  children: React.ReactNode
  address: string
}) {
  const [profile, setProfile] = React.useState<ProfileResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const refreshProfile = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/profile/${address}`)
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // Initial fetch
  React.useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  return (
    <ProfileEdgeContext.Provider
      value={{
        profile,
        isLoading,
        error,
        refreshProfile,
      }}
    >
      {children}
    </ProfileEdgeContext.Provider>
  )
}

export function useProfileEdge() {
  const context = React.useContext(ProfileEdgeContext)
  if (!context) {
    throw new Error('useProfileEdge must be used within a ProfileEdgeProvider')
  }
  return context
}
