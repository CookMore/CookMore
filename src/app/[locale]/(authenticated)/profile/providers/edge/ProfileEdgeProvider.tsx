'use client'

import React, { useCallback } from 'react'
import type { ProfileMetadata } from '../../profile'

interface ProfileEdgeContextValue {
  profile: ProfileMetadata | null
  isLoading: boolean
  error: Error | null
  refreshProfile: () => Promise<void>
  clearProfileCache: () => Promise<void>
}

const ProfileEdgeContext = React.createContext<ProfileEdgeContextValue | null>(null)

export function ProfileEdgeProvider({
  children,
  address,
}: {
  children: React.ReactNode
  address: string
}) {
  const [profile, setProfile] = React.useState<ProfileMetadata | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const refreshProfile = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/profile/address/${address}`)
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data: ProfileMetadata = await response.json()
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setIsLoading(false)
    }
  }, [address])

  const clearProfileCache = useCallback(async () => {
    if (!address) return
    await fetch(`/api/profile/${address}/cache`, { method: 'DELETE' })
    await refreshProfile()
  }, [address, refreshProfile])

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
        clearProfileCache,
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
