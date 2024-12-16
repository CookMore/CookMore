'use client'

import React, { useCallback } from 'react'
import { BaseEdgeProvider, useEdgeContext } from './BaseEdgeProvider'
import { profileEdgeService } from '@/app/[locale]/(authenticated)/profile/services/profile.service'
import type { Profile } from '@/app/[locale]/(authenticated)/profile/profile'
import type { ServiceResponse } from '@/app/api/services/types'

interface ProfileEdgeContextValue {
  profile: ServiceResponse<Profile> | null
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
  const [profile, setProfile] = React.useState<ServiceResponse<Profile> | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const { options } = useEdgeContext()

  const refreshProfile = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await profileEdgeService.getProfile(address, options)
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setIsLoading(false)
    }
  }, [address, options])

  const clearProfileCache = useCallback(async () => {
    if (!address) return
    await profileEdgeService.invalidateProfile(address)
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

// Composite provider that includes both Base and Profile providers
export function ProfileEdgeProviderWithBase({
  children,
  address,
  initialOptions = {},
}: {
  children: React.ReactNode
  address: string
  initialOptions?: Parameters<typeof BaseEdgeProvider>[0]['initialOptions']
}) {
  return (
    <BaseEdgeProvider initialOptions={initialOptions}>
      <ProfileEdgeProvider address={address}>{children}</ProfileEdgeProvider>
    </BaseEdgeProvider>
  )
}
