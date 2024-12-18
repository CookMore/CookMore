'use client'

import { useState, useCallback } from 'react'
import type { ProfileMetadata } from '../../../profile'
import { profileCacheService } from '../profile-cache.service'

export function useProfileCache() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const getCachedProfile = useCallback(async (address: string) => {
    try {
      return await profileCacheService.getCachedProfile(address)
    } catch (error) {
      console.error('Error getting cached profile:', error)
      return null
    }
  }, [])

  const syncPendingChanges = useCallback(async (address: string) => {
    try {
      setIsSyncing(true)
      setSyncError(null)
      await profileCacheService.syncPendingChanges(address)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sync changes'
      setSyncError(message)
      throw error
    } finally {
      setIsSyncing(false)
    }
  }, [])

  const storePendingChange = useCallback(
    async (address: string, type: 'create' | 'update' | 'delete', data?: ProfileMetadata) => {
      try {
        await profileCacheService.storePendingChange(address, type, data)
      } catch (error) {
        console.error('Error storing pending change:', error)
        throw error
      }
    },
    []
  )

  const removePendingChange = useCallback(async (address: string) => {
    try {
      await profileCacheService.removePendingChange(address)
    } catch (error) {
      console.error('Error removing pending change:', error)
      throw error
    }
  }, [])

  return {
    getCachedProfile,
    syncPendingChanges,
    storePendingChange,
    removePendingChange,
    isSyncing,
    syncError,
  }
}

export type UseProfileCacheResult = ReturnType<typeof useProfileCache>
