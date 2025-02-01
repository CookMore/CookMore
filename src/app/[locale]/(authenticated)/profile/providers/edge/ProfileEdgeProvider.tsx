'use client'

import React, { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { ProfileMetadata } from '../../profile'

interface ProfileEdgeContextValue {
  profile: ProfileMetadata | null
  isLoading: boolean
  error: Error | null
  refreshProfile: () => void
  clearProfileCache: () => void
}

const ProfileEdgeContext = React.createContext<ProfileEdgeContextValue | null>(null)

export function ProfileEdgeProvider({
  children,
  address,
}: {
  children: React.ReactNode
  address: string
}) {
  const queryClient = useQueryClient()

  const fetchProfile = async (): Promise<ProfileMetadata> => {
    const response = await fetch(`/api/profile/address/${address}`)
    if (!response.ok) {
      const text = await response.text()
      console.error('Error response text:', text)
      throw new Error(`Failed to fetch profile: ${response.statusText}`)
    }
    return response.json()
  }

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', address],
    queryFn: fetchProfile,
    enabled: !!address, // Only run query if address is available
  })

  const refreshProfile = useCallback(() => {
    refetch()
  }, [refetch])

  const clearProfileCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['profile', address] })
    refreshProfile()
  }, [queryClient, address, refreshProfile])

  return (
    <ProfileEdgeContext.Provider
      value={{
        profile: profile || null,
        isLoading,
        error: error as Error | null,
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
